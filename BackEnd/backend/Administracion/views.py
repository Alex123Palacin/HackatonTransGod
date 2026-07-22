from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth import login as iniciar_sesion_django
from django.contrib.auth import logout as cerrar_sesion_django
from django.db import transaction
from django.db.models import Prefetch, Q
from django.middleware.csrf import get_token
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from Catalogo.models import Ave, FotoAve
from Noticias.models import Comunicado, ImagenPublicacion, Publicacion, Reporte
from Usuario.models import Usuario

from .permisos import AutenticacionSesionAdministrativa, EsPersonalAdministrativo
from .serializers import (
    ActualizarPublicacionSerializer,
    ActualizarReporteSerializer,
    AveAdministrativaSerializer,
    ComunicadoAdministrativoSerializer,
    CredencialesAdministrativasSerializer,
    GuardarAveSerializer,
    GuardarComunicadoSerializer,
    PublicacionAdministrativaSerializer,
    ReporteAdministrativoSerializer,
)
from .servicios_archivos import programar_eliminacion_archivo


def datos_administrador(usuario):
    return {
        "id": usuario.id_usuario,
        "nombre": usuario.nombre,
        "correo": usuario.correo,
    }


class SinCacheAdministrativaMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "no-store"
        return response


class VistaAdministrativaMixin(SinCacheAdministrativaMixin):
    authentication_classes = (AutenticacionSesionAdministrativa,)
    permission_classes = (EsPersonalAdministrativo,)


