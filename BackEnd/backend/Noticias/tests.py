from datetime import date, timedelta
from io import BytesIO
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from Usuario.models import CuentaAplicacion

from .models import Comunicado, Publicacion, Reporte


def crear_imagen(nombre="ave.png"):
    contenido = BytesIO()
    Image.new("RGB", (4, 4), color="white").save(contenido, format="PNG")
    contenido.seek(0)
    return SimpleUploadedFile(nombre, contenido.read(), content_type="image/png")


class ApiNoticiasAutenticadaTestCase(APITestCase):
    password = "N0ticia!Segura_2026"

    def setUp(self):
        self.media_temporal = tempfile.mkdtemp()
        self.configuracion_media = self.settings(MEDIA_ROOT=self.media_temporal)
        self.configuracion_media.enable()
        self.addCleanup(self.configuracion_media.disable)
        self.addCleanup(shutil.rmtree, self.media_temporal, True)

        self.usuario = CuentaAplicacion.objects.create_user(
            correo="autor@pozaarenilla.com",
            nombre="Autor",
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


class ComunicadosApiTests(ApiNoticiasAutenticadaTestCase):
    password = "C0municado!Seguro_2026"

    def test_lista_requiere_autenticacion(self):
        respuesta = self.client.get(reverse("noticias_api:comunicados"))
        self.assertEqual(respuesta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_lista_solo_comunicados_activos_ordenados_por_fecha(self):
        hoy = date.today()
        antiguo = Comunicado.objects.create(
            titulo="Comunicado anterior",
            descripcion="Descripcion anterior",
            fecha=hoy - timedelta(days=1),
            activo=True,
        )
        reciente = Comunicado.objects.create(
            titulo="Comunicado reciente",
            descripcion="Descripcion reciente",
            fecha=hoy,
            activo=True,
        )
        Comunicado.objects.create(
            titulo="Comunicado inactivo",
            descripcion="No debe mostrarse",
            fecha=hoy + timedelta(days=1),
            activo=False,
        )
        self.autenticar()

        respuesta = self.client.get(reverse("noticias_api:comunicados"))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["id_comunicado"] for item in respuesta.data],
            [reciente.id_comunicado, antiguo.id_comunicado],
        )
        self.assertEqual(respuesta.data[0]["descripcion"], "Descripcion reciente")
        self.assertIsNone(respuesta.data[0]["imagen"])


class PublicacionesApiTests(ApiNoticiasAutenticadaTestCase):
    def test_lista_y_creacion_requieren_autenticacion(self):
        ruta = reverse("noticias_api:publicaciones")

        self.assertEqual(
            self.client.get(ruta).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.post(ruta, {}, format="multipart").status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_crea_publicacion_con_imagenes_y_usuario_de_la_sesion(self):
        self.autenticar()

        respuesta = self.client.post(
            reverse("noticias_api:publicaciones"),
            {
                "titulo": "Visita en familia",
                "descripcion": "Vimos aves cerca del malecon.",
                "imagenes": [crear_imagen("uno.png"), crear_imagen("dos.png")],
            },
            format="multipart",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        publicacion = Publicacion.objects.get()
        self.assertEqual(publicacion.usuario, self.usuario)
        self.assertEqual(publicacion.imagenes.count(), 2)
        self.assertEqual(respuesta.data["autor"], "Autor")
        self.assertEqual(len(respuesta.data["imagenes"]), 2)

    def test_lista_solo_publicaciones_activas(self):
        activa = Publicacion.objects.create(
            usuario=self.usuario,
            titulo="Visible",
            descripcion="Descripcion visible",
        )
        Publicacion.objects.create(
            usuario=self.usuario,
            titulo="Oculta",
            descripcion="Descripcion oculta",
            activa=False,
        )
        self.autenticar()

        respuesta = self.client.get(reverse("noticias_api:publicaciones"))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["id_publicacion"] for item in respuesta.data],
            [activa.id_publicacion],
        )


class ReportesApiTests(ApiNoticiasAutenticadaTestCase):
    def setUp(self):
        super().setUp()
        self.otro_usuario = CuentaAplicacion.objects.create_user(
            correo="otro@pozaarenilla.com",
            nombre="Otro usuario",
            password=self.password,
        )

    def test_crea_reporte_pendiente_para_usuario_de_la_sesion(self):
        self.autenticar()

        respuesta = self.client.post(
            reverse("noticias_api:reportes"),
            {
                "titulo": "Baranda danada",
                "descripcion": "La baranda necesita mantenimiento.",
                "imagen": crear_imagen("reporte.png"),
                "estado": Reporte.Estado.ATENDIDO,
            },
            format="multipart",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        reporte = Reporte.objects.get()
        self.assertEqual(reporte.usuario, self.usuario)
        self.assertEqual(reporte.estado, Reporte.Estado.PENDIENTE)
        self.assertIsNotNone(respuesta.data["imagen"])

    def test_lista_unicamente_reportes_del_usuario_autenticado(self):
        propio = Reporte.objects.create(
            usuario=self.usuario,
            titulo="Reporte propio",
            descripcion="Debe aparecer",
        )
        Reporte.objects.create(
            usuario=self.otro_usuario,
            titulo="Reporte ajeno",
            descripcion="No debe aparecer",
        )
        self.autenticar()

        respuesta = self.client.get(reverse("noticias_api:reportes"))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["id_reporte"] for item in respuesta.data],
            [propio.id_reporte],
        )
