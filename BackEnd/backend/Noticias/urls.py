from django.urls import path

from .views import (
    ListaComunicadosView,
    ListaCrearPublicacionesView,
    ListaCrearReportesView,
)


app_name = "noticias_api"

urlpatterns = [
    path("comunicados/", ListaComunicadosView.as_view(), name="comunicados"),
    path(
        "publicaciones/",
        ListaCrearPublicacionesView.as_view(),
        name="publicaciones",
    ),
    path("reportes/", ListaCrearReportesView.as_view(), name="reportes"),
]
