# Étape 1 : Build de l'application React / Vite
FROM node:20-alpine AS builder
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build
COPY . .
RUN npm run build

# Étape 2 : Serveur web Nginx pour servir les fichiers statiques
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# On expose le port 80 pour Nginx (interne au conteneur)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
