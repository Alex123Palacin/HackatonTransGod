from django.urls import path

from .views import (
    DetalleAveCatalogoView,
    ListaAvesCatalogoView,
    ListaAvesDesconocidasView,
    ResumenCatalogoView,
)


app_name = "catalogo_api"

urlpatterns = [
    path("resumen/", ResumenCatalogoView.as_view(), name="resumen"),
    path("aves/", ListaAvesCatalogoView.as_view(), name="aves"),
    path(
        "aves/<int:id_ave>/",
        DetalleAveCatalogoView.as_view(),
        name="detalle_ave",
    ),
    path(
        "desconocidas/",
        ListaAvesDesconocidasView.as_view(),
        name="desconocidas",
    ),
]
