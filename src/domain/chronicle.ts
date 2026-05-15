import type { ChronicleEvent, ChronicleEventType, SurveyProject } from './types';

export function createChronicleEvent(input: {
  event_type: ChronicleEventType;
  site_id: string;
  actor_id?: string;
  subject_type?: string;
  subject_id?: string;
  payload?: Record<string, unknown>;
  supersedes_event_id?: string;
  correction_reason?: string;
}): ChronicleEvent {
  return {
    event_id: crypto.randomUUID(),
    event_type: input.event_type,
    created_at: new Date().toISOString(),
    actor_id: input.actor_id,
    site_id: input.site_id,
    subject_type: input.subject_type,
    subject_id: input.subject_id,
    payload: input.payload ?? {},
    supersedes_event_id: input.supersedes_event_id,
    correction_reason: input.correction_reason,
  };
}

export function appendChronicleEvent(project: SurveyProject, event: ChronicleEvent): SurveyProject {
  return {
    ...project,
    updated_at: event.created_at,
    chronicle_events: [...project.chronicle_events, event],
  };
}

export function recordProjectEvent(
  project: SurveyProject,
  event_type: ChronicleEventType,
  payload: Record<string, unknown>,
  subject?: { type: string; id: string },
): SurveyProject {
  return appendChronicleEvent(
    project,
    createChronicleEvent({
      event_type,
      site_id: project.site.site_id,
      actor_id: project.operators[0]?.operator_id,
      subject_type: subject?.type,
      subject_id: subject?.id,
      payload,
    }),
  );
}
