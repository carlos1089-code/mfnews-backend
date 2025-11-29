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
| `body`       | String   | Contenido principal de la noticia                |
| `image_url`  | String?  | URL de la imagen destacada (Opcional)            |
| `author`     | String   | Nombre del autor de la noticia                   |
| `date`       | DateTime | Fecha de publicación (Default: Ahora)            |
| `created_at` | DateTime | Fecha de creación del registro                   |
| `updated_at` | DateTime | Fecha de última actualización                    |

---

## 📚 Documentación API (Swagger)

La API cuenta con documentación interactiva generada automáticamente con Swagger.
| Comando | Descripción |
| :--- | :--- |
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