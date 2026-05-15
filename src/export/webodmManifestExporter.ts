import type { ExportArtifact, SurveyProject, WebODMHandoffManifest } from '../domain/types';
import { makeExportArtifact, slugify } from './exportUtils';

export function buildWebODMHandoffManifest(project: SurveyProject): WebODMHandoffManifest {
  return {
    project_name: project.site.name,
    site_id: project.site.site_id,
    survey_date: project.site.survey_date,
    missions: project.missions.map((mission) => ({
      mission_id: mission.mission_id,
      name: mission.name,
      media_folder: `raw_media/${mission.mission_id}_${slugify(mission.name)}`,
      related_zones: mission.related_zone_ids,
    })),
    recommended_folder_structure: [
      'raw_media/',
      'flight_logs/',
      'chronicle_events/',
      'webodm/',
      'notes/',
      'exports/',
    ],
    notes: [
      'This manifest organizes media for later WebODM processing.',
      'PermaSurvey FlightOps v0.1 does not upload to WebODM automatically.',
      'Keep raw media immutable and copy exports into the exports folder.',
    ],
  };
}

export function exportWebODMManifest(project: SurveyProject): ExportArtifact {
  return makeExportArtifact({
    id: 'webodm-handoff-manifest',
    label: 'WebODM handoff manifest',
    filename: `${slugify(project.site.name)}-webodm-manifest.json`,
    mime_type: 'application/json',
    content: JSON.stringify(buildWebODMHandoffManifest(project), null, 2),
  });
}
