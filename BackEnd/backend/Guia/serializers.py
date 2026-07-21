from rest_framework import serializers

from .models import Conversacion, Mensaje


class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = ("id_mensaje", "emisor", "mensaje", "fecha")
        read_only_fields = fields


class ConversacionSerializer(serializers.ModelSerializer):
    mensajes = MensajeSerializer(many=True, read_only=True)

    class Meta:
        model = Conversacion
        fields = (
            "id_conversacion",
            "titulo",
            "fecha",
            "mensajes",
        )
        read_only_fields = fields


class EnviarMensajeSerializer(serializers.Serializer):
    id_conversacion = serializers.IntegerField(required=False, min_value=1)
    mensaje = serializers.CharField(
        max_length=2000,
        trim_whitespace=True,
        allow_blank=False,
    )
    modo_respuesta = serializers.ChoiceField(
        choices=("corta", "explicativa"),
        default="corta",
        required=False,
    )

    def validate_mensaje(self, mensaje):
        mensaje_limpio = mensaje.strip()
        if not mensaje_limpio:
            raise serializers.ValidationError("Escribe una pregunta para la guia.")
        return mensaje_limpio
