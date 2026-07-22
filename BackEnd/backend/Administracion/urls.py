from django.urls import path

from .views import (
    CerrarSesionAdministrativaView,
    DetalleAveAdministrativaView,
    DetalleComunicadoView,
    DetallePublicacionAdministrativaView,
    DetalleReporteAdministrativoView,
    IniciarSesionAdministrativaView,
    ListaCrearAvesView,
    ListaCrearComunicadosView,
    ListaPublicacionesAdministrativasView,
    ListaReportesAdministrativosView,
    ResumenAdministrativoView,
    SesionAdministrativaActualView,
)


app_name = "administracion_api"

urlpatterns = [
    path(
        "sesion/iniciar/",
        IniciarSesionAdministrativaView.as_view(),
        name="iniciar_sesion",
    ),
    path(
        "sesion/actual/",
        SesionAdministrativaActualView.as_view(),
        name="sesion_actual",
    ),
    path(
        "sesion/cerrar/",
        CerrarSesionAdministrativaView.as_view(),
        name="cerrar_sesion",
    ),
    path("resumen/", ResumenAdministrativoView.as_view(), name="resumen"),
    path("reportes/", ListaReportesAdministrativosView.as_view(), name="reportes"),
    path(
        "reportes/<int:id_reporte>/",
        DetalleReporteAdministrativoView.as_view(),
        name="detalle_reporte",
    ),
    path(
        "comunicados/",
        ListaCrearComunicadosView.as_view(),
        name="comunicados",
    ),
    path(
        "comunicados/<int:id_comunicado>/",
        DetalleComunicadoView.as_view(),
        name="detalle_comunicado",
    ),
    path("aves/", ListaCrearAvesView.as_view(), name="aves"),
    path(
        "aves/<int:id_ave>/",
        DetalleAveAdministrativaView.as_view(),
        name="detalle_ave",
    ),
    path(
        "publicaciones/",
        ListaPublicacionesAdministrativasView.as_view(),
        name="publicaciones",
    ),
    path(
        "publicaciones/<int:id_publicacion>/",
        DetallePublicacionAdministrativaView.as_view(),
        name="detalle_publicacion",
    ),
]
