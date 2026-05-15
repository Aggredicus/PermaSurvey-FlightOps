# PermaSurvey FlightOps

**Drone survey field intelligence for rapid permaculture design.**

PermaSurvey FlightOps is a mobile-first, local-first field operations dashboard for organizing drone-assisted permaculture site surveys.

The initial product direction is intentionally safety-first:

- one drone
- one human operator
- manual flight workflows only
- no autonomous flight control
- no swarm behavior
- no direct drone SDK control in the initial version

The core goal is to help a designer leave every site with complete, organized, WebODM-ready evidence.

```text
Plan → Fly manually → Verify evidence → Capture gaps → Export → Process → Design
```

## v0.1 Foundation

The first implementation establishes:

- Vite + React + TypeScript frontend scaffold
- mobile-first field dashboard
- fleet-ready data model using `fleet[]`, `operators[]`, and `missions[]`
- site/project setup form
- design zones and evidence requirements
- one-drone manual mission queue
- flight cards and field checklists
- evidence QA / missing-evidence-before-departure list
- immutable chronicle events for major actions
- local-first save/load through a storage abstraction
- JSON/Markdown/WebODM handoff exports
- Vitest coverage for core domain helpers and exporters

## Safety Boundary

This repository is for field operations planning and evidence management. It must not implement or imply autonomous drone control, single-pilot multi-drone control, beyond-visual-line-of-sight operation, or swarm behavior.

Use language like:

- manual flight
- survey mission card
- capture checklist
- field evidence verification
- WebODM handoff

Avoid language like:

- autonomous control
- swarm control
- single-pilot multi-drone control
- automatic drone operation

## Local Development

Install dependencies for local development:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run checks:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Reproducible CI Installs

The repository commits `package-lock.json` so automated validation can install the exact dependency tree with:

```bash
npm ci
```

GitHub Actions uses `npm ci`, then runs typecheck, lint, tests, and production build.

## Project Structure

```text
src/
  components/      Mobile-first dashboard sections
  data/            Sample survey project
  domain/          Typed project model and workflow helpers
  export/          JSON, Markdown, and WebODM manifest exporters
  storage/         Local project persistence abstraction
  test/            Vitest setup
```

## Issue Tracking

Initial setup is tracked in Issue #1:

```text
https://github.com/Aggredicus/PermaSurvey-FlightOps/issues/1
```

Quality patch tracking is in Issue #3:

```text
https://github.com/Aggredicus/PermaSurvey-FlightOps/issues/3
```

Reproducible CI hardening is tracked in Issue #4:

```text
https://github.com/Aggredicus/PermaSurvey-FlightOps/issues/4
```
