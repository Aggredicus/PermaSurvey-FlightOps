import type { ExportArtifact, SurveyProject } from '../domain/types';
import { makeExportArtifact, slugify } from './exportUtils';

export function exportProjectJson(project: SurveyProject): ExportArtifact {
  return makeExportArtifact({
    id: 'project-json',
    label: 'Full project JSON',
    filename: `${slugify(project.site.name)}-project.json`,
    mime_type: 'application/json',
    content: JSON.stringify(project, null, 2),
  });
}
