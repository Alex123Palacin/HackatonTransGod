from django.conf import settings
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission


class AutenticacionSesionAdministrativa(SessionAuthentication):
    """Expone un desafio para que DRF responda 401 cuando no hay sesion."""

    def authenticate_header(self, request):
        return "Session"


class EsPersonalAdministrativo(BasePermission):
    message = "Se requiere una cuenta administrativa activa."

    def has_permission(self, request, view):
        usuario = request.user
        if not usuario or not usuario.is_authenticated:
            return False
        if not usuario.is_active or not usuario.is_staff:
            return False

        if not request.session.session_key:
            raise AuthenticationFailed("La sesion administrativa ha vencido.")

        minutos = getattr(settings, "ADMIN_SESION_INACTIVIDAD_MINUTOS", 30)
        request.session.set_expiry(minutos * 60)
        request.session.modified = True
        return True
