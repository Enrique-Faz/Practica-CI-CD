# 🐉 D&D Board - Guía de Despliegue Local

Esta guía detalla los pasos necesarios para levantar el entorno de desarrollo del backend de **D&D Board** en una máquina local.

---

## 🛠 Tecnologías Necesarias

Antes de empezar, asegúrate de tener instalados los siguientes componentes:

1.  **Docker & Docker Compose**:
    * En Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop/).
    * En Linux: Docker Engine y el plugin `docker-compose-v2`.
2.  **Git**: Para clonar el repositorio.
3.  **Make** (Opcional): Para utilizar los atajos de comandos. Viene preinstalado en Linux y Mac. En Windows se puede usar vía WSL o instalando `make` por Chocolatey/Winget.

---

## 📁 Estructura del Proyecto

Los comandos deben ejecutarse desde la **raíz del repositorio**, donde se encuentra el archivo `Makefile`. La ruta del backend es: `backend/dnd-board/`.

---

## 🚀 Opción A: Instalación Rápida (Recomendado)

Si tienes `make` instalado, el proceso está automatizado para gestionar permisos, redes y base de datos:

1.  **Instalación inicial**:
    ```bash
    make install
    ```
    *Este comando crea el `.env`, construye las imágenes, levanta los contenedores y genera las claves de Laravel.*

2.  **Verificar que todo funciona**:
    ```bash
    make logs
    ```
    *Espera a ver el mensaje: `NOTICE: ready to handle connections`.*

3.  **Reiniciar todo desde cero** (Borra base de datos y recrea):
    ```bash
    make reset
    ```

---

## 🔧 Opción B: Instalación Manual

Si no dispones de `make`, ejecuta los siguientes comandos en orden desde la raíz del proyecto:

1.  **Preparar el archivo de entorno**:
    ```bash
    cp backend/dnd-board/.env.example backend/dnd-board/.env
    ```

2.  **Construir y levantar los contenedores**:
    ```bash
    docker compose -f backend/dnd-board/docker-compose.yml --project-directory backend/dnd-board up -d --build
    ```

3.  **Instalar dependencias de PHP (Composer)**:
    *(Normalmente incluido en el arranque del contenedor, pero si es necesario forzar:)*
    ```bash
    docker compose -f backend/dnd-board/docker-compose.yml --project-directory backend/dnd-board exec app composer install
    ```

4.  **Generar la clave de aplicación**:
    ```bash
    docker compose -f backend/dnd-board/docker-compose.yml --project-directory backend/dnd-board exec app php artisan key:generate
    ```

5.  **Ejecutar migraciones de la base de datos**:
    ```bash
    docker compose -f backend/dnd-board/docker-compose.yml --project-directory backend/dnd-board exec app php artisan migrate
    ```

---

## 🌐 Acceso a la Aplicación

Una vez levantado el sistema, el backend estará disponible en:

* **URL**: `http://localhost:8000`
* **API Endpoint**: `http://localhost:8000/api`

---

## 📝 Comandos Útiles de Mantenimiento

| Acción | Comando con Make | Comando Manual (Docker) |
| :--- | :--- | :--- |
| Ver Logs | `make logs` | `docker compose ... logs -f app` |
| Entrar al Terminal | `make shell` | `docker compose ... exec app bash` |
| Apagar sistema | `make down` | `docker compose ... down` |
| Limpiar todo | `make fclean` | `docker compose ... down -v --rmi all` |

---

## ⚠️ Solución de Problemas Comunes

* **Puerto 8000 ocupado**: Asegúrate de que no tienes otro servicio (u otra instancia de Laravel) corriendo en el puerto 8000.
* **Permisos en Linux**: Si obtienes errores de "Permission Denied" en las carpetas `storage` o `bootstrap/cache`, ejecuta:
  `sudo chown -R $USER:$USER .`
* **Error de conexión a la DB**: La primera vez que MySQL arranca puede tardar unos segundos más. El sistema está configurado para reintentar la conexión automáticamente.