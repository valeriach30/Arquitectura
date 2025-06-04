# Implementación de Pruebas Unitarias

Este proyecto contiene dos microservicios REST desarrollados en Python con Flask, encargados de gestionar usuarios y notificaciones respectivamente. El objetivo principal es validar su correcto funcionamiento mediante pruebas unitarias específicas que se ejecutan directamente sobre las APIs Flask.

# 📦 Microservicios

## 1. Usuarios (Python)

**Función:**

- Gestionar usuarios.

**API REST:**

- `GET /users`: Obtiene todos los usuarios.
- `GET /users/<id>`: Obtiene un usuario por ID.
- `POST /users`: Crea un nuevo usuario.
- `PUT /users/<id>`: Actualiza un usuario existente.
- `DELETE /users/<id>`: Elimina un usuario.
- `GET /users/<id>/is_organizer`: Verifica si un usuario es organizador.

## 2. Notificaciones (Python):

**Función:**

- Gestionar notificaciones.

**API REST:**

- `GET /notifications`: Obtiene todas las notificaciones.
- `GET /notifications/<id>`: Obtiene una notificación por ID.
- `POST /notifications`: Crea una nueva notificación (verifica usuarios).
- `PUT /notifications/<id>`: Actualiza una notificación existente.
- `DELETE /notifications/<id>`: Elimina una notificación.

# 🚀 Ejecutar Microservicios

1. Clonar el Repositorio:

```
git clone https://github.com/valeriach30/Arquitectura.git
cd 'Tarea 4'
```

2. Construir los Contenedores:

```
docker compose build
```

3. Iniciar los servicios

```
docker compose up -d
```

4. Verificar que los contenedores están corriendo

```
docker ps
```

5. Acceder a las APIS

- Usuarios: http://localhost:5003/apidocs
- Notificaciones: http://localhost:5004/apidocs

# 🧪 Ejecutar Pruebas de Unidad

A continuación se listan los pasos para ejecutar las pruebas unitarias de cada microservicio:

1. Activar el entorno virtual de Python:

```
source .venv/bin/activate
```

2. Para ejecutar las pruebas de Notificaciones:

```
cd notificaciones
PYTHONPATH=$(pwd) pytest tests/test_notifications_api.py
```

3. Para ejecutar las pruebas de Usuarios:

```
cd usuarios
PYTHONPATH=$(pwd) pytest tests/test_users_api.py
```

# ✅ Cómo verificar que las pruebas funcionan correctamente

1. Abrir el archivo users.json (o el archivo equivalente en notificaciones).
2. Vaciar el contenido y dejarlo como un arreglo vacío: [].
3. Ejecutar nuevamente las pruebas.
4. Observar cómo las pruebas crean y agregan usuarios o notificaciones automáticamente, confirmando que la API funciona según lo esperado.
