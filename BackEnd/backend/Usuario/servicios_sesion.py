import hashlib
import secrets
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

from .models import SesionCuentaAplicacion


ACCESS_DURACION = timedelta(minutes=15)
REFRESH_DURACION = timedelta(days=7)
ACTUALIZACION_ACTIVIDAD = timedelta(minutes=1)


def duracion_inactividad():
    return timedelta(
        minutes=getattr(settings, "SESION_INACTIVIDAD_MINUTOS", 30)
    )


def hash_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _nuevo_token():
    return secrets.token_urlsafe(48)


def _generar_tokens():
    return _nuevo_token(), _nuevo_token()


def crear_sesion(usuario):
    access, refresh = _generar_tokens()
    ahora = timezone.now()
    SesionCuentaAplicacion.objects.create(
        usuario=usuario,
        access_hash=hash_token(access),
        refresh_hash=hash_token(refresh),
        access_expira=ahora + ACCESS_DURACION,
        refresh_expira=ahora + REFRESH_DURACION,
    )
    return {"access": access, "refresh": refresh}


@transaction.atomic
def renovar_sesion(refresh):
    ahora = timezone.now()
    try:
        sesion = (
            SesionCuentaAplicacion.objects.select_for_update()
            .select_related("usuario")
            .get(refresh_hash=hash_token(refresh), revocada=False)
        )
    except SesionCuentaAplicacion.DoesNotExist as error:
        raise AuthenticationFailed("El token de sesion no es valido.") from error

    sesion_inactiva = sesion.ultima_actividad <= ahora - duracion_inactividad()
    if (
        sesion.refresh_expira <= ahora
        or sesion_inactiva
        or not sesion.usuario.is_active
    ):
        sesion.revocada = True
        sesion.save(update_fields=["revocada"])
        raise AuthenticationFailed("La sesion ha vencido.")

    access_nuevo, refresh_nuevo = _generar_tokens()
    sesion.access_hash = hash_token(access_nuevo)
    sesion.refresh_hash = hash_token(refresh_nuevo)
    sesion.access_expira = ahora + ACCESS_DURACION
    sesion.refresh_expira = ahora + REFRESH_DURACION
    sesion.ultima_actividad = ahora
    sesion.save(
        update_fields=(
            "access_hash",
            "refresh_hash",
            "access_expira",
            "refresh_expira",
            "ultima_actividad",
        )
    )
    return {"access": access_nuevo, "refresh": refresh_nuevo}


@transaction.atomic
def revocar_sesion(sesion):
    sesion_bloqueada = SesionCuentaAplicacion.objects.select_for_update().get(
        pk=sesion.pk
    )
    if sesion_bloqueada.revocada:
        raise AuthenticationFailed("El token de sesion no es valido.")

    sesion_bloqueada.revocada = True
    sesion_bloqueada.save(update_fields=["revocada"])


def registrar_actividad(sesion, ahora=None):
    ahora = ahora or timezone.now()
    if sesion.ultima_actividad > ahora - ACTUALIZACION_ACTIVIDAD:
        return
    SesionCuentaAplicacion.objects.filter(
        pk=sesion.pk,
        revocada=False,
    ).update(ultima_actividad=ahora)
    sesion.ultima_actividad = ahora
