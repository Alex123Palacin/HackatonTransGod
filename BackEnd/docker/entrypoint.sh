#!/bin/sh
set -eu

if [ "$(id -u)" = "0" ]; then
    chown -R django:django /app/staticfiles /app/media
    exec gosu django "$0" "$@"
fi

echo "Aplicando migraciones..."
python manage.py migrate --noinput

echo "Recolectando archivos estaticos..."
python manage.py collectstatic --noinput

python manage.py crear_superusuario_inicial

exec "$@"
