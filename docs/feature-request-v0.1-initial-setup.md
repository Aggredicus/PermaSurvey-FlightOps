# Feature Request: PermaSurvey FlightOps v0.1 Initial Setup

Set up the initial repository foundation for **PermaSurvey FlightOps**, a mobile-first, offline-capable field dashboard for rapid permaculture drone survey workflows.

The first build should support **one drone, one human operator, and manual flight workflows only**, while keeping the data model ready for future multi-drone and multi-operator planning.

Core promise:

> Leave every site with complete, organized, design-ready drone survey evidence.

## Product Scope

Build the first usable v0.1 foundation for a field intelligence dashboard that guides the designer through:

```text
Plan → Fly manually → Verify evidence → Capture gaps → Export → Process → Design
```

This issue is for the repository setup and initial app spine, not the full v1.0 implementation.

## Safety Boundary

This project is a **field operations manager**, not a drone controller.

Do not implement:

- Direct DJI SDK control
- Autonomous takeoff, landing, or waypoint execution
- Collision avoidance
- Swarm behavior
- Single-pilot multi-drone control
- Beyond-visual-line-of-sight assumptions

Treat all drone flight actions as manually performed by a human pilot.

Use language like:

- `manual flight`
- `survey mission card`
- `capture checklist`
- `field evidence verification`

Avoid language like:

- `autonomous control`
- `swarm control`
- `single-pilot multi-drone control`

## Initial Technical Direction

If the repo is empty or minimal, default to a simple local-first frontend stack:

- TypeScript
- React
- Vite or Next.js, whichever is simplest for this repo
- Mobile-first responsive UI
- Local-first/offline-first storage abstraction
- JSON import/export
- No backend required for v0.1
- Clean, typed, modular data model

Future Appwrite/WebODM/API integrations should remain roadmap items unless already present.

## Required v0.1 Features

### 1. Project/Site Setup

Allow the user to create a survey project with:

- Site name
- Client name
- Location label
- Survey date
- Survey goal
- Notes
- Optional hazards/no-fly/no-photo notes
- Optional launch/landing notes

### 2. Fleet-Ready One-Drone Data Model

Even though v0.1 is one-drone, the schema must be fleet-ready:

```ts
fleet: Drone[]
operators: Operator[]
missions: Mission[]
```

Avoid hardcoded singleton fields like `drone: Drone`.

### 3. Design Zones

Support design zones such as:

- Pond/wetland edge
- Garage slope runoff
- Orchard area
- Driveway/access
- House perimeter
- Tree line
- Erosion area
- Future garden area
- Client-priority area

Each zone should support:

- Name
- Description
- Priority
- Tags
- Required evidence types
- Completion/design-ready status
- Notes

### 4. Mission Queue

Create a one-drone manual mission queue with mission cards such as:

1. Establishing overview pass
2. Orthomosaic / mapping pass
3. Wetland or pond-edge detail pass
4. Slope / erosion detail pass
5. Tree canopy / orchard planning pass
6. Client-facing beauty shots
7. Gap-filling pass

Mission statuses:

```ts
"planned" | "ready" | "in_progress" | "complete" | "needs_refly" | "skipped"
```

### 5. Field Checklist / Flight Card

Each mission should have a field-friendly card with:

- Mission purpose
- Related zones
- Estimated duration
- Capture goals
- Preflight checklist
- Postflight checklist
- Notes
- Status controls

### 6. Evidence QA

Build the foundation for answering:

> Do I have enough evidence to leave the site?

Track evidence status by zone:

```ts
"missing" | "partial" | "complete" | "not_needed"
```

Generate a simple missing-evidence-before-departure list.

### 7. Immutable Chronicle Events

Add an append-only event model for major actions:

- `site_created`
- `zone_created`
- `mission_created`
- `mission_completed`
- `evidence_marked_complete`
- `evidence_marked_partial`
- `evidence_missing_added`
- `export_generated`
- `correction_recorded`
- `event_superseded`

Suggested event shape:

```ts
interface ChronicleEvent {
  event_id: string
  event_type: string
  created_at: string
  actor_id?: string
  site_id: string
  subject_type?: string
  subject_id?: string
  payload: Record<string, unknown>
  supersedes_event_id?: string
  correction_reason?: string
}
```

Do not silently mutate historical event records.

### 8. Export Foundation

Add basic exports for:

- Full project JSON
- Chronicle events JSON
- Markdown field report
- Missing evidence report
- WebODM handoff manifest

The WebODM handoff manifest can be JSON-only for now and should describe recommended folders and mission/media organization.

## Acceptance Criteria

- [ ] The repo has a working TypeScript frontend project.
- [ ] The app can run locally with documented commands.
- [ ] The UI is mobile-first and usable on desktop.
- [ ] A user can create or load a sample survey project.
- [ ] The data model includes `fleet[]`, `operators[]`, and `missions[]`.
- [ ] A user can define design zones and evidence requirements.
- [ ] A user can view and update a one-drone manual mission queue.
- [ ] A user can open a mission/flight card with preflight and postflight checklists.
- [ ] A user can mark evidence as missing, partial, complete, or not needed.
- [ ] The app generates a missing-evidence-before-departure list.
- [ ] The app records append-only chronicle events for major actions.
- [ ] The app can export full project JSON.
- [ ] The app can export chronicle events JSON.
- [ ] The app can export a Markdown field report.
- [ ] The app can export a WebODM handoff manifest.
- [ ] No direct drone control, autonomous flight, or swarm behavior is implemented.
- [ ] Basic typecheck/lint/test commands are documented and passing.

## Testing Expectations

Add or prepare tests for:

- Project creation
- Zone creation
- Mission creation/status changes
- Evidence status updates
- Missing evidence report generation
- Chronicle event creation
- JSON export/import readiness
- WebODM manifest export
- Fleet-ready schema preservation

## Roadmap Notes

Do not build these now, but keep the architecture ready for:

- GraphML exporter
- JSON-LD exporter
- GeoJSON exporter
- WebODM API upload/status bridge
- AI survey assistant
- Two-pilot / two-drone mission planning
- Compliance documentation generator
- Client-facing report export

## Recommended First Commit

Create the project scaffold, typed domain model, sample project data, local save/load abstraction, and a basic Site Command Center that displays survey progress and next action.

Suggested branch name:

```text
feature/1-initial-flightops-foundation
```
