# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Construye la app
RUN npm run build

# Etapa 2: Nginx para servir la app
FROM nginx:stable-alpine

# Copia el build a nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuración personalizada si tienes
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
