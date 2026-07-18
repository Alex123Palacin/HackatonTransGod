from django.db import models


class Ave(models.Model):
    id_ave = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=150, unique=True)
    nombre_cientifico = models.CharField(max_length=200, blank=True)
    etiqueta_caracteristica = models.CharField(max_length=100)
    caracteristicas = models.TextField()
    descripcion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)

    class Meta:
        verbose_name = "ave"
        verbose_name_plural = "aves"
        ordering = ["nombre"]
        indexes = [
            models.Index(
                fields=["activa", "nombre"],
                name="catalogo_activa_nombre_idx",
            ),
        ]

    def __str__(self):
        return self.nombre


class FotoAve(models.Model):
    id_foto = models.BigAutoField(primary_key=True)
    ave = models.ForeignKey(
        Ave,
        on_delete=models.CASCADE,
        related_name="fotos",
    )
    imagen = models.ImageField(upload_to="catalogo/aves/")
    descripcion = models.CharField(max_length=200, blank=True)
    es_principal = models.BooleanField(default=False)

    class Meta:
        verbose_name = "foto de ave"
        verbose_name_plural = "fotos de aves"
        ordering = ["-es_principal", "id_foto"]
        constraints = [
            models.UniqueConstraint(
                fields=["ave"],
                condition=models.Q(es_principal=True),
                name="catalogo_una_foto_principal_por_ave",
            )
        ]

    def __str__(self):
        return f"Foto de {self.ave}"


class Atributo(models.Model):
    id_atributo = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name = "atributo"
        verbose_name_plural = "atributos"
        ordering = ["nombre"]

    def __str__(self):
        return self.nombre


class AtributoAve(models.Model):
    id_atributo_ave = models.BigAutoField(primary_key=True)
    ave = models.ForeignKey(
        Ave,
        on_delete=models.CASCADE,
        related_name="atributos",
    )
    atributo = models.ForeignKey(
        Atributo,
        on_delete=models.CASCADE,
        related_name="valores_por_ave",
    )
    valor = models.CharField(max_length=250)
    es_destacado = models.BooleanField(default=False)

    class Meta:
        verbose_name = "atributo de ave"
        verbose_name_plural = "atributos de aves"
        ordering = ["id_atributo_ave"]
        constraints = [
            models.UniqueConstraint(
                fields=["ave", "atributo"],
                name="catalogo_atributo_unico_por_ave",
            )
        ]

    def __str__(self):
        return f"{self.ave} - {self.atributo}: {self.valor}"


class AveEncontrada(models.Model):
    id_ave_encontrada = models.BigAutoField(primary_key=True)
    usuario = models.ForeignKey(
        "usuario.CuentaAplicacion",
        on_delete=models.CASCADE,
        related_name="aves_encontradas",
    )
    ave = models.ForeignKey(
        Ave,
        on_delete=models.CASCADE,
        related_name="hallazgos",
    )
    escaneo = models.ForeignKey(
        "scanner.Escaneo",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="aves_encontradas",
    )
    fecha_encontrada = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "ave encontrada"
        verbose_name_plural = "aves encontradas"
        ordering = ["-fecha_encontrada", "-id_ave_encontrada"]
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "ave"],
                name="catalogo_ave_unica_por_usuario",
            )
        ]

    def __str__(self):
        return f"{self.usuario} encontro {self.ave}"
