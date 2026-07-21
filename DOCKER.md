# Docker y Dokploy

El proyecto usa cinco servicios:

- `frontend`: React compilado y servido por Nginx. Es el unico servicio publico.
- `backend`: Django ejecutado con Gunicorn.
- `db`: PostgreSQL con almacenamiento persistente.
- `ollama`: servidor local de IA.
- `ollama-init`: descarga `deepseek-r1:8b` en el primer despliegue.

PostgreSQL, los archivos subidos y los modelos se guardan en volumenes Docker. Un nuevo despliegue del repositorio no elimina esos datos.

## Ejecutar localmente

Inicia Docker Desktop y, desde la raiz del repositorio, ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File .\docker\iniciar-local.ps1
```

Tambien puedes ejecutar Compose directamente:

```powershell
if (-not (Test-Path .env.docker)) { Copy-Item .env.docker.example .env.docker }
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml up --build -d
```

Abre:

- Aplicacion: `http://localhost:8080`
- Administracion: `http://localhost:8080/admin/`
- PostgreSQL local: `127.0.0.1:5433`
- Ollama local: `127.0.0.1:11435`

El usuario administrativo local de ejemplo se copia a `.env.docker`. Ese archivo esta ignorado por Git y es solo para pruebas.

La primera descarga del modelo ocupa varios GB. Para seguirla:

```powershell
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml logs -f ollama-init
```

`deepseek-r1:8b` ocupa aproximadamente 5.2 GB solo en disco. La imagen oficial de Ollama ocupa otros 3.3 GB, por lo que 7 GB de almacenamiento no son suficientes; reserva al menos 12 GB libres para Docker, sin contar respaldos ni crecimiento de PostgreSQL.

En la prueba local, Ollama uso 5.7 GiB de RAM mientras el modelo estaba cargado y bajo a 184 MiB dos minutos despues de la ultima respuesta. Un servidor con 7 GB de RAM puede ejecutarlo con una sola consulta simultanea, pero tiene poco margen para el sistema, Dokploy y Traefik. Mantener `OLLAMA_NUM_PARALLEL=1`, disponer de swap y evitar otros servicios pesados reduce el riesgo de que el sistema cierre Ollama por falta de memoria.

Para detener los servicios conservando los datos:

```powershell
docker compose --env-file .env.docker -f docker-compose.yml -f docker-compose.local.yml down
```

No uses `down -v` salvo que quieras eliminar definitivamente la base de datos, archivos y modelo local.

## Variables en Dokploy

Configura estas variables en la seccion Environment del Compose. Genera contrasenas nuevas; no copies las de desarrollo.

```dotenv
POSTGRES_DB=BaseDatosPozoArenilla
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CAMBIAR_POR_UNA_CLAVE_LARGA
POSTGRES_CONN_MAX_AGE=60

DJANGO_DEBUG=False
DJANGO_SECRET_KEY=CAMBIAR_POR_UNA_CLAVE_ALEATORIA_LARGA
DJANGO_ALLOWED_HOSTS=davidlent.shop,www.davidlent.shop,localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=https://davidlent.shop,https://www.davidlent.shop
CORS_ALLOWED_ORIGINS=https://davidlent.shop,https://www.davidlent.shop
DJANGO_SECURE_SSL_REDIRECT=True
DJANGO_SECURE_COOKIES=True
DJANGO_HSTS_SECONDS=3600
DJANGO_HSTS_INCLUDE_SUBDOMAINS=False
DJANGO_HSTS_PRELOAD=False
SESION_INACTIVIDAD_MINUTOS=30

DJANGO_SUPERUSER_EMAIL=TU_CORREO_ADMIN
DJANGO_SUPERUSER_NAME=Administrador
DJANGO_SUPERUSER_PASSWORD=CAMBIAR_POR_UNA_CLAVE_ADMIN

OLLAMA_MODELO_GUIA=deepseek-r1:8b
OLLAMA_TIMEOUT_SEGUNDOS=180
OLLAMA_KEEP_ALIVE=2m
OLLAMA_NUM_PARALLEL=1
OLLAMA_MAX_LOADED_MODELS=1
GUNICORN_WORKERS=2
GUNICORN_TIMEOUT=240
```

Puedes generar `DJANGO_SECRET_KEY` con:

```powershell
py -c "import secrets; print(secrets.token_urlsafe(64))"
```

## Configurar Dokploy

1. Crea un servicio de tipo Docker Compose conectado al repositorio `HackatonTransGod`.
2. Selecciona la rama que contiene estos archivos.
3. Usa `./docker-compose.yml` como Compose Path.
4. Activa Isolated Deployments.
5. Copia las variables anteriores en Environment y cambia todos los secretos.
6. Despliega y espera a que `ollama-init` termine la descarga.
7. En Domains agrega `davidlent.shop`, selecciona el servicio `frontend` y el puerto `80`.
8. Agrega `www.davidlent.shop` al mismo servicio y configura la redireccion al dominio principal.
9. Activa HTTPS con Let's Encrypt para ambos dominios.

Los registros DNS deben apuntar a `46.202.92.35`:

```text
A     @      46.202.92.35
A     www    46.202.92.35
```

No publiques los puertos `5432`, `8000` ni `11434` en el VPS.

## Migrar la base de datos existente

La base de datos no debe subirse a GitHub. Genera un respaldo binario local:

```powershell
pg_dump -h 127.0.0.1 -p 5432 -U postgres -d BaseDatosPozoArenilla -Fc -f BaseDatosPozoArenilla.dump
```

El archivo `.dump` esta ignorado porque puede contener usuarios y datos privados. Cuando el Compose ya este desplegado, se copia al contenedor `db` y se restaura con `pg_restore`. Los archivos actuales de `BackEnd/backend/media` deben copiarse por separado al volumen `django_media`.

Realiza una copia de seguridad de ambos volumenes antes de cada restauracion. Dokploy puede respaldar volumenes Docker nombrados.
