import type { ExportArtifact, SurveyProject } from '../domain/types';
import { makeExportArtifact, slugify } from './exportUtils';

export function exportChronicleJson(project: SurveyProject): ExportArtifact {
  return makeExportArtifact({
    id: 'chronicle-json',
    label: 'Chronicle events JSON',
    filename: `${slugify(project.site.name)}-chronicle-events.json`,
    mime_type: 'application/json',
    content: JSON.stringify(project.chronicle_events, null, 2),
  });
}
