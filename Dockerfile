# Stage 1: Node.js (Vite/React build)
FROM node:18-alpine AS node_builder
WORKDIR /app
# လိုအပ်တဲ့ package files တွေကိုပဲ အရင်ကူးပြီး install လုပ်ပါမယ် (Size သက်သာစေရန်)
COPY package*.json ./
RUN npm install
# ပြီးမှ source တွေကူးပြီး build ဆွဲမယ်
COPY . .
RUN npm run build

# Stage 2: PHP Apache (Production)
# ပိုပေါ့ပါးတဲ့ version ကို သုံးရင် size အများကြီး လျော့သွားပါမယ်
FROM php:8.2-apache

# လိုအပ်တဲ့ library တွေ သွင်းတဲ့အခါ cache ကို ဖျက်ထုတ်ပါမယ်
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql pdo_pgsql pgsql mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN a2enmod rewrite

WORKDIR /var/www/html

# Composer install အတွက် အရင်ကူးမယ်
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Project ဖိုင်တွေ အကုန်မကူးခင် .dockerignore ထဲမှာ node_modules နဲ့ vendor ကို အရင်ဖယ်ရပါမယ်
COPY . .

# Node build ထွက်လာတဲ့ output ကိုပဲ ကူးယူမယ်
COPY --from=node_builder /app/public /var/www/html/public
COPY --from=node_builder /app/package.json /var/www/html/package.json

# Composer dependencies သွင်းမယ်
RUN composer install --no-dev --optimize-autoloader

# Permission သတ်မှတ်ချက်
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apache root directory ပြင်ဆင်မှု
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

EXPOSE 80
# အရင်ရှိတဲ့ CMD နေရာမှာ ဒါလေးနဲ့ အစားထိုးပါ
CMD php artisan migrate:fresh --force && apache2-foreground
