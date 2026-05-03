#!/bin/bash

mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache/data

if [ ! -d "vendor" ]; then
    echo "Instalando dependencias de Composer..."
    composer install --optimize-autoloader --no-dev
fi

chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

php artisan optimize:clear

echo "Esperando a que MySQL esté listo en el host 'db'..."
while ! nc -z db 3306; do
  sleep 1
done

echo "Ejecutando migraciones..."
php artisan migrate --force

echo "Iniciando PHP-FPM..."
exec php-fpm
