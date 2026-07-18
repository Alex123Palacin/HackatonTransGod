from io import BytesIO
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image

from Catalogo.models import Ave, AveEncontrada
from Usuario.models import CuentaAplicacion

from .models import Escaneo


def crear_imagen():
    contenido = BytesIO()
    Image.new("RGB", (2, 2), color="white").save(contenido, format="PNG")
    contenido.seek(0)
    return SimpleUploadedFile("escaneo.png", contenido.read(), content_type="image/png")


class RegistroHallazgoDesdeEscaneoTests(TestCase):
    def setUp(self):
        self.media_temporal = tempfile.mkdtemp()
        self.configuracion_media = self.settings(MEDIA_ROOT=self.media_temporal)
        self.configuracion_media.enable()
        self.addCleanup(self.configuracion_media.disable)
        self.addCleanup(shutil.rmtree, self.media_temporal, True)

        self.usuario = CuentaAplicacion.objects.create_user(
            correo="scanner@pozaarenilla.com",
            nombre="Scanner",
            password="Sc4nner!Seguro_2026",
        )
        self.ave = Ave.objects.create(
            nombre="Garza blanca",
            etiqueta_caracteristica="Caracteristicas",
            caracteristicas="Ave de cuello largo.",
        )

    def test_escaneo_reconocido_registra_ave_encontrada_una_sola_vez(self):
        primer_escaneo = Escaneo.objects.create(
            usuario=self.usuario,
            imagen=crear_imagen(),
            ave_detectada=self.ave,
            confianza=94,
            reconocido=True,
        )
        Escaneo.objects.create(
            usuario=self.usuario,
            imagen=crear_imagen(),
            ave_detectada=self.ave,
            confianza=97,
            reconocido=True,
        )

        self.assertEqual(AveEncontrada.objects.count(), 1)
        self.assertEqual(AveEncontrada.objects.get().escaneo, primer_escaneo)

    def test_escaneo_desconocido_no_registra_ave_encontrada(self):
        Escaneo.objects.create(
            usuario=self.usuario,
            imagen=crear_imagen(),
            reconocido=False,
        )

        self.assertFalse(AveEncontrada.objects.exists())
