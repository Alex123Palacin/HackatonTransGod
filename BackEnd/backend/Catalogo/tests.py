from io import BytesIO
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from Scanner.models import Escaneo
from Usuario.models import CuentaAplicacion

from .models import Atributo, AtributoAve, Ave, AveEncontrada, FotoAve


def crear_imagen(nombre="ave.png"):
    contenido = BytesIO()
    Image.new("RGB", (4, 4), color="white").save(contenido, format="PNG")
    contenido.seek(0)
    return SimpleUploadedFile(nombre, contenido.read(), content_type="image/png")


class CatalogoApiTests(APITestCase):
    password = "Cat4logo!Seguro_2026"

    def setUp(self):
        self.media_temporal = tempfile.mkdtemp()
        self.configuracion_media = self.settings(MEDIA_ROOT=self.media_temporal)
        self.configuracion_media.enable()
        self.addCleanup(self.configuracion_media.disable)
        self.addCleanup(shutil.rmtree, self.media_temporal, True)

        self.usuario = CuentaAplicacion.objects.create_user(
            correo="observador@pozaarenilla.com",
            nombre="Observador",
            password=self.password,
        )
        self.otro_usuario = CuentaAplicacion.objects.create_user(
            correo="otro-observador@pozaarenilla.com",
            nombre="Otro observador",
            password=self.password,
        )
        login = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.usuario.correo, "password": self.password},
            format="json",
        )
        self.access = login.data["access"]

    def autenticar(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def crear_ave(self, nombre, activa=True):
        return Ave.objects.create(
            nombre=nombre,
            nombre_cientifico=f"Cientifico {nombre}",
            etiqueta_caracteristica="Caracteristicas",
            caracteristicas="Descripcion principal",
            descripcion="Descripcion general",
            activa=activa,
        )

    def test_catalogo_requiere_autenticacion(self):
        rutas = (
            reverse("catalogo_api:resumen"),
            reverse("catalogo_api:aves"),
            reverse("catalogo_api:desconocidas"),
        )
        for ruta in rutas:
            with self.subTest(ruta=ruta):
                self.assertEqual(
                    self.client.get(ruta).status_code,
                    status.HTTP_401_UNAUTHORIZED,
                )

    def test_progreso_y_estado_son_independientes_por_usuario(self):
        encontrada = self.crear_ave("Garza blanca")
        pendiente = self.crear_ave("Pelicano peruano")
        inactiva = self.crear_ave("Ave inactiva", activa=False)
        AveEncontrada.objects.create(usuario=self.usuario, ave=encontrada)
        AveEncontrada.objects.create(usuario=self.otro_usuario, ave=pendiente)
        AveEncontrada.objects.create(usuario=self.usuario, ave=inactiva)
        self.autenticar()

        resumen = self.client.get(reverse("catalogo_api:resumen"))
        aves = self.client.get(reverse("catalogo_api:aves"))

        self.assertEqual(resumen.status_code, status.HTTP_200_OK)
        self.assertEqual(
            resumen.data,
            {"encontradas": 1, "total": 2, "porcentaje": 50},
        )
        estados = {ave["nombre"]: ave["encontrada"] for ave in aves.data}
        self.assertEqual(
            estados,
            {"Garza blanca": True, "Pelicano peruano": False},
        )
        self.assertEqual(aves["Cache-Control"], "no-store")

    def test_buscador_filtra_nombre_comun_y_cientifico(self):
        self.crear_ave("Garza blanca")
        pelicano = self.crear_ave("Pelicano peruano")
        pelicano.nombre_cientifico = "Pelecanus thagus"
        pelicano.save(update_fields=["nombre_cientifico"])
        self.autenticar()

        por_nombre = self.client.get(
            reverse("catalogo_api:aves"),
            {"buscar": "garza"},
        )
        por_cientifico = self.client.get(
            reverse("catalogo_api:aves"),
            {"buscar": "thagus"},
        )

        self.assertEqual([ave["nombre"] for ave in por_nombre.data], ["Garza blanca"])
        self.assertEqual(
            [ave["nombre"] for ave in por_cientifico.data],
            ["Pelicano peruano"],
        )

    def test_detalle_devuelve_fotos_atributos_y_caracteristicas(self):
        ave = self.crear_ave("Garza blanca")
        AveEncontrada.objects.create(usuario=self.usuario, ave=ave)
        FotoAve.objects.create(ave=ave, imagen=crear_imagen(), es_principal=True)
        tipo_ambiente = Atributo.objects.create(nombre="Tipo de ambiente")
        habitat = Atributo.objects.create(nombre="Habitat")
        AtributoAve.objects.create(
            ave=ave,
            atributo=tipo_ambiente,
            valor="Acuatica",
            es_destacado=True,
        )
        AtributoAve.objects.create(
            ave=ave,
            atributo=habitat,
            valor="Humedales y lagunas.",
        )
        self.autenticar()

        respuesta = self.client.get(
            reverse("catalogo_api:detalle_ave", args=[ave.id_ave])
        )

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(respuesta.data["atributos_destacados"][0]["texto"], "Acuatica")
        self.assertEqual(respuesta.data["detalles"][0]["etiqueta"], "Caracteristicas")
        self.assertEqual(respuesta.data["detalles"][1]["etiqueta"], "Habitat")
        self.assertEqual(len(respuesta.data["fotos"]), 1)

    def test_detalle_bloquea_ave_no_encontrada(self):
        ave = self.crear_ave("Ave pendiente")
        self.autenticar()

        respuesta = self.client.get(
            reverse("catalogo_api:detalle_ave", args=[ave.id_ave])
        )

        self.assertEqual(respuesta.status_code, status.HTTP_404_NOT_FOUND)

    def test_desconocidas_muestra_solo_escaneos_no_reconocidos_del_usuario(self):
        ave = self.crear_ave("Garza blanca")
        desconocido = Escaneo.objects.create(
            usuario=self.usuario,
            imagen=crear_imagen("desconocida.png"),
            reconocido=False,
        )
        Escaneo.objects.create(
            usuario=self.usuario,
            imagen=crear_imagen("reconocida.png"),
            ave_detectada=ave,
            confianza=95,
            reconocido=True,
        )
        Escaneo.objects.create(
            usuario=self.otro_usuario,
            imagen=crear_imagen("ajena.png"),
            reconocido=False,
        )
        self.autenticar()

        respuesta = self.client.get(reverse("catalogo_api:desconocidas"))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["id_escaneo"] for item in respuesta.data],
            [desconocido.id_escaneo],
        )
