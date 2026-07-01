<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
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
<<<<<<< HEAD
=======

=======
>>>>>>> origin/main
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
>>>>>>> d2f90cedf1ae15b6a4be2def582eb7f514bb1e43
