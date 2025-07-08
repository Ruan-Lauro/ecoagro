# Etapa 1: build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do Angular
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Executa o build de produção do Angular
RUN npm run build

# ----------------------------------------
# Etapa 2: servidor Nginx
FROM nginx:alpine

# Copia os arquivos gerados do build (corrigindo o caminho)
COPY --from=build /app/dist/calculado-peso/browser /usr/share/nginx/html

# Copia a configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]