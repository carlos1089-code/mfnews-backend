# 🚀 MFNews API (Backend)

API RESTful desarrollada con **NestJS** y **TypeScript** para la gestión de noticias. Diseñada bajo principios de Arquitectura Modular, escalabilidad y seguridad.

## 🛠️ Tech Stack

*   **Framework:** [NestJS](https://nestjs.com/) (Node.js)
*   **Base de Datos:** PostgreSQL 16
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Contenedorización:** Docker & Docker Compose
*   **Seguridad:** Helmet, Rate Limiting (Throttler), JWT Auth, BCrypt
*   **Documentación:** Swagger (OpenAPI)

## ✨ Características Principales

*   **Arquitectura Modular:** Separación clara de dominios (`Auth`, `News`, `Prisma`, `Common`).
*   **Validación Robusta:** Uso de DTOs con `class-validator` y `class-transformer` para sanitizar entradas.
*   **Seguridad Enterprise:** Headers HTTP seguros con Helmet, protección contra fuerza bruta con Rate Limiting y autenticación vía JWT.
*   **Búsqueda Optimizada:** Implementación de filtros de texto `insensitive` y paginación eficiente.
*   **Docker Ready:** Configuración lista para levantar el entorno completo (DB + API) con un solo comando.

---

## 🚀 Instalación y Configuración

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

*   **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
*   **npm** (v9 o superior) - Incluido con Node.js
*   **Docker** y **Docker Compose** - [Descargar](https://www.docker.com/get-started)
*   **Git** - [Descargar](https://git-scm.com/)

### 1️⃣ Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd mfnews-backend
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto. Las variables de entorno requeridas han sido compartidas de forma privada y segura.

> [!IMPORTANT]
> No subas el archivo `.env` al repositorio. Este archivo contiene información sensible como credenciales de base de datos y secretos JWT.

### 4️⃣ Iniciar la Base de Datos con Docker

La base de datos PostgreSQL se ejecuta en un contenedor Docker **separado** de la aplicación:

```bash
# Iniciar solo el contenedor de la base de datos
docker-compose up db -d
```

Este comando:
- ✅ Descarga la imagen de PostgreSQL 16 (si no existe)
- ✅ Crea un contenedor llamado `mfnews_db`
- ✅ Expone el puerto `5432` en tu máquina local
- ✅ Persiste los datos en un volumen Docker

Para verificar que la base de datos está corriendo:

```bash
docker ps
```

Deberías ver el contenedor `mfnews_db` en estado `Up`.

### 5️⃣ Ejecutar Migraciones de Prisma

Una vez que la base de datos esté corriendo, ejecuta las migraciones para crear las tablas:

```bash
npx prisma migrate dev
```

Opcionalmente, puedes poblar la base de datos con datos de prueba:

```bash
npx prisma db seed
```

### 6️⃣ Iniciar la Aplicación Backend

Con la base de datos corriendo en Docker, inicia el servidor NestJS **localmente**:

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# O modo producción
npm run start
```

La API estará disponible en: **http://localhost:3000**

### 7️⃣ Acceder a la Documentación Swagger

Una vez que el servidor esté corriendo, accede a la documentación interactiva en:

**🔗 http://localhost:3000/docs**

---

## 🐳 Alternativa: Ejecutar Todo con Docker Compose

Si prefieres ejecutar **tanto la base de datos como el backend** en contenedores Docker:

```bash
# Iniciar todos los servicios (DB + Backend)
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener todos los servicios
docker-compose down
```

> [!NOTE]
> Esta opción es útil para producción o para replicar el entorno completo sin instalar Node.js localmente.

---

## 🛑 Detener los Servicios

### Detener solo la base de datos:
```bash
docker-compose down db
```

### Detener todos los servicios:
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ elimina los datos):
```bash
docker-compose down -v
```

---

## 📂 Estructura del Proyecto

```bash
src/
├── auth/           # Módulo de Autenticación (Login, Registro, JWT)
├── news/           # Módulo de Noticias (CRUD, Búsqueda, Paginación)
├── prisma/         # Servicio de conexión a Base de Datos
├── main.ts         # Punto de entrada y configuración de Swagger/Pipes
└── app.module.ts   # Módulo raíz de la aplicación
```

---

## 🗄️ Modelo de Datos (Entidades)

### 👤 User
Representa a los usuarios del sistema (Administradores o Lectores).

| Campo       | Tipo     | Descripción                                      |
| :---------- | :------- | :----------------------------------------------- |
| `id`        | Int      | Identificador único (Autoincremental)            |
| `email`     | String   | Correo electrónico (Único)                       |
| `name`      | String   | Nombre completo del usuario                      |
| `password`  | String   | Contraseña hasheada (BCrypt)                     |
| `role`      | String   | Rol del usuario (Default: "USER")                |
| `createdAt` | DateTime | Fecha de creación                                |
| `updatedAt` | DateTime | Fecha de última actualización                    |

### 📰 News
Representa las noticias publicadas en la plataforma.

| Campo        | Tipo     | Descripción                                      |
| :----------- | :------- | :----------------------------------------------- |
| `id`         | Int      | Identificador único (Autoincremental)            |
| `title`      | String   | Título de la noticia                             |
| `subtitle`   | String?  | Subtítulo o resumen breve (Opcional)             |
| `body`       | String   | Contenido principal de la noticia                |
| `image_url`  | String?  | URL de la imagen destacada (Opcional)            |
| `author`     | String   | Nombre del autor de la noticia                   |
| `date`       | DateTime | Fecha de publicación (Default: Ahora)            |
| `created_at` | DateTime | Fecha de creación del registro                   |
| `updated_at` | DateTime | Fecha de última actualización                    |

---

## 📚 Documentación API (Swagger)

La API cuenta con documentación interactiva generada automáticamente con Swagger.

**Acceso:** Una vez iniciado el servidor, visita [http://localhost:3000/api](http://localhost:3000/api)

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run start` | Inicia el servidor en modo producción. |
| `npm run start:dev` | Inicia el servidor en modo desarrollo (Watch Mode). |
| `npm run build` | Compila la aplicación para producción en la carpeta `/dist`. |
| `npm run lint` | Ejecuta ESLint para analizar y arreglar problemas de código. |
| `npm run format` | Formatea el código usando Prettier. |

---

## 🧪 Testing

El proyecto utiliza **Jest** para ejecutar las pruebas.

### Ejecución con Docker (Recomendado)
```bash
# Tests Unitarios
docker-compose exec backend npm run test

# Coverage
docker-compose exec backend npm run test:cov
```

### Ejecución Local
```bash
npm run test
npm run test:cov
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**.
