from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Escaneo(models.Model):
    id_escaneo = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        "usuario.CuentaAplicacion",
        on_delete=models.CASCADE,
        related_name="escaneos",
    )
    imagen = models.ImageField(upload_to="scanner/escaneos/")
    fecha = models.DateTimeField(auto_now_add=True)
    ave_detectada = models.ForeignKey(
        "catalogo.Ave",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="escaneos",
    )
    confianza = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Porcentaje de confianza entre 0 y 100.",
    )
    reconocido = models.BooleanField(default=False)

    class Meta:
        verbose_name = "escaneo"
        verbose_name_plural = "escaneos"
        ordering = ["-fecha", "-id_escaneo"]
        indexes = [
            models.Index(
                fields=["usuario", "reconocido", "-fecha"],
                name="scanner_usuario_estado_idx",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(confianza__gte=0, confianza__lte=100),
                name="scanner_confianza_entre_0_y_100",
            ),
            models.CheckConstraint(
                condition=models.Q(reconocido=False)
                | models.Q(ave_detectada__isnull=False),
                name="scanner_reconocido_requiere_ave",
            ),
        ]

    def __str__(self):
        resultado = self.ave_detectada or "Ave desconocida"
        return f"Escaneo {self.id_escaneo}: {resultado}"
