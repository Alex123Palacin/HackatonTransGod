from django.urls import path

from .views import ConversacionActualView, EnviarMensajeView


app_name = "guia_api"

urlpatterns = [
    path(
        "conversacion/",
        ConversacionActualView.as_view(),
        name="conversacion_actual",
    ),
    path("mensajes/", EnviarMensajeView.as_view(), name="enviar_mensaje"),
]
