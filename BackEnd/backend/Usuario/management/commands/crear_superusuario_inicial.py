import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Crea el administrador inicial usando variables de entorno."

    def handle(self, *args, **options):
        correo = os.getenv("DJANGO_SUPERUSER_EMAIL", "").strip().lower()
        nombre = os.getenv("DJANGO_SUPERUSER_NAME", "").strip()
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "")

        if not correo or not nombre or not password:
            self.stdout.write(
                "Administrador inicial omitido: faltan variables DJANGO_SUPERUSER_*."
            )
            return

        modelo_usuario = get_user_model()
        usuario, creado = modelo_usuario.objects.get_or_create(
            correo=correo,
            defaults={
                "nombre": nombre,
                "is_active": True,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        if creado:
            usuario.set_password(password)
            usuario.save(update_fields=["password"])
            self.stdout.write(self.style.SUCCESS("Administrador inicial creado."))
            return

        campos_actualizados = []
        if not usuario.is_staff:
            usuario.is_staff = True
            campos_actualizados.append("is_staff")
        if not usuario.is_superuser:
            usuario.is_superuser = True
            campos_actualizados.append("is_superuser")
        if not usuario.is_active:
            usuario.is_active = True
            campos_actualizados.append("is_active")
        if campos_actualizados:
            usuario.save(update_fields=campos_actualizados)

        self.stdout.write("El administrador inicial ya existe.")
