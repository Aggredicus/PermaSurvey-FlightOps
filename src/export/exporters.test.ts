import { describe, expect, it } from 'vitest';
import { sampleProject } from '../data/sampleProject';
import { exportChronicleJson } from './chronicleJsonExporter';
import { exportMarkdownFieldReport } from './markdownFieldReportExporter';
import { exportMissingEvidenceReport } from './missingEvidenceExporter';
import { exportProjectJson } from './projectJsonExporter';
import { buildWebODMHandoffManifest, exportWebODMManifest } from './webodmManifestExporter';

describe('exporters', () => {
  it('exports full project JSON', () => {
    const artifact = exportProjectJson(sampleProject);
    const parsed = JSON.parse(artifact.content);
    expect(parsed.project_id).toBe(sampleProject.project_id);
    expect(Array.isArray(parsed.fleet)).toBe(true);
  });

  it('exports chronicle JSON', () => {
    const artifact = exportChronicleJson(sampleProject);
    expect(JSON.parse(artifact.content)[0].event_type).toBe('site_created');
  });

  it('exports markdown reports', () => {
    expect(exportMarkdownFieldReport(sampleProject).content).toContain('Field Survey Report');
    expect(exportMissingEvidenceReport(sampleProject).content).toContain('Missing Evidence Before Departure');
  });

  it('builds a WebODM handoff manifest', () => {
    const manifest = buildWebODMHandoffManifest(sampleProject);
    expect(manifest.recommended_folder_structure).toContain('raw_media/');
    expect(manifest.missions.length).toBe(sampleProject.missions.length);
    expect(exportWebODMManifest(sampleProject).filename).toContain('webodm-manifest');
  });
});
