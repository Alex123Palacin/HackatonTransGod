from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import Comunicado, Publicacion, Reporte
from .serializers import (
    ComunicadoSerializer,
    CrearPublicacionSerializer,
    CrearReporteSerializer,
    PublicacionSerializer,
    ReporteSerializer,
)


class ListaComunicadosView(generics.ListAPIView):
    serializer_class = ComunicadoSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Comunicado.objects.filter(activo=True).order_by(
            "-fecha",
            "-id_comunicado",
        )


class ListaCrearPublicacionesView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return (
            Publicacion.objects.filter(activa=True)
            .select_related("usuario")
            .prefetch_related("imagenes")
            .order_by("-fecha", "-id_publicacion")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CrearPublicacionSerializer
        return PublicacionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        publicacion = serializer.save()
        respuesta = PublicacionSerializer(
            publicacion,
            context=self.get_serializer_context(),
        )
        return Response(respuesta.data, status=status.HTTP_201_CREATED)


class ListaCrearReportesView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Reporte.objects.filter(usuario=self.request.user).order_by(
            "-fecha",
            "-id_reporte",
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CrearReporteSerializer
        return ReporteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reporte = serializer.save()
        respuesta = ReporteSerializer(
            reporte,
            context=self.get_serializer_context(),
        )
        return Response(respuesta.data, status=status.HTTP_201_CREATED)
