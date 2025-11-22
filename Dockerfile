# 1. Usamos Node 18 o 20
FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

# 2. Directorio de trabajo adentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instalamos dependencias
RUN npm install

# 5. Generamos el cliente de Prisma (¡CRUCIAL en NestJS!)
RUN npx prisma generate

# 6. Copiamos el resto del código
COPY . .

# 7. Compilamos el código (TypeScript -> JavaScript en carpeta /dist)
RUN npm run build

# 8. Exponemos el puerto
EXPOSE 3000

# 9. Comando de inicio (Corre el código compilado)
CMD ["npm", "run", "start:prod"]