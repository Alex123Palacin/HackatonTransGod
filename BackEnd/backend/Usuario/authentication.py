from django.utils import timezone
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

from .models import SesionCuentaAplicacion
from .servicios_sesion import duracion_inactividad, hash_token, registrar_actividad


class TokenCuentaAplicacionAuthentication(BaseAuthentication):
    keyword = b"Bearer"

    def authenticate(self, request):
        encabezado = get_authorization_header(request).split()
        if not encabezado:
            return None
        if encabezado[0].lower() != self.keyword.lower():
            return None
        if len(encabezado) != 2:
            raise AuthenticationFailed("Encabezado de autenticacion invalido.")

        try:
            access = encabezado[1].decode("utf-8")
        except UnicodeError as error:
            raise AuthenticationFailed("Token de acceso invalido.") from error

        try:
            sesion = SesionCuentaAplicacion.objects.select_related("usuario").get(
                access_hash=hash_token(access),
                access_expira__gt=timezone.now(),
                revocada=False,
                usuario__is_active=True,
            )
        except SesionCuentaAplicacion.DoesNotExist as error:
            raise AuthenticationFailed("Token de acceso invalido o vencido.") from error

        if sesion.ultima_actividad <= timezone.now() - duracion_inactividad():
            SesionCuentaAplicacion.objects.filter(pk=sesion.pk).update(revocada=True)
            raise AuthenticationFailed("La sesion vencio por inactividad.")

        registrar_actividad(sesion)

        return sesion.usuario, sesion

    def authenticate_header(self, request):
        return "Bearer"
