import { exportChronicleJson } from '../export/chronicleJsonExporter';
import { downloadTextFile } from '../export/exportUtils';
import { exportMarkdownFieldReport } from '../export/markdownFieldReportExporter';
import { exportMissingEvidenceReport } from '../export/missingEvidenceExporter';
import { exportProjectJson } from '../export/projectJsonExporter';
import { exportWebODMManifest } from '../export/webodmManifestExporter';
import type { ExportArtifact, SurveyProject } from '../domain/types';

interface ExportCenterProps {
  project: SurveyProject;
  onExportGenerated: (artifact: ExportArtifact) => void;
}

export function ExportCenter({ project, onExportGenerated }: ExportCenterProps) {
  const exporters = [
    exportProjectJson,
    exportChronicleJson,
    exportMarkdownFieldReport,
    exportMissingEvidenceReport,
    exportWebODMManifest,
  ];

  function handleDownload(artifact: ExportArtifact) {
    downloadTextFile(artifact);
    onExportGenerated(artifact);
  }

  return (
    <section className="panel" aria-labelledby="export-center-title">
      <p className="eyebrow">Export center</p>
      <h2 id="export-center-title">Field packet downloads</h2>
      <p>Generate local files for project backup, chronicle history, field reporting, evidence QA, and WebODM handoff.</p>
      <div className="export-list">
        {exporters.map((exporter) => {
          const artifact = exporter(project);
          return (
            <button className="export-button" type="button" key={artifact.id} onClick={() => handleDownload(artifact)}>
              <span>{artifact.label}</span>
              <small>{artifact.filename}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}
