# Proyecto: [Nombre del Proyecto]

Este proyecto incluye un frontend desarrollado con `Vite` y un backend basado en `Firebase` (Functions, Firestore, Auth, Realtime Database, Hosting). Este documento describe cómo desplegar y ejecutar el proyecto localmente para propósitos de desarrollo.

## Requisitos Previos

1. **Sistema Operativo**:

   - Se recomienda utilizar una distribución de Linux o `Windows Subsystem for Linux (WSL)` (probado en Ubuntu).

2. **Herramientas Necesarias**:

   - [Node.js](https://nodejs.org/) (versión LTS recomendada)
   - [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
   - [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
   - [Git](https://git-scm.com/)
   - [Vite](https://vitejs.dev/) (ya incluido en los scripts del frontend)

3. **Opcional**:
   - `cross-env` (ya está en los scripts, instala automáticamente)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd [NOMBRE_DEL_REPOSITORIO]
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Configura Firebase CLI para tu entorno:
   - Inicia sesión en Firebase CLI:
     ```bash
     firebase login
     ```
   - Asocia el proyecto a tu entorno:
     ```bash
     firebase use --add
     ```

## Scripts Disponibles

El proyecto utiliza los siguientes scripts para facilitar el desarrollo:

### Ejecutar el Proyecto Localmente

- **Iniciar Frontend y Backend en paralelo**:

  ```bash
  npm run dev:frontend
  npm run dev:backend
  ```

  - `dev:frontend`: Inicia el frontend en modo desarrollo usando `Vite`.
  - `dev:backend`: Inicia los emuladores de Firebase con Firestore, Auth, Functions y Realtime Database, utilizando la configuración especificada en `backend/firebase.json`.

### Frontend (Ubicación: `/frontend`)

- **Construir para producción**:
  ```bash
  npm run build
  ```
- **Previsualizar el sitio construido**:
  ```bash
  npm run preview
  ```

### Backend (Ubicación: `/backend`)

- **Desplegar las Firebase Functions**:

  ```bash
  npm run deploy
  ```

  Este comando sube las funciones de Firebase al entorno de producción configurado en Firebase Hosting.

## Flujo de Trabajo para Despliegue

1. **Subir Cambios**:
   Cuando se sube un merge de todo el proyecto (frontend y backend), el frontend se despliega automáticamente a Firebase Hosting mediante el pipeline configurado.

2. **Desplegar Manualmente el Backend**:
   Para desplegar manualmente las Firebase Functions al entorno de producción:
   ```bash
   npm run deploy
   ```

## Configuración del Proyecto

### Firebase Emulator Configuración

El backend está configurado para usar emuladores durante el desarrollo. Puedes modificar las configuraciones en el archivo:

- `backend/firebase.json`

### Estructura del Proyecto

```plaintext
.
├── frontend/    # Código del frontend
│   ├── public/  # Archivos estáticos
│   ├── src/     # Código fuente del frontend
├── backend/     # Código del backend (Firebase Functions y emuladores)
│   ├── functions/ # Firebase Functions
│   ├── firebase.json # Configuración de Firebase
```
