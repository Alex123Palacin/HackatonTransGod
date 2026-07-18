from django.db.models.signals import post_save
from django.dispatch import receiver

from Catalogo.models import AveEncontrada

from .models import Escaneo


@receiver(post_save, sender=Escaneo)
def registrar_ave_encontrada(sender, instance, **kwargs):
    if not instance.reconocido or not instance.ave_detectada_id:
        return

    AveEncontrada.objects.get_or_create(
        usuario=instance.usuario,
        ave=instance.ave_detectada,
        defaults={"escaneo": instance},
    )
