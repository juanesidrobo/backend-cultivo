# Usar una imagen base de Node.js
FROM node:16-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto (no es estrictamente necesario para Cloud Run)
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "app.js"]
