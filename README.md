# Market Mascotas — Ahora con MongoDB (NoSQL)

Este proyecto pasó de manejar los datos solo en memoria (React `useState`) a
persistirlos en **MongoDB**, una base de datos **no relacional / no
estructurada** (orientada a documentos, sin tablas ni claves foráneas).

## Estructura

- `src/` → Frontend (React + Vite + TypeScript), sin cambios de diseño.
- `server/` → Backend nuevo (Node + Express + Mongoose) que se conecta a tu
  base MongoDB y expone una API REST (`/api/products`, `/api/categories`).

Los productos y categorías ahora se guardan como **documentos** en dos
colecciones de MongoDB (`products` y `categories`), no como filas de tablas
relacionadas por llaves foráneas.

## Cómo conectar tu propia base MongoDB

1. Entra a la carpeta `server/` y copia el archivo de ejemplo:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Abre `server/.env` y reemplaza `MONGODB_URI` con el connection string de
   **tu** base de datos (Atlas o local), por ejemplo:
   ```
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/market_mascotas?retryWrites=true&w=majority
   ```
   > Nunca subas el archivo `.env` a GitHub (ya está en `server/.gitignore`).

## Cómo correr el proyecto

1. Instala dependencias del backend:
   ```bash
   cd server
   npm install
   cd ..
   ```
2. Instala dependencias del frontend (raíz del proyecto):
   ```bash
   npm install
   ```
3. Levanta frontend y backend juntos:
   ```bash
   npm run dev:all
   ```
   Esto corre Vite (puerto 5173) y el servidor Express (puerto 5000) al
   mismo tiempo. El frontend llama a `/api/...`, y Vite reenvía esas
   peticiones al backend automáticamente (ver `vite.config.ts`).

   También puedes correrlos por separado en dos terminales:
   ```bash
   npm run server   # backend en http://localhost:5000
   npm run dev      # frontend en http://localhost:5173
   ```

## Endpoints disponibles

| Método | Ruta                  | Descripción              |
|--------|-----------------------|---------------------------|
| GET    | /api/products          | Listar productos          |
| POST   | /api/products          | Crear producto             |
| PUT    | /api/products/:id       | Editar producto            |
| DELETE | /api/products/:id       | Eliminar producto          |
| GET    | /api/categories         | Listar categorías          |
| POST   | /api/categories         | Crear categoría            |
| DELETE | /api/categories/:id     | Eliminar categoría         |

---
