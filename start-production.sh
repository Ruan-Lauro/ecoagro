#!/bin/sh

# Configurar a porta do Render
sed -i "s/listen 80;/listen $PORT;/" /etc/nginx/conf.d/default.conf

# Iniciar a API em background
cd /app/api
ASPNETCORE_URLS=http://+:5000 ASPNETCORE_ENVIRONMENT=Production dotnet TodoApi.dll &

# Aguardar a API subir
sleep 10

# Iniciar o Nginx
nginx -g "daemon off;"