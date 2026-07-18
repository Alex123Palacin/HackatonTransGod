from django.db import models


class Comunicado(models.Model):
    id_comunicado = models.BigAutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    imagen = models.ImageField(
        upload_to="noticias/comunicados/",
        null=True,
        blank=True,
    )
    fecha = models.DateField()
    descripcion = models.TextField()
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = "comunicado"
        verbose_name_plural = "comunicados"
        ordering = ["-fecha", "-id_comunicado"]

    def __str__(self):
        return self.titulo


class Publicacion(models.Model):
    id_publicacion = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        "usuario.CuentaAplicacion",
        on_delete=models.CASCADE,
        related_name="publicaciones",
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha = models.DateField(auto_now_add=True)
    activa = models.BooleanField(default=True)

    class Meta:
        verbose_name = "publicacion"
        verbose_name_plural = "publicaciones"
        ordering = ["-fecha", "-id_publicacion"]

    def __str__(self):
        return self.titulo


class ImagenPublicacion(models.Model):
    id_imagen = models.BigAutoField(primary_key=True)
    publicacion = models.ForeignKey(
        Publicacion,
        on_delete=models.CASCADE,
        related_name="imagenes",
    )
    imagen = models.ImageField(upload_to="noticias/publicaciones/")

    class Meta:
        verbose_name = "imagen de publicacion"
        verbose_name_plural = "imagenes de publicaciones"
        ordering = ["id_imagen"]

    def __str__(self):
        return f"Imagen de {self.publicacion}"


class Reporte(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = "PENDIENTE", "Pendiente"
        EN_REVISION = "EN_REVISION", "En revision"
        ATENDIDO = "ATENDIDO", "Atendido"
        RECHAZADO = "RECHAZADO", "Rechazado"

    id_reporte = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        "usuario.CuentaAplicacion",
        on_delete=models.CASCADE,
        related_name="reportes",
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    imagen = models.ImageField(
        upload_to="noticias/reportes/",
        null=True,
        blank=True,
    )
    fecha = models.DateField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )

    class Meta:
        verbose_name = "reporte"
        verbose_name_plural = "reportes"
        ordering = ["-fecha", "-id_reporte"]

    def __str__(self):
        return self.titulo
