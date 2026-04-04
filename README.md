# Full‑Stack Portfolio (React + Express + PostgreSQL)

Portfolio web app with a **Vite + React** frontend and an **Express + PostgreSQL** API.  
The server automatically falls back to an **in-memory store** when PostgreSQL isn’t available (projects created in memory are lost on restart).

## Tech stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, TypeScript, Express, dotenv, cors
- **Database**: PostgreSQL (`pg`)

## Project structure

```text
/
  client/   # Vite + React app (UI)
  server/   # Express API (PostgreSQL + memory fallback)
```

## API overview

- `GET /api/profile` — returns profile data + projects list
- `POST /api/projects` — creates a project (`title`, `description`, `stack` required)

Default API base URL in the client: `http://localhost:4000`

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm
- (Optional) PostgreSQL 13+

### 1) Install dependencies

From the repo root:

```bash
npm install
```

Then install each workspace:

```bash
cd client && npm install
cd ../server && npm install
```

### 2) Configure environment (server)

Copy the example env file:

```bash
cd server
copy .env.example .env
```

Variables used:

- `PORT` (default `4000`)
- `DB_HOST` (default `localhost`)
- `DB_PORT` (default `5432`)
- `DB_USER` (default `postgres`)
- `DB_PASSWORD` (default `postgres`)
- `DB_NAME` (default `portfolio_db`)

### 3) Run in development

Start the API:

```bash
cd server
npm run dev
```

Start the client:

```bash
cd client
npm run dev
```

Open the app at the Vite URL (usually `http://localhost:5173`).

## Production build

Build server:

```bash
cd server
npm run build
npm start
```

Build client:

```bash
cd client
npm run build
npm run preview
```

## Notes

- **PostgreSQL optional**: if the server cannot connect, it will run in **memory mode** and still serve `/api/profile` and `/api/projects`.
- **CORS** is enabled on the server to allow the client to call the API in development.

## License

ISC

