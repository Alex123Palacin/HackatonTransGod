from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.hashers import check_password, make_password
from django.db import models
from django.utils import timezone

from .managers import (
    CuentaAdministrativaManager,
    CuentaAplicacionManager,
    UsuarioManager,
)


class Usuario(AbstractBaseUser, PermissionsMixin):
    id_usuario = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    correo = models.EmailField(max_length=254, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "correo"
    EMAIL_FIELD = "correo"
    REQUIRED_FIELDS = ["nombre"]

    class Meta:
        db_table = "usuario_administrador"
        verbose_name = "administrador"
        verbose_name_plural = "administradores"
        ordering = ["nombre"]

    def save(self, *args, **kwargs):
        if self.correo:
            self.correo = Usuario.objects.normalize_email(self.correo).lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} ({self.correo})"


class CuentaAplicacion(models.Model):
    id_usuario = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    correo = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=128)
    is_active = models.BooleanField(default=True)

    objects = CuentaAplicacionManager()

    class Meta:
        db_table = "usuario_cuenta_aplicacion"
        verbose_name = "cuenta creada en la app"
        verbose_name_plural = "cuentas creadas en la app"
        ordering = ["nombre"]

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def save(self, *args, **kwargs):
        if self.correo:
            self.correo = Usuario.objects.normalize_email(self.correo).lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nombre} ({self.correo})"


class SesionCuentaAplicacion(models.Model):
    id_sesion = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        CuentaAplicacion,
        on_delete=models.CASCADE,
        related_name="sesiones",
    )
    access_hash = models.CharField(max_length=64, unique=True)
    refresh_hash = models.CharField(max_length=64, unique=True)
    access_expira = models.DateTimeField()
    refresh_expira = models.DateTimeField()
    revocada = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ultima_actividad = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = "usuario_sesion_aplicacion"
        verbose_name = "sesion de la app"
        verbose_name_plural = "sesiones de la app"
        ordering = ["-fecha_creacion"]

    def __str__(self):
        return f"Sesion de {self.usuario.correo}"


class CuentaAdministrativa(Usuario):
    objects = CuentaAdministrativaManager()

    class Meta:
        proxy = True
        verbose_name = "administrador"
        verbose_name_plural = "administradores"
