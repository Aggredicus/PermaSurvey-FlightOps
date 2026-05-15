import type { ExportArtifact } from '../domain/types';

export function makeExportArtifact(input: {
  id: string;
  label: string;
  filename: string;
  mime_type: string;
  content: string;
}): ExportArtifact {
  return {
    ...input,
    created_at: new Date().toISOString(),
  };
}

export function downloadTextFile(artifact: ExportArtifact): void {
  const blob = new Blob([artifact.content], { type: artifact.mime_type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = artifact.filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
