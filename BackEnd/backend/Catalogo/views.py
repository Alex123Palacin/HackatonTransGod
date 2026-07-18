from django.db.models import Exists, OuterRef, Prefetch, Q
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from Scanner.models import Escaneo

from .models import AtributoAve, Ave, AveEncontrada, FotoAve
from .serializers import (
    AveCatalogoSerializer,
    AveDesconocidaSerializer,
    AveDetalleSerializer,
)


class SinCacheMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "no-store"
        return response


class ResumenCatalogoView(SinCacheMixin, APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        total = Ave.objects.filter(activa=True).count()
        encontradas = AveEncontrada.objects.filter(
            usuario=request.user,
            ave__activa=True,
        ).count()
        porcentaje = round((encontradas / total) * 100) if total else 0
        return Response(
            {
                "encontradas": encontradas,
                "total": total,
                "porcentaje": porcentaje,
            }
        )


class ListaAvesCatalogoView(SinCacheMixin, generics.ListAPIView):
    serializer_class = AveCatalogoSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        hallazgos_usuario = AveEncontrada.objects.filter(
            usuario=self.request.user,
            ave_id=OuterRef("pk"),
        )
        queryset = (
            Ave.objects.filter(activa=True)
            .annotate(encontrada=Exists(hallazgos_usuario))
            .prefetch_related(
                Prefetch(
                    "fotos",
                    queryset=FotoAve.objects.order_by("-es_principal", "id_foto"),
                    to_attr="fotos_ordenadas",
                )
            )
            .order_by("nombre")
        )
        busqueda = self.request.query_params.get("buscar", "").strip()
        if busqueda:
            queryset = queryset.filter(
                Q(nombre__icontains=busqueda)
                | Q(nombre_cientifico__icontains=busqueda)
            )
        return queryset


class DetalleAveCatalogoView(SinCacheMixin, generics.RetrieveAPIView):
    serializer_class = AveDetalleSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = "id_ave"
    lookup_url_kwarg = "id_ave"

    def get_queryset(self):
        return (
            Ave.objects.filter(
                activa=True,
                hallazgos__usuario=self.request.user,
            )
            .prefetch_related(
                Prefetch(
                    "fotos",
                    queryset=FotoAve.objects.order_by("-es_principal", "id_foto"),
                    to_attr="fotos_ordenadas",
                ),
                Prefetch(
                    "atributos",
                    queryset=AtributoAve.objects.select_related("atributo").order_by(
                        "id_atributo_ave"
                    ),
                    to_attr="atributos_ordenados",
                ),
            )
            .distinct()
        )


class ListaAvesDesconocidasView(SinCacheMixin, generics.ListAPIView):
    serializer_class = AveDesconocidaSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Escaneo.objects.filter(
            usuario=self.request.user,
            reconocido=False,
        ).order_by("-fecha", "-id_escaneo")
