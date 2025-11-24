# 🚀 MFNews API (Backend)

API RESTful desarrollada con **NestJS** y **TypeScript** para la gestión de noticias. Diseñada bajo principios de Arquitectura Modular, escalabilidad y seguridad.

## 🛠️ Tech Stack

* **Framework:** NestJS (Node.js)
* **Base de Datos:** PostgreSQL 16
* **ORM:** Prisma
* **Contenedorización:** Docker & Docker Compose
* **Seguridad:** Helmet, Rate Limiting (Throttler), JWT Auth, BCrypt
* **Documentación:** Swagger (OpenAPI)

## ✨ Características Principales

* **Arquitectura Modular:** Separación clara de dominios (`Auth`, `News`, `Prisma`, `Common`).
* **Validación Robusta:** Uso de DTOs con `class-validator` y `class-transformer` para sanitizar entradas.
* **Seguridad Enterprise:** Headers HTTP seguros con Helmet, protección contra fuerza bruta con Rate Limiting y autenticación vía JWT.
* **Búsqueda Optimizada:** Implementación de filtros de texto `insensitive` y paginación eficiente.
* **Docker Ready:** Configuración lista para levantar el entorno completo (DB + API) con un solo comando.

---

## ⚙️ Configuración del Entorno

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repo>
    cd mfnews-backend
    ```

2.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz basado en el siguiente ejemplo:

    ```env
    # Puerto de la aplicación
    PORT=3000

    # Conexión a Base de Datos (Para Docker)
    DATABASE_URL="postgresql://admin:contraseña123@db:5432/mfnews?schema=public"

    # JWT Secret (Cámbialo en producción)
    JWT_SECRET="super-secret-key"
    ```

---

## 🐳 Ejecución con Docker (Recomendado)

Levanta la base de datos y el backend automáticamente:

```bash
# Levantar servicios
docker-compose up -d --build

# Verificar logs
docker-compose logs -f backend

# Ejecutar Seed dentro del contenedor
docker-compose exec backend npx prisma db seed