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

## Initial Scope

The first implementation should establish the v0.1 foundation:

- TypeScript frontend scaffold
- mobile-first field dashboard
- fleet-ready data model using `fleet[]`, `operators[]`, and `missions[]`
- site/project setup
- design zones
- one-drone manual mission queue
- flight cards and field checklists
- evidence QA / missing-evidence-before-departure list
- immutable chronicle events
- JSON/Markdown/WebODM handoff exports

## Safety Boundary

This repository is for field operations planning and evidence management. It must not implement or imply autonomous drone control, single-pilot multi-drone control, beyond-visual-line-of-sight operation, or swarm behavior.

## Status

Repository initialized. A feature request issue should guide the first implementation sprint.
