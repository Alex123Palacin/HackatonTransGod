from django.db import models


class Conversacion(models.Model):
    id_conversacion = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        "usuario.CuentaAplicacion",
        on_delete=models.CASCADE,
        related_name="conversaciones",
    )
    titulo = models.CharField(max_length=150, default="Nueva conversacion")
    fecha = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "conversacion"
        verbose_name_plural = "conversaciones"
        ordering = ["-id_conversacion"]

    def __str__(self):
        return self.titulo


class Mensaje(models.Model):
    class Emisor(models.TextChoices):
        USUARIO = "USUARIO", "Usuario"
        IA = "IA", "Inteligencia artificial"

    id_mensaje = models.BigAutoField(primary_key=True)
    conversacion = models.ForeignKey(
        Conversacion,
        on_delete=models.CASCADE,
        related_name="mensajes",
    )
    emisor = models.CharField(max_length=10, choices=Emisor.choices)
    mensaje = models.TextField()

    class Meta:
        verbose_name = "mensaje"
        verbose_name_plural = "mensajes"
        ordering = ["id_mensaje"]

    def __str__(self):
        return f"{self.get_emisor_display()}: {self.mensaje[:40]}"
