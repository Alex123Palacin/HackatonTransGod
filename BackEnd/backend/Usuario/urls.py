from django.urls import path

from .views import (
    ActividadSesionView,
    CerrarSesionView,
    LoginView,
    PerfilUsuarioView,
    RenovarSesionView,
    RegistroUsuarioView,
)

app_name = "usuario_api"

urlpatterns = [
    path("registro/", RegistroUsuarioView.as_view(), name="registro"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RenovarSesionView.as_view(), name="refresh"),
    path("me/", PerfilUsuarioView.as_view(), name="perfil"),
    path("actividad/", ActividadSesionView.as_view(), name="actividad"),
    path("logout/", CerrarSesionView.as_view(), name="logout"),
]
