import type { DesignZone, EvidenceRequirement, EvidenceStatus, SurveyProject } from './types';

export interface MissingEvidenceItem {
  zone_id: string;
  zone_name: string;
  requirement_id: string;
  label: string;
  status: EvidenceStatus;
  notes?: string;
}

export function getMissingEvidence(project: SurveyProject): MissingEvidenceItem[] {
  return project.zones.flatMap((zone) =>
    zone.required_evidence
      .filter((requirement) => requirement.status === 'missing' || requirement.status === 'partial')
      .map((requirement) => ({
        zone_id: zone.zone_id,
        zone_name: zone.name,
        requirement_id: requirement.requirement_id,
        label: requirement.label,
        status: requirement.status,
        notes: requirement.notes,
      })),
  );
}

export function isZoneDesignReady(zone: DesignZone): boolean {
  return zone.required_evidence.every(
    (requirement) => requirement.status === 'complete' || requirement.status === 'not_needed',
  );
}

export function updateRequirementStatus(
  project: SurveyProject,
  zoneId: string,
  requirementId: string,
  status: EvidenceStatus,
): SurveyProject {
  const now = new Date().toISOString();
  return {
    ...project,
    updated_at: now,
    zones: project.zones.map((zone) => {
      if (zone.zone_id !== zoneId) return zone;

      const required_evidence: EvidenceRequirement[] = zone.required_evidence.map((requirement) =>
        requirement.requirement_id === requirementId ? { ...requirement, status } : requirement,
      );

      const nextZone = { ...zone, required_evidence };
      return {
        ...nextZone,
        completion_status: isZoneDesignReady(nextZone) ? 'design_ready' : 'in_progress',
      };
    }),
  };
}

export function getEvidenceCompletionPercent(project: SurveyProject): number {
  const requirements = project.zones.flatMap((zone) => zone.required_evidence);
  if (requirements.length === 0) return 0;

  const completeCount = requirements.filter(
    (requirement) => requirement.status === 'complete' || requirement.status === 'not_needed',
  ).length;

  return Math.round((completeCount / requirements.length) * 100);
}
