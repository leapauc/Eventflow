# Image Node
FROM node:20

WORKDIR /app

# Copier uniquement package.json d'abord (optimisation cache)
COPY package*.json ./

RUN npm install

# Copier uniquement les fichiers nécessaires
COPY public ./public
COPY src ./src
COPY index.html .
COPY jsconfig.json .
COPY vite.config.js .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]