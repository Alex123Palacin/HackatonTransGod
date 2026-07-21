from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ml.ia_guia import ErrorConexionOllama, ErrorRespuestaOllama
from ml.ia_guia import generar_respuesta as generar_respuesta_ollama

from .models import Conversacion, Mensaje
from .serializers import EnviarMensajeSerializer, MensajeSerializer


MAX_MENSAJES_HISTORIAL = 100
MAX_MENSAJES_CONTEXTO = 12


def serializar_conversacion(conversacion):
    if not conversacion:
        return {
            "id_conversacion": None,
            "titulo": "Nueva conversacion",
            "fecha": None,
            "mensajes": [],
        }

    mensajes = list(
        conversacion.mensajes.order_by("-id_mensaje")[:MAX_MENSAJES_HISTORIAL]
    )
    mensajes.reverse()
    return {
        "id_conversacion": conversacion.id_conversacion,
        "titulo": conversacion.titulo,
        "fecha": conversacion.fecha,
        "mensajes": MensajeSerializer(mensajes, many=True).data,
    }


class SinCacheMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Cache-Control"] = "no-store"
        return response


class ConversacionActualView(SinCacheMixin, APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        conversacion = Conversacion.objects.filter(usuario=request.user).first()
        return Response(serializar_conversacion(conversacion))


class EnviarMensajeView(SinCacheMixin, APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = EnviarMensajeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        datos = serializer.validated_data
        id_conversacion = datos.get("id_conversacion")

        if id_conversacion:
            conversacion = get_object_or_404(
                Conversacion,
                id_conversacion=id_conversacion,
                usuario=request.user,
            )
        else:
            conversacion = Conversacion.objects.filter(usuario=request.user).first()
            if not conversacion:
                conversacion = Conversacion.objects.create(
                    usuario=request.user,
                    titulo=datos["mensaje"][:80],
                )

        mensaje_usuario = Mensaje.objects.create(
            conversacion=conversacion,
            emisor=Mensaje.Emisor.USUARIO,
            mensaje=datos["mensaje"],
        )
        mensajes_contexto = list(
            conversacion.mensajes.order_by("-id_mensaje")[:MAX_MENSAJES_CONTEXTO]
        )
        mensajes_contexto.reverse()
        historial = [
            {
                "role": (
                    "user"
                    if mensaje.emisor == Mensaje.Emisor.USUARIO
                    else "assistant"
                ),
                "content": mensaje.mensaje,
            }
            for mensaje in mensajes_contexto
        ]

        try:
            respuesta_ia = generar_respuesta_ollama(
                historial,
                modo_respuesta=datos["modo_respuesta"],
            )
        except (ErrorConexionOllama, ErrorRespuestaOllama) as error:
            return Response(
                {
                    "detail": str(error),
                    "id_conversacion": conversacion.id_conversacion,
                    "mensaje_usuario": MensajeSerializer(mensaje_usuario).data,
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        mensaje_ia = Mensaje.objects.create(
            conversacion=conversacion,
            emisor=Mensaje.Emisor.IA,
            mensaje=respuesta_ia,
        )
        return Response(
            {
                "id_conversacion": conversacion.id_conversacion,
                "mensaje_usuario": MensajeSerializer(mensaje_usuario).data,
                "mensaje_ia": MensajeSerializer(mensaje_ia).data,
            },
            status=status.HTTP_201_CREATED,
        )
