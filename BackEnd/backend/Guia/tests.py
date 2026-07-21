import json
from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from Usuario.models import CuentaAplicacion
from ml.ia_guia import ErrorConexionOllama
from ml.ia_guia.Ia_habladora import (
    construir_prompt_sistema,
    generar_respuesta,
    limpiar_respuesta,
)

from .models import Conversacion, Mensaje


class GuiaApiTests(APITestCase):
    password = "Gu1a!Segura_2026"

    def setUp(self):
        self.usuario = CuentaAplicacion.objects.create_user(
            correo="guia@pozaarenilla.com",
            nombre="Usuario guia",
            password=self.password,
        )
        self.otro_usuario = CuentaAplicacion.objects.create_user(
            correo="otra-guia@pozaarenilla.com",
            nombre="Otra cuenta",
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

    def test_endpoints_requieren_autenticacion(self):
        self.assertEqual(
            self.client.get(reverse("guia_api:conversacion_actual")).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )
        self.assertEqual(
            self.client.post(
                reverse("guia_api:enviar_mensaje"),
                {"mensaje": "Hola"},
                format="json",
            ).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_conversacion_vacia_no_crea_registros(self):
        self.autenticar()

        respuesta = self.client.get(reverse("guia_api:conversacion_actual"))

        self.assertEqual(respuesta.status_code, status.HTTP_200_OK)
        self.assertIsNone(respuesta.data["id_conversacion"])
        self.assertEqual(respuesta.data["mensajes"], [])
        self.assertFalse(Conversacion.objects.exists())
        self.assertEqual(respuesta["Cache-Control"], "no-store")

    @patch("Guia.views.generar_respuesta_ollama", return_value="Respuesta breve.")
    def test_envio_crea_conversacion_y_guarda_ambos_mensajes(self, generar):
        self.autenticar()

        respuesta = self.client.post(
            reverse("guia_api:enviar_mensaje"),
            {"mensaje": "Que aves puedo observar?"},
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        conversacion = Conversacion.objects.get()
        self.assertEqual(conversacion.usuario, self.usuario)
        self.assertEqual(conversacion.mensajes.count(), 2)
        self.assertEqual(
            list(conversacion.mensajes.values_list("emisor", flat=True)),
            [Mensaje.Emisor.USUARIO, Mensaje.Emisor.IA],
        )
        self.assertEqual(respuesta.data["mensaje_ia"]["mensaje"], "Respuesta breve.")
        historial = generar.call_args.args[0]
        self.assertEqual(historial[-1]["content"], "Que aves puedo observar?")
        self.assertEqual(generar.call_args.kwargs["modo_respuesta"], "corta")

    @patch("Guia.views.generar_respuesta_ollama", return_value="Respuesta amplia.")
    def test_continua_chat_existente_y_acepta_modo_explicativo(self, generar):
        conversacion = Conversacion.objects.create(
            usuario=self.usuario,
            titulo="Aves del humedal",
        )
        Mensaje.objects.create(
            conversacion=conversacion,
            emisor=Mensaje.Emisor.USUARIO,
            mensaje="Que es un humedal?",
        )
        Mensaje.objects.create(
            conversacion=conversacion,
            emisor=Mensaje.Emisor.IA,
            mensaje="Es un ecosistema.",
        )
        self.autenticar()

        respuesta = self.client.post(
            reverse("guia_api:enviar_mensaje"),
            {
                "id_conversacion": conversacion.id_conversacion,
                "mensaje": "Explicamelo mejor",
                "modo_respuesta": "explicativa",
            },
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(conversacion.mensajes.count(), 4)
        self.assertEqual(generar.call_args.kwargs["modo_respuesta"], "explicativa")
        self.assertEqual(len(generar.call_args.args[0]), 3)

    def test_una_cuenta_no_puede_abrir_ni_usar_chat_ajeno(self):
        conversacion_ajena = Conversacion.objects.create(
            usuario=self.otro_usuario,
            titulo="Chat ajeno",
        )
        Mensaje.objects.create(
            conversacion=conversacion_ajena,
            emisor=Mensaje.Emisor.USUARIO,
            mensaje="Mensaje privado",
        )
        self.autenticar()

        actual = self.client.get(reverse("guia_api:conversacion_actual"))
        envio = self.client.post(
            reverse("guia_api:enviar_mensaje"),
            {
                "id_conversacion": conversacion_ajena.id_conversacion,
                "mensaje": "Intento de acceso",
            },
            format="json",
        )

        self.assertIsNone(actual.data["id_conversacion"])
        self.assertEqual(envio.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(conversacion_ajena.mensajes.count(), 1)

    @patch(
        "Guia.views.generar_respuesta_ollama",
        side_effect=ErrorConexionOllama("Ollama no esta disponible."),
    )
    def test_error_de_ollama_conserva_pregunta_y_no_inventa_respuesta(self, generar):
        self.autenticar()

        respuesta = self.client.post(
            reverse("guia_api:enviar_mensaje"),
            {"mensaje": "Hay garzas?"},
            format="json",
        )

        self.assertEqual(respuesta.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(Mensaje.objects.count(), 1)
        self.assertEqual(Mensaje.objects.get().emisor, Mensaje.Emisor.USUARIO)
        self.assertIn("Ollama", respuesta.data["detail"])
        generar.assert_called_once()


class ConfiguracionPromptsTests(APITestCase):
    def test_modo_corto_es_diferente_del_explicativo(self):
        corto = construir_prompt_sistema("corta")
        explicativo = construir_prompt_sistema("explicativa")

        self.assertIn("breve", corto)
        self.assertIn("explicativa", explicativo)
        self.assertNotEqual(corto, explicativo)

    def test_limpia_bloque_de_razonamiento_de_deepseek(self):
        respuesta = limpiar_respuesta(
            "<think>razonamiento que no se muestra</think>Respuesta final."
        )

        self.assertEqual(respuesta, "Respuesta final.")

    @patch.dict("os.environ", {"OLLAMA_KEEP_ALIVE": "30s"})
    @patch("ml.ia_guia.Ia_habladora.urlopen")
    def test_keep_alive_de_ollama_es_configurable(self, abrir_url):
        respuesta_http = abrir_url.return_value.__enter__.return_value
        respuesta_http.read.return_value = json.dumps(
            {"message": {"content": "Respuesta final."}}
        ).encode("utf-8")

        generar_respuesta([{"role": "user", "content": "Hola"}])

        solicitud = abrir_url.call_args.args[0]
        cuerpo = json.loads(solicitud.data.decode("utf-8"))
        self.assertEqual(cuerpo["keep_alive"], "30s")
