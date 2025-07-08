# =========================================
# Etapa 1: Build da API
# =========================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS api-build

WORKDIR /src
COPY TodoApi/TodoApi.csproj ./TodoApi/
RUN dotnet restore ./TodoApi/TodoApi.csproj

COPY TodoApi/ ./TodoApi/
RUN dotnet publish ./TodoApi/TodoApi.csproj -c Release -o /app/api

# =========================================
# Etapa 2: Build do Angular
# =========================================
FROM node:20-alpine AS angular-build

WORKDIR /app
COPY calculado-peso/package*.json ./
RUN npm install

COPY calculado-peso/ ./
RUN npm run build

# =========================================
# Etapa 3: Runtime - Nginx com .NET
# =========================================
FROM nginx:alpine

# Instalar .NET Runtime
RUN apk add --no-cache icu-libs krb5-libs libgcc libintl libssl3 libstdc++ zlib

# Baixar e instalar .NET Runtime
RUN wget https://download.visualstudio.microsoft.com/download/pr/5226a5fa-8c0b-474f-b79a-8984ad7c5beb/3113ccbf789c9fd29972835f0f334b7a/aspnetcore-runtime-8.0.0-linux-musl-x64.tar.gz -O aspnetcore.tar.gz
RUN mkdir -p /usr/share/dotnet
RUN tar -zxf aspnetcore.tar.gz -C /usr/share/dotnet
RUN rm aspnetcore.tar.gz
RUN ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet

# Copiar arquivos da API
COPY --from=api-build /app/api /app/api

# Copiar arquivos do Angular
COPY --from=angular-build /app/dist/calculado-peso/browser /usr/share/nginx/html

# Configuração do Nginx
COPY nginx-production.conf /etc/nginx/conf.d/default.conf

# Script de inicialização
COPY start-production.sh /start.sh
RUN chmod +x /start.sh

EXPOSE $PORT

CMD ["/start.sh"]