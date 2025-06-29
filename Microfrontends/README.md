# F1 Store - Microfrontends con Docker

Una aplicación moderna de catálogo de productos F1 construida con microfrontends usando React y Module Federation, completamente containerizada con Docker.

## 🏗️ Arquitectura

- **API Server** (Puerto 8080): Node.js/Express con datos de productos F1
- **Home Microfrontend** (Puerto 3000): Catálogo principal, carrito de compras
- **Product Microfrontend** (Puerto 3002): Detalles de productos

## 🚀 Inicio Rápido con Docker

### Prerrequisitos

- Docker
- Docker Compose

### Como correr el proyecto?

```bash
# Construir y ejecutar
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

## 🌍 URLs de la Aplicación

Una vez que Docker esté ejecutándose:

- **Home**: http://localhost:3000
- **Product Details**: http://localhost:3002
- **API**: http://localhost:8080

## 🔧 Configuración

Las variables de entorno se pueden modificar en `docker-compose.yml` para cada servicio.

## 🚚 Características

- ✅ Module Federation entre microfrontends
- ✅ Carrito compartido con localStorage
- ✅ API REST para productos F1
- ✅ Navegación entre microfrontends
- ✅ Estilos Tailwind compartidos
- ✅ Containerización completa con Docker
- ✅ Hot reload en desarrollo
