import { getMissingEvidence } from '../domain/evidence';
import type { ExportArtifact, SurveyProject } from '../domain/types';
import { makeExportArtifact, slugify } from './exportUtils';

export function exportMissingEvidenceReport(project: SurveyProject): ExportArtifact {
  const missing = getMissingEvidence(project);
  const lines = [
    `# Missing Evidence Before Departure`,
    '',
    `Site: ${project.site.name}`,
    `Survey date: ${project.site.survey_date}`,
    '',
  ];

  if (missing.length === 0) {
    lines.push('All required evidence is complete or marked not needed.');
  } else {
    for (const item of missing) {
      lines.push(`- ${item.zone_name}: ${item.label} (${item.status})${item.notes ? ` — ${item.notes}` : ''}`);
    }
  }

  return makeExportArtifact({
    id: 'missing-evidence-report',
    label: 'Missing evidence report',
    filename: `${slugify(project.site.name)}-missing-evidence.md`,
    mime_type: 'text/markdown',
    content: `${lines.join('\n')}\n`,
  });
}
