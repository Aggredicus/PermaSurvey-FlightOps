import type {
  DesignZone,
  EvidenceRequirement,
  EvidenceStatus,
  EvidenceType,
  Priority,
  SurveyProject,
} from './types';
import { isZoneDesignReady } from './evidence';

export interface ZoneDraft {
  name: string;
  description: string;
  priority: Priority;
  tags: string[];
  notes?: string;
}

export interface EvidenceRequirementDraft {
  label: string;
  evidence_type: EvidenceType;
  status: EvidenceStatus;
  notes?: string;
}

export function createZoneFromDraft(draft: ZoneDraft): DesignZone {
  return {
    zone_id: crypto.randomUUID(),
    name: draft.name.trim() || 'New design zone',
    description: draft.description.trim(),
    priority: draft.priority,
    tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    required_evidence: [],
    completion_status: 'not_started',
    notes: draft.notes,
    related_mission_ids: [],
    related_evidence_ids: [],
  };
}

export function addDesignZone(project: SurveyProject, draft: ZoneDraft): SurveyProject {
  return {
    ...project,
    updated_at: new Date().toISOString(),
    zones: [...project.zones, createZoneFromDraft(draft)],
  };
}

export function updateDesignZone(project: SurveyProject, zoneId: string, patch: Partial<ZoneDraft>): SurveyProject {
  return {
    ...project,
    updated_at: new Date().toISOString(),
    zones: project.zones.map((zone) => {
      if (zone.zone_id !== zoneId) return zone;
      return {
        ...zone,
        ...patch,
        name: patch.name?.trim() || zone.name,
        description: patch.description ?? zone.description,
        tags: patch.tags ? patch.tags.map((tag) => tag.trim()).filter(Boolean) : zone.tags,
      };
    }),
  };
}

export function createEvidenceRequirementFromDraft(draft: EvidenceRequirementDraft): EvidenceRequirement {
  return {
    requirement_id: crypto.randomUUID(),
    evidence_type: draft.evidence_type,
    label: draft.label.trim() || 'New evidence requirement',
    status: draft.status,
    notes: draft.notes,
  };
}

export function addEvidenceRequirement(
  project: SurveyProject,
  zoneId: string,
  draft: EvidenceRequirementDraft,
): SurveyProject {
  return {
    ...project,
    updated_at: new Date().toISOString(),
    zones: project.zones.map((zone) => {
      if (zone.zone_id !== zoneId) return zone;
      return {
        ...zone,
        completion_status: 'in_progress',
        required_evidence: [...zone.required_evidence, createEvidenceRequirementFromDraft(draft)],
      };
    }),
  };
}

export function updateEvidenceRequirement(
  project: SurveyProject,
  zoneId: string,
  requirementId: string,
  patch: Partial<EvidenceRequirementDraft>,
): SurveyProject {
  return {
    ...project,
    updated_at: new Date().toISOString(),
    zones: project.zones.map((zone) => {
      if (zone.zone_id !== zoneId) return zone;

      const required_evidence = zone.required_evidence.map((requirement) => {
        if (requirement.requirement_id !== requirementId) return requirement;
        return {
          ...requirement,
          ...patch,
          label: patch.label?.trim() || requirement.label,
        };
      });

      const nextZone = { ...zone, required_evidence };
      return {
        ...nextZone,
        completion_status: isZoneDesignReady(nextZone) ? 'design_ready' : 'in_progress',
      };
    }),
  };
}

export function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTagsInput(tags: string[]): string {
  return tags.join(', ');
}
