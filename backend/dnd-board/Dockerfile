FROM php:8.3-fpm
LABEL maintainer="Enrique Faz Dionisio <enrique71296@gmail.com>"

ENV APP_ENV=production
ENV APP_DEBUG=false

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    netcat-openbsd \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY . /var/www
RUN chown -R www-data:www-data /var/www

VOLUME ["/var/www/storage"]
EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
