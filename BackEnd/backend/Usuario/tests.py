from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    CuentaAdministrativa,
    CuentaAplicacion,
    SesionCuentaAplicacion,
    Usuario,
)


class AutenticacionApiTests(APITestCase):
    correo = "alex@pozaarenilla.com"
    password = "C0ndor!Marino_2026"

    def datos_registro(self, **cambios):
        datos = {
            "nombre": "Alex",
            "correo": self.correo,
            "password": self.password,
        }
        datos.update(cambios)
        return datos

    def crear_usuario(self):
        return CuentaAplicacion.objects.create_user(
            correo=self.correo,
            nombre="Alex",
            password=self.password,
        )

    def test_registro_crea_usuario_con_password_hasheado(self):
        respuesta = self.client.post(
            reverse("usuario_api:registro"),
            self.datos_registro(),
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        usuario = CuentaAplicacion.objects.get(correo=self.correo)
        self.assertNotEqual(usuario.password, self.password)
        self.assertTrue(usuario.check_password(self.password))
        self.assertFalse(Usuario.objects.filter(correo=self.correo).exists())
        self.assertNotIn("password", respuesta.data)

    def test_administradores_y_cuentas_app_usar_tablas_diferentes(self):
        self.assertEqual(Usuario._meta.db_table, "usuario_administrador")
        self.assertEqual(
            CuentaAplicacion._meta.db_table,
            "usuario_cuenta_aplicacion",
        )
        self.assertNotEqual(Usuario._meta.db_table, CuentaAplicacion._meta.db_table)

    def test_cuenta_creada_desde_registro_puede_iniciar_sesion(self):
        registro = self.client.post(
            reverse("usuario_api:registro"),
            self.datos_registro(),
            format="json",
        )

        login = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo, "password": self.password},
            format="json",
        )

        self.assertEqual(registro.status_code, status.HTTP_201_CREATED)
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertEqual(login.data["usuario"]["nombre"], "Alex")
        self.assertIn("access", login.data)

    def test_registro_rechaza_correo_duplicado_sin_importar_mayusculas(self):
        self.crear_usuario()

        respuesta = self.client.post(
            reverse("usuario_api:registro"),
            self.datos_registro(correo=self.correo.upper()),
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("correo", respuesta.data)

    def test_registro_rechaza_password_debil(self):
        respuesta = self.client.post(
            reverse("usuario_api:registro"),
            self.datos_registro(password="12345678"),
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", respuesta.data)

    def test_login_devuelve_tokens_y_usuario(self):
        self.crear_usuario()

        respuesta = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo.upper(), "password": self.password},
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertIn("access", respuesta.data)
        self.assertIn("refresh", respuesta.data)
        self.assertEqual(respuesta.data["usuario"]["correo"], self.correo)
        sesion = SesionCuentaAplicacion.objects.get(usuario__correo=self.correo)
        self.assertNotEqual(sesion.access_hash, respuesta.data["access"])
        self.assertNotEqual(sesion.refresh_hash, respuesta.data["refresh"])

    def test_login_rechaza_password_incorrecto(self):
        self.crear_usuario()

        respuesta = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo, "password": "PasswordIncorrecto123!"},
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_publico_rechaza_cuenta_administrativa(self):
        administrador = Usuario.objects.create_superuser(
            correo="administrador@pozaarenilla.com",
            nombre="Administrador",
            password=self.password,
        )

        respuesta = self.client.post(
            reverse("usuario_api:login"),
            {"correo": administrador.correo, "password": self.password},
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(
            CuentaAdministrativa.objects.filter(pk=administrador.pk).exists()
        )
        self.assertFalse(
            CuentaAplicacion.objects.filter(correo=administrador.correo).exists()
        )

    def test_panel_admin_muestra_cuentas_y_administradores_por_separado(self):
        cuenta_app = self.crear_usuario()
        administrador = Usuario.objects.create_superuser(
            correo="panel@pozaarenilla.com",
            nombre="Administrador del panel",
            password=self.password,
        )
        self.client.force_login(administrador)

        cuentas = self.client.get(
            reverse("admin:usuario_cuentaaplicacion_changelist")
        )
        administradores = self.client.get(
            reverse("admin:usuario_cuentaadministrativa_changelist")
        )

        self.assertEqual(cuentas.status_code, status.HTTP_200_OK)
        self.assertEqual(administradores.status_code, status.HTTP_200_OK)
        correos_cuentas = {
            usuario.correo for usuario in cuentas.context["cl"].result_list
        }
        correos_administradores = {
            usuario.correo
            for usuario in administradores.context["cl"].result_list
        }
        self.assertEqual(correos_cuentas, {cuenta_app.correo})
        self.assertEqual(correos_administradores, {administrador.correo})

    def test_perfil_requiere_autenticacion(self):
        respuesta = self.client.get(reverse("usuario_api:perfil"))
        self.assertEqual(respuesta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_rota_tokens_y_anula_los_anteriores(self):
        self.crear_usuario()
        login = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo, "password": self.password},
            format="json",
        )

        renovacion = self.client.post(
            reverse("usuario_api:refresh"),
            {"refresh": login.data["refresh"]},
            format="json",
        )

        self.assertEqual(renovacion.status_code, status.HTTP_200_OK)
        self.assertNotEqual(renovacion.data["access"], login.data["access"])
        self.assertNotEqual(renovacion.data["refresh"], login.data["refresh"])

        refresh_anterior = self.client.post(
            reverse("usuario_api:refresh"),
            {"refresh": login.data["refresh"]},
            format="json",
        )
        self.assertEqual(refresh_anterior.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {renovacion.data['access']}"
        )
        perfil = self.client.get(reverse("usuario_api:perfil"))
        self.assertEqual(perfil.status_code, status.HTTP_200_OK)

    def test_usuario_autenticado_puede_consultar_perfil_y_cerrar_sesion(self):
        self.crear_usuario()
        login = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo, "password": self.password},
            format="json",
        )
        access = login.data["access"]
        refresh = login.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        perfil = self.client.get(reverse("usuario_api:perfil"))
        self.assertEqual(perfil.status_code, status.HTTP_200_OK)
        self.assertEqual(perfil.data["correo"], self.correo)

        logout = self.client.post(
            reverse("usuario_api:logout"),
            format="json",
        )
        self.assertEqual(logout.status_code, status.HTTP_204_NO_CONTENT)

        self.client.credentials()
        renovar = self.client.post(
            reverse("usuario_api:refresh"),
            {"refresh": refresh},
            format="json",
        )
        self.assertEqual(renovar.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_sesion_inactiva_es_revocada_en_backend(self):
        self.crear_usuario()
        login = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo, "password": self.password},
            format="json",
        )
        sesion = SesionCuentaAplicacion.objects.get(usuario__correo=self.correo)
        sesion.ultima_actividad = timezone.now() - timedelta(minutes=31)
        sesion.save(update_fields=["ultima_actividad"])
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )

        respuesta = self.client.get(reverse("usuario_api:perfil"))

        self.assertEqual(respuesta.status_code, status.HTTP_401_UNAUTHORIZED)
        sesion.refresh_from_db()
        self.assertTrue(sesion.revocada)

    def test_actividad_mantiene_vigente_solo_la_sesion_de_esa_cuenta(self):
        self.crear_usuario()
        login = self.client.post(
            reverse("usuario_api:login"),
            {"correo": self.correo, "password": self.password},
            format="json",
        )
        sesion = SesionCuentaAplicacion.objects.get(usuario__correo=self.correo)
        fecha_anterior = timezone.now() - timedelta(minutes=5)
        sesion.ultima_actividad = fecha_anterior
        sesion.save(update_fields=["ultima_actividad"])
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )

        respuesta = self.client.post(reverse("usuario_api:actividad"))

        self.assertEqual(respuesta.status_code, status.HTTP_204_NO_CONTENT)
        sesion.refresh_from_db()
        self.assertGreater(sesion.ultima_actividad, fecha_anterior)