class IniciarSesionAdministrativaView(SinCacheAdministrativaMixin, APIView):
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "admin_login"

    def post(self, request):
        serializer = CredencialesAdministrativasSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identificador = serializer.validated_data["usuario"].strip()
        password = serializer.validated_data["password"]

        candidato = Usuario.objects.filter(
            Q(correo__iexact=identificador) | Q(nombre__iexact=identificador)
        ).first()
        usuario = None
        if candidato:
            usuario = authenticate(
                request,
                username=candidato.correo,
                password=password,
            )

        if not usuario or not usuario.is_active or not usuario.is_staff:
            return Response(
                {"detail": "Credenciales administrativas incorrectas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        iniciar_sesion_django(request, usuario)
        minutos = getattr(settings, "ADMIN_SESION_INACTIVIDAD_MINUTOS", 30)
        request.session.set_expiry(minutos * 60)
        request.session.modified = True
        return Response(
            {
                "usuario": datos_administrador(usuario),
                "csrfToken": get_token(request),
            },
            status=status.HTTP_200_OK,
        )


class SesionAdministrativaActualView(VistaAdministrativaMixin, APIView):
    def get(self, request):
        return Response(
            {
                "usuario": datos_administrador(request.user),
                "csrfToken": get_token(request),
            }
        )


class CerrarSesionAdministrativaView(VistaAdministrativaMixin, APIView):
    def post(self, request):
        cerrar_sesion_django(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResumenAdministrativoView(VistaAdministrativaMixin, APIView):
    def get(self, request):
        reportes = Reporte.objects.select_related("usuario").order_by(
            "-fecha",
            "-id_reporte",
        )
        return Response(
            {
                "reportesPendientes": reportes.filter(
                    estado=Reporte.Estado.PENDIENTE
                ).count(),
                "reportesTotal": reportes.count(),
                "comunicadosActivos": Comunicado.objects.filter(activo=True).count(),
                "comunicadosTotal": Comunicado.objects.count(),
                "avesActivas": Ave.objects.filter(activa=True).count(),
                "avesTotal": Ave.objects.count(),
                "publicacionesActivas": Publicacion.objects.filter(activa=True).count(),
                "publicacionesTotal": Publicacion.objects.count(),
                "reportesRecientes": ReporteAdministrativoSerializer(
                    reportes[:5],
                    many=True,
                ).data,
            }
        )


class ListaCrearComunicadosView(VistaAdministrativaMixin, generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Comunicado.objects.all().order_by("-fecha", "-id_comunicado")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GuardarComunicadoSerializer
        return ComunicadoAdministrativoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comunicado = serializer.save()
        return Response(
            ComunicadoAdministrativoSerializer(comunicado).data,
            status=status.HTTP_201_CREATED,
        )


class DetalleComunicadoView(
    VistaAdministrativaMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = Comunicado.objects.all()
    lookup_field = "id_comunicado"
    lookup_url_kwarg = "id_comunicado"
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_serializer_class(self):
        if self.request.method in {"PUT", "PATCH"}:
            return GuardarComunicadoSerializer
        return ComunicadoAdministrativoSerializer

    def update(self, request, *args, **kwargs):
        parcial = kwargs.pop("partial", False)
        comunicado = self.get_object()
        serializer = self.get_serializer(
            comunicado,
            data=request.data,
            partial=parcial,
        )
        serializer.is_valid(raise_exception=True)
        comunicado = serializer.save()
        return Response(ComunicadoAdministrativoSerializer(comunicado).data)

    @transaction.atomic
    def perform_destroy(self, instance):
        programar_eliminacion_archivo(instance.imagen)
        instance.delete()


class ListaCrearAvesView(VistaAdministrativaMixin, generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Ave.objects.prefetch_related(
            Prefetch(
                "fotos",
                queryset=FotoAve.objects.order_by("-es_principal", "id_foto"),
            )
        ).order_by("nombre")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GuardarAveSerializer
        return AveAdministrativaSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ave = serializer.save()
        ave = self.get_queryset().get(pk=ave.pk)
        return Response(
            AveAdministrativaSerializer(ave).data,
            status=status.HTTP_201_CREATED,
        )


class DetalleAveAdministrativaView(
    VistaAdministrativaMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    lookup_field = "id_ave"
    lookup_url_kwarg = "id_ave"
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        return Ave.objects.prefetch_related(
            Prefetch(
                "fotos",
                queryset=FotoAve.objects.order_by("-es_principal", "id_foto"),
            )
        )

    def get_serializer_class(self):
        if self.request.method in {"PUT", "PATCH"}:
            return GuardarAveSerializer
        return AveAdministrativaSerializer

    def update(self, request, *args, **kwargs):
        parcial = kwargs.pop("partial", False)
        ave = self.get_object()
        serializer = self.get_serializer(ave, data=request.data, partial=parcial)
        serializer.is_valid(raise_exception=True)
        ave = serializer.save()
        ave = self.get_queryset().get(pk=ave.pk)
        return Response(AveAdministrativaSerializer(ave).data)

    @transaction.atomic
    def perform_destroy(self, instance):
        fotos = list(instance.fotos.all())
        instance.delete()
        for foto in fotos:
            programar_eliminacion_archivo(foto.imagen)


class ListaReportesAdministrativosView(
    VistaAdministrativaMixin,
    generics.ListAPIView,
):
    serializer_class = ReporteAdministrativoSerializer

    def get_queryset(self):
        queryset = Reporte.objects.select_related("usuario").order_by(
            "-fecha",
            "-id_reporte",
        )
        estado = self.request.query_params.get("estado", "").strip().upper()
        if estado in Reporte.Estado.values:
            queryset = queryset.filter(estado=estado)
        buscar = self.request.query_params.get("buscar", "").strip()
        if buscar:
            queryset = queryset.filter(
                Q(titulo__icontains=buscar)
                | Q(descripcion__icontains=buscar)
                | Q(usuario__nombre__icontains=buscar)
                | Q(usuario__correo__icontains=buscar)
            )
        return queryset


class DetalleReporteAdministrativoView(
    VistaAdministrativaMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    queryset = Reporte.objects.select_related("usuario")
    lookup_field = "id_reporte"
    lookup_url_kwarg = "id_reporte"

    def get_serializer_class(self):
        if self.request.method in {"PUT", "PATCH"}:
            return ActualizarReporteSerializer
        return ReporteAdministrativoSerializer

    def update(self, request, *args, **kwargs):
        parcial = kwargs.pop("partial", False)
        reporte = self.get_object()
        serializer = self.get_serializer(
            reporte,
            data=request.data,
            partial=parcial,
        )
        serializer.is_valid(raise_exception=True)
        reporte = serializer.save()
        return Response(ReporteAdministrativoSerializer(reporte).data)

    @transaction.atomic
    def perform_destroy(self, instance):
        programar_eliminacion_archivo(instance.imagen)
        instance.delete()


class ListaPublicacionesAdministrativasView(
    VistaAdministrativaMixin,
    generics.ListAPIView,
):
    serializer_class = PublicacionAdministrativaSerializer

    def get_queryset(self):
        return (
            Publicacion.objects.select_related("usuario")
            .prefetch_related(
                Prefetch(
                    "imagenes",
                    queryset=ImagenPublicacion.objects.order_by("id_imagen"),
                )
            )
            .order_by("-fecha", "-id_publicacion")
        )


class DetallePublicacionAdministrativaView(
    VistaAdministrativaMixin,
    generics.RetrieveUpdateDestroyAPIView,
):
    lookup_field = "id_publicacion"
    lookup_url_kwarg = "id_publicacion"

    def get_queryset(self):
        return Publicacion.objects.select_related("usuario").prefetch_related(
            Prefetch(
                "imagenes",
                queryset=ImagenPublicacion.objects.order_by("id_imagen"),
            )
        )

    def get_serializer_class(self):
        if self.request.method in {"PUT", "PATCH"}:
            return ActualizarPublicacionSerializer
        return PublicacionAdministrativaSerializer

    def update(self, request, *args, **kwargs):
        parcial = kwargs.pop("partial", False)
        publicacion = self.get_object()
        serializer = self.get_serializer(
            publicacion,
            data=request.data,
            partial=parcial,
        )
        serializer.is_valid(raise_exception=True)
        publicacion = serializer.save()
        return Response(PublicacionAdministrativaSerializer(publicacion).data)

    @transaction.atomic
    def perform_destroy(self, instance):
        imagenes = list(instance.imagenes.all())
        instance.delete()
        for imagen in imagenes:
            programar_eliminacion_archivo(imagen.imagen)
