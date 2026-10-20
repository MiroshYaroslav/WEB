# BMW Catalog frontend

React + Vite storefront for browsing BMW models and managing a customer's cart, favorites, and orders.

## Run locally

Install dependencies with `npm ci`, copy `.env.development.example` to `.env.local`, then run `npm run dev`.

The `.env.development.example` file contains both local and deployed API URLs. Uncomment only the backend you want to use. `.env.local` is ignored by Git, so your local selection stays on your computer.

## Deploy to Vercel

Import this repository as a Vite project. Use `npm run build` as the build command and `dist` as the output directory. Assign `auto-catalog.app` to the frontend project in Vercel. In Vercel Project Settings, set `VITE_API_URL=https://api.auto-catalog.app/api/v1` for **Production** and **Preview**.

Vite embeds `VITE_API_URL` into the JavaScript during the build, so redeploy after changing it. Never put secrets in `VITE_*` variables; their values are public in the built frontend. The build stops with a clear error if this variable is missing.

The backend API is served at `https://api.auto-catalog.app` and the frontend at `https://auto-catalog.app`. The backend must have a valid TLS certificate and accept HTTPS requests for the API URL above.

`vercel.json` rewrites client-side routes to `index.html`, so links such as `/product/<id>` also work when opened directly or refreshed.

The backend CORS configuration must allow `https://auto-catalog.app` (and any Vercel Preview origins used for testing). Because the frontend sends credentials for cookie-based auth, the backend must allow credentials and use compatible secure cookie settings.

## Project commands

- `npm run dev` starts the local Vite server.
- `npm run lint` checks source files with ESLint.
- `npm run build` creates the production bundle in `dist`.
- `npm run preview` serves the production bundle locally.
