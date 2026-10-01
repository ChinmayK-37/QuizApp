# Deploy QuizMe on Render

Deploy this repository as three Render resources in the same region:

1. **Render Postgres** database.
2. **Backend Web Service**, built with `backend/quizapp/Dockerfile`.
3. **Frontend Static Site** (recommended), or the supplied Docker frontend.

## 1. Create PostgreSQL

Create a Render Postgres instance. Keep it in the same Render region as the backend and use its **internal** connection details rather than `localhost`.

## 2. Deploy the backend with Docker

Create a **Web Service**:

| Field | Value |
|---|---|
| Root directory | `backend/quizapp` |
| Runtime | Docker |
| Dockerfile path | `./Dockerfile` |
| Health check path | `/` |

Set these environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://USER:PASSWORD@HOST:5432/DATABASE
SPRING_DATASOURCE_USERNAME=USER
SPRING_DATASOURCE_PASSWORD=PASSWORD
GOOGLE_API_KEY=your-secret-key
CORS_ALLOWED_ORIGINS=https://your-frontend.onrender.com
```

Render supplies `PORT`; the application maps it through `server.port=${PORT:8080}` and binds to `0.0.0.0`.

## 3. Deploy the frontend — recommended static site

Create a **Static Site**:

| Field | Value |
|---|---|
| Root directory | `frontend` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |

Set this build-time environment variable:

```text
VITE_API_BASE_URL=https://your-backend.onrender.com
```

Add a rewrite rule for React Router:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

After deployment, set the backend `CORS_ALLOWED_ORIGINS` to the exact frontend HTTPS URL and redeploy it.

## Docker frontend alternative

`frontend/Dockerfile` builds the Vite app and serves it with Nginx. To deploy it as a Render Web Service, provide the backend URL as Docker build argument `VITE_API_BASE_URL` and use port `80`. A Render Static Site is usually the better option for this SPA.

## Run the full stack locally with Docker

From the repository root, set `GOOGLE_API_KEY` in your shell or root `.env` file, then run:

```powershell
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- PostgreSQL remains inside the Compose network.

To stop, run `docker compose down`. Add `-v` only if you intentionally want to delete the local PostgreSQL volume.

## Production cautions

- Do not return correct answers from the player questions endpoint.
- Add real authentication and server-issued user IDs.
- Replace `spring.jpa.hibernate.ddl-auto=update` with database migrations.
