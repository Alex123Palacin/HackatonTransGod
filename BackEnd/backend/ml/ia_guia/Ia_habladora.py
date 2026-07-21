import json
import os
import re
import socket
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .entrenamiento_ia import MODO_PREDETERMINADO, PROMPTS_GUIA


class ErrorConexionOllama(Exception):
    pass


class ErrorRespuestaOllama(Exception):
    pass


def construir_prompt_sistema(modo_respuesta):
    modo = (
        modo_respuesta
        if modo_respuesta in PROMPTS_GUIA["modos"]
        else MODO_PREDETERMINADO
    )
    partes = [
        PROMPTS_GUIA["identidad"],
        PROMPTS_GUIA["contexto_verificado"],
        PROMPTS_GUIA["reglas_base"],
        PROMPTS_GUIA["modos"][modo],
        *PROMPTS_GUIA["reglas_adicionales"],
    ]
    return "\n\n".join(parte.strip() for parte in partes if parte.strip())


def limpiar_respuesta(texto):
    sin_razonamiento = re.sub(
        r"<think>.*?</think>",
        "",
        texto,
        flags=re.DOTALL | re.IGNORECASE,
    )
    return sin_razonamiento.strip()


def _mensaje_error_http(error):
    try:
        contenido = error.read().decode("utf-8")
        datos = json.loads(contenido)
        return datos.get("error") or contenido
    except (UnicodeDecodeError, json.JSONDecodeError):
        return str(error)


def generar_respuesta(mensajes, modo_respuesta=MODO_PREDETERMINADO):
    url_base = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
    modelo = os.getenv("OLLAMA_MODELO_GUIA", "deepseek-r1:8b")
    timeout = int(os.getenv("OLLAMA_TIMEOUT_SEGUNDOS", "180"))
    mantener_modelo = os.getenv("OLLAMA_KEEP_ALIVE", "2m")
    historial = [
        {
            "role": mensaje["role"],
            "content": mensaje["content"].strip(),
        }
        for mensaje in mensajes
        if mensaje.get("role") in {"user", "assistant"}
        and mensaje.get("content", "").strip()
    ]
    if not historial:
        raise ValueError("Se necesita al menos un mensaje para consultar la IA.")

    cuerpo = json.dumps(
        {
            "model": modelo,
            "messages": [
                {
                    "role": "system",
                    "content": construir_prompt_sistema(modo_respuesta),
                },
                *historial,
            ],
            "stream": False,
            "think": False,
            "keep_alive": mantener_modelo,
            "options": {"temperature": 0.2},
        }
    ).encode("utf-8")
    solicitud = Request(
        f"{url_base}/api/chat",
        data=cuerpo,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(solicitud, timeout=timeout) as respuesta:
            datos = json.loads(respuesta.read().decode("utf-8"))
    except HTTPError as error:
        detalle = _mensaje_error_http(error)
        raise ErrorRespuestaOllama(
            f"Ollama rechazo la solicitud: {detalle}"
        ) from error
    except (URLError, ConnectionError, socket.timeout, TimeoutError) as error:
        raise ErrorConexionOllama(
            "No se pudo conectar con Ollama. Comprueba que Ollama este iniciado."
        ) from error
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ErrorRespuestaOllama(
            "Ollama devolvio una respuesta que no se pudo interpretar."
        ) from error

    contenido = datos.get("message", {}).get("content", "")
    respuesta_limpia = limpiar_respuesta(contenido)
    if not respuesta_limpia:
        raise ErrorRespuestaOllama("Ollama no devolvio una respuesta final.")
    return respuesta_limpia
