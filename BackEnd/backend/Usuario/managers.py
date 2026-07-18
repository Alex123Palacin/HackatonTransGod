from django.contrib.auth.base_user import BaseUserManager
from django.db import models


class UsuarioManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, correo, nombre, password=None, **extra_fields):
        if not correo:
            raise ValueError("El correo es obligatorio.")
        if not nombre:
            raise ValueError("El nombre es obligatorio.")

        correo_normalizado = self.normalize_email(correo).lower()
        usuario = self.model(
            correo=correo_normalizado,
            nombre=nombre.strip(),
            **extra_fields,
        )

        if password:
            usuario.set_password(password)
        else:
            usuario.set_unusable_password()

        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, correo, nombre, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("El superusuario debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("El superusuario debe tener is_superuser=True.")

        return self.create_user(correo, nombre, password, **extra_fields)


class CuentaAplicacionManager(models.Manager):
    def create_user(self, correo, nombre, password=None, **extra_fields):
        if not correo:
            raise ValueError("El correo es obligatorio.")
        if not nombre:
            raise ValueError("El nombre es obligatorio.")

        cuenta = self.model(
            correo=BaseUserManager.normalize_email(correo).lower(),
            nombre=nombre.strip(),
            **extra_fields,
        )
        cuenta.set_password(password)
        cuenta.save(using=self._db)
        return cuenta


class CuentaAdministrativaManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(
            models.Q(is_staff=True) | models.Q(is_superuser=True)
        )
