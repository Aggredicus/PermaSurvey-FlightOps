# Docker QC Workflow

PermaSurvey FlightOps uses Docker to make local development, app preview, and agentic quality checks more repeatable.

The Docker workflow is intentionally small. It does not add a backend, database, object storage, WebODM service, or deployment pipeline. It only provides a consistent way to run and test the existing Vite + React + TypeScript app.

## Prerequisites

Install Docker Desktop or another Docker Engine environment that supports Docker Compose v2.

Confirm Docker works:

```bash
docker --version
docker compose version
```

## Run the development app

Start the Vite dev server inside Docker:

```bash
docker compose up app
```

Open:

```text
http://localhost:5173
```

The dev service binds Vite to `0.0.0.0` so the host browser can reach the containerized server.

## Run the full QA gate

Run the same validation sequence expected before a pull request:

```bash
docker compose run --rm qa
```

This runs:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

The Docker image installs dependencies with `npm ci`, using the committed `package-lock.json`.

## Run a production preview

Build the app and serve the generated static files through Nginx:

```bash
docker compose --profile preview up preview --build
```

Open:

```text
http://localhost:8080
```

Use this before merging UI changes when you want to verify the production build behaves differently from the Vite dev server.

## Agentic QC workflow

For AI-assisted work, use Docker as the default reproducible environment:

1. Inspect the issue and acceptance criteria.
2. Make the smallest focused code changes.
3. Run `docker compose run --rm qa`.
4. If UI behavior changed, run `docker compose up app` and manually inspect `http://localhost:5173`.
5. If build or asset behavior changed, run the production preview at `http://localhost:8080`.
6. Report exact commands and results in the pull request.

A pull request should not claim Docker validation passed unless the exact Docker command was run successfully.

## Troubleshooting

Stop services:

```bash
docker compose down
```

Stop services and remove the named dependency volume:

```bash
docker compose down -v
```

Rebuild without cache:

```bash
docker compose build --no-cache
```

Run the QA gate again after a clean rebuild:

```bash
docker compose run --rm qa
```

View app logs:

```bash
docker compose logs app
```

## Notes

The `app` service uses a named `node_modules` volume so the host bind mount does not overwrite container-installed dependencies.

The `CHOKIDAR_USEPOLLING=true` environment variable improves file watching reliability across Docker Desktop environments.

This workflow is not a deployment target. It is a local and agentic quality-control workflow.