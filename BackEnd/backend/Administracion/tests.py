from io import BytesIO
import shutil
import tempfile

from django.contrib import admin
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from Catalogo.models import AtributoAve, Ave
from Noticias.models import Comunicado, ImagenPublicacion, Publicacion, Reporte
from Usuario.models import CuentaAplicacion, Usuario


def crear_imagen(nombre="imagen.png", color="white"):
    contenido = BytesIO()
    Image.new("RGB", (8, 8), color=color).save(contenido, format="PNG")
    contenido.seek(0)
    return SimpleUploadedFile(
        nombre,
        contenido.read(),
        content_type="image/png",
    )


class AdministracionApiTests(APITestCase):
    password = "Admin!Poza_2026"

    def setUp(self):
        self.media_temporal = tempfile.mkdtemp()
        self.configuracion_media = self.settings(MEDIA_ROOT=self.media_temporal)
        self.configuracion_media.enable()
        self.addCleanup(self.configuracion_media.disable)
        self.addCleanup(shutil.rmtree, self.media_temporal, True)

        self.administrador = Usuario.objects.create_superuser(
            correo="admin@poza.test",
            nombre="Administradora",
            password=self.password,
        )
        self.usuario_app = CuentaAplicacion.objects.create_user(
            correo="visitante@poza.test",
            nombre="Visitante",
            password=self.password,
        )

    def iniciar_sesion(self, cliente=None):
        cliente = cliente or self.client
        return cliente.post(
            reverse("administracion_api:iniciar_sesion"),
            {"usuario": self.administrador.correo, "password": self.password},
            format="json",
        )

    def test_solo_cuentas_administrativas_pueden_ingresar(self):
        respuesta_app = self.client.post(
            reverse("administracion_api:iniciar_sesion"),
            {"usuario": self.usuario_app.correo, "password": self.password},
            format="json",
        )
        respuesta_admin = self.iniciar_sesion()

        self.assertEqual(respuesta_app.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(respuesta_admin.status_code, status.HTTP_200_OK)
        self.assertEqual(
            respuesta_admin.data["usuario"]["correo"],
            self.administrador.correo,
        )
        self.assertTrue(respuesta_admin.data["csrfToken"])

    def test_sesion_app_y_sesion_admin_no_interfieren(self):
        cliente = APIClient(enforce_csrf_checks=True)
        acceso_app = cliente.post(
            reverse("usuario_api:login"),
            {
                "correo": self.usuario_app.correo,
                "password": self.password,
            },
            format="json",
        )
        acceso_admin = self.iniciar_sesion(cliente)
        cliente.credentials(
            HTTP_AUTHORIZATION=f"Bearer {acceso_app.data['access']}",
            HTTP_X_CSRFTOKEN=acceso_admin.data["csrfToken"],
        )

        perfil_app = cliente.get(reverse("usuario_api:perfil"))
        sesion_admin = cliente.get(reverse("administracion_api:sesion_actual"))
        cierre_admin = cliente.post(reverse("administracion_api:cerrar_sesion"))
        perfil_despues_del_cierre_admin = cliente.get(
            reverse("usuario_api:perfil")
        )

        self.assertEqual(acceso_app.status_code, status.HTTP_200_OK)
        self.assertEqual(acceso_admin.status_code, status.HTTP_200_OK)
        self.assertEqual(perfil_app.status_code, status.HTTP_200_OK)
        self.assertEqual(perfil_app.data["correo"], self.usuario_app.correo)
        self.assertEqual(sesion_admin.status_code, status.HTTP_200_OK)
        self.assertEqual(
            sesion_admin.data["usuario"]["correo"],
            self.administrador.correo,
        )
        self.assertEqual(cierre_admin.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            perfil_despues_del_cierre_admin.status_code,
            status.HTTP_200_OK,
        )

    def test_sesion_administrativa_abre_todo_django_admin(self):
        cliente = APIClient()
        acceso_admin = self.iniciar_sesion(cliente)

        indice = cliente.get(reverse("admin:index"))
        self.assertEqual(acceso_admin.status_code, status.HTTP_200_OK)
        self.assertEqual(indice.status_code, status.HTTP_200_OK)

        for modelo in admin.site._registry:
            ruta = reverse(
                f"admin:{modelo._meta.app_label}_{modelo._meta.model_name}_changelist"
            )
            with self.subTest(modelo=modelo._meta.label):
                self.assertEqual(cliente.get(ruta).status_code, status.HTTP_200_OK)

    def test_listados_requieren_sesion_administrativa(self):
        rutas = (
            reverse("administracion_api:reportes"),
            reverse("administracion_api:comunicados"),
            reverse("administracion_api:aves"),
            reverse("administracion_api:publicaciones"),
        )
        for ruta in rutas:
            with self.subTest(ruta=ruta):
                self.assertEqual(
                    self.client.get(ruta).status_code,
                    status.HTTP_401_UNAUTHORIZED,
                )

    def test_csrf_protege_escrituras_administrativas(self):
        cliente = APIClient(enforce_csrf_checks=True)
        sesion = self.iniciar_sesion(cliente)
        ruta = reverse("administracion_api:comunicados")
        datos = {
            "titulo": "Aviso",
            "descripcion": "Descripcion del aviso",
            "fecha": "2026-07-21",
        }

        sin_csrf = cliente.post(ruta, datos, format="multipart")
        sesion_despues_del_rechazo = cliente.get(
            reverse("administracion_api:sesion_actual")
        )
        cliente.credentials(HTTP_X_CSRFTOKEN=sesion.data["csrfToken"])
        con_csrf = cliente.post(
            ruta,
            {**datos, "imagen": crear_imagen("aviso.png")},
            format="multipart",
        )

        self.assertEqual(sin_csrf.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            sesion_despues_del_rechazo.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(con_csrf.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Comunicado.objects.get().imagen.name)

    def test_sesion_sigue_activa_despues_de_operaciones_administrativas(self):
        cliente = APIClient(enforce_csrf_checks=True)
        sesion = self.iniciar_sesion(cliente)
        cliente.credentials(HTTP_X_CSRFTOKEN=sesion.data["csrfToken"])

        comunicado = cliente.post(
            reverse("administracion_api:comunicados"),
            {
                "titulo": "Cierre temporal",
                "descripcion": "Aviso para visitantes.",
                "fecha": "2026-07-21",
                "imagen": crear_imagen("cierre.png"),
            },
            format="multipart",
        )
        actualizado = cliente.patch(
            reverse(
                "administracion_api:detalle_comunicado",
                args=[comunicado.data["id"]],
            ),
            {"activo": False},
            format="json",
        )
        sesion_actual = cliente.get(reverse("administracion_api:sesion_actual"))

        self.assertEqual(comunicado.status_code, status.HTTP_201_CREATED)
        self.assertEqual(actualizado.status_code, status.HTTP_200_OK)
        self.assertFalse(actualizado.data["activo"])
        self.assertEqual(sesion_actual.status_code, status.HTTP_200_OK)
        self.assertEqual(
            sesion_actual.data["usuario"]["correo"],
            self.administrador.correo,
        )

    def test_admin_crea_y_edita_ave_con_archivos_reales(self):
        self.iniciar_sesion()
        ruta = reverse("administracion_api:aves")
        creada = self.client.post(
            ruta,
            {
                "nombre": "Garza blanca",
                "nombre_cientifico": "Ardea alba",
                "etiqueta_caracteristica": "Caracteristicas",
                "caracteristicas": "Ave de cuello largo.",
                "descripcion": "Habita en humedales.",
                "atributos": (
                    '[{"nombre":"Tipo","valor":"Acuatica","destacado":true},'
                    '{"nombre":"Habitat","valor":"Humedales y lagunas",'
                    '"destacado":false}]'
                ),
                "imagenes": [
                    crear_imagen("garza-1.png"),
                    crear_imagen("garza-2.png", "gray"),
                ],
            },
            format="multipart",
        )

        self.assertEqual(creada.status_code, status.HTTP_201_CREATED)
        ave = Ave.objects.get()
        self.assertEqual(ave.fotos.count(), 2)
        self.assertEqual(ave.fotos.filter(es_principal=True).count(), 1)
        self.assertEqual(ave.atributos.count(), 2)
        self.assertTrue(
            AtributoAve.objects.get(atributo__nombre="Tipo").es_destacado
        )

        editada = self.client.patch(
            reverse("administracion_api:detalle_ave", args=[ave.id_ave]),
            {
                "descripcion": "Nueva descripcion.",
                "atributos": (
                    '[{"nombre":"Dato curioso","valor":"Permanece inmovil",'
                    '"destacado":false}]'
                ),
                "reemplazar_imagenes": "true",
                "imagenes": [crear_imagen("garza-nueva.png", "blue")],
            },
            format="multipart",
        )

        self.assertEqual(editada.status_code, status.HTTP_200_OK)
        ave.refresh_from_db()
        self.assertEqual(ave.descripcion, "Nueva descripcion.")
        self.assertEqual(ave.fotos.count(), 1)
        self.assertEqual(ave.atributos.count(), 1)
        self.assertEqual(
            ave.atributos.select_related("atributo").get().atributo.nombre,
            "Dato curioso",
        )

    def test_admin_gestiona_reportes_y_publicaciones_de_todos_los_usuarios(self):
        reporte = Reporte.objects.create(
            usuario=self.usuario_app,
            titulo="Baranda danada",
            descripcion="Necesita mantenimiento.",
            imagen=crear_imagen("reporte.png"),
        )
        publicacion = Publicacion.objects.create(
            usuario=self.usuario_app,
            titulo="Visita",
            descripcion="Una visita a la poza.",
        )
        ImagenPublicacion.objects.create(
            publicacion=publicacion,
            imagen=crear_imagen("publicacion.png"),
        )
        self.iniciar_sesion()

        reportes = self.client.get(reverse("administracion_api:reportes"))
        actualizado = self.client.patch(
            reverse(
                "administracion_api:detalle_reporte",
                args=[reporte.id_reporte],
            ),
            {"estado": Reporte.Estado.ATENDIDO},
            format="json",
        )
        publicacion_oculta = self.client.patch(
            reverse(
                "administracion_api:detalle_publicacion",
                args=[publicacion.id_publicacion],
            ),
            {"activa": False},
            format="json",
        )

        self.assertEqual(reportes.status_code, status.HTTP_200_OK)
        self.assertEqual(reportes.data[0]["solicitante"], "Visitante")
        self.assertEqual(actualizado.status_code, status.HTTP_200_OK)
        self.assertEqual(actualizado.data["estado"], Reporte.Estado.ATENDIDO)
        self.assertEqual(publicacion_oculta.status_code, status.HTTP_200_OK)
        self.assertFalse(publicacion_oculta.data["activa"])
