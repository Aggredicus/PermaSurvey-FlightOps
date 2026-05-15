import { getEvidenceCompletionPercent, getMissingEvidence } from '../domain/evidence';
import { getSurveyProgressPercent } from '../domain/missions';
import type { ExportArtifact, SurveyProject } from '../domain/types';
import { makeExportArtifact, slugify } from './exportUtils';

export function exportMarkdownFieldReport(project: SurveyProject): ExportArtifact {
  const missing = getMissingEvidence(project);

  const lines = [
    `# ${project.site.name} Field Survey Report`,
    '',
    `Client: ${project.site.client_name}`,
    `Location: ${project.site.location_label}`,
    `Survey date: ${project.site.survey_date}`,
    '',
    `## Survey Goal`,
    '',
    project.site.survey_goal,
    '',
    `## Status`,
    '',
    `- Mission progress: ${getSurveyProgressPercent(project)}%`,
    `- Evidence completion: ${getEvidenceCompletionPercent(project)}%`,
    `- Missing or partial evidence items: ${missing.length}`,
    '',
    `## Safety Boundary`,
    '',
    'This report documents manual flight planning and field evidence verification only. It does not represent autonomous drone control, waypoint execution, collision avoidance, or swarm behavior.',
    '',
    `## Design Zones`,
    '',
    ...project.zones.map((zone) => `- ${zone.name} (${zone.priority}): ${zone.completion_status}`),
    '',
    `## Mission Queue`,
    '',
    ...project.missions.map((mission) => `- ${mission.name}: ${mission.status}`),
    '',
    `## Missing Evidence Before Departure`,
    '',
    ...(missing.length === 0
      ? ['All required evidence is complete or marked not needed.']
      : missing.map((item) => `- ${item.zone_name}: ${item.label} (${item.status})`)),
    '',
    `## Field Notes`,
    '',
    project.site.notes || 'No field notes recorded.',
  ];

  return makeExportArtifact({
    id: 'markdown-field-report',
    label: 'Markdown field report',
    filename: `${slugify(project.site.name)}-field-report.md`,
    mime_type: 'text/markdown',
    content: `${lines.join('\n')}\n`,
  });
}
