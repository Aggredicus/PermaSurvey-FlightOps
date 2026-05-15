import { useEffect, useMemo, useState } from 'react';
import { SiteCommandCenter } from './components/SiteCommandCenter';
import { SiteSetupForm } from './components/SiteSetupForm';
import { ZonePlanner } from './components/ZonePlanner';
import { MissionQueue } from './components/MissionQueue';
import { EvidenceQA } from './components/EvidenceQA';
import { ExportCenter } from './components/ExportCenter';
import { recordProjectEvent } from './domain/chronicle';
import { updateRequirementStatus } from './domain/evidence';
import { toggleChecklistItem, updateMissionStatus } from './domain/missions';
import type { EvidenceRequirementDraft, ZoneDraft } from './domain/zones';
import { addDesignZone, addEvidenceRequirement, updateDesignZone, updateEvidenceRequirement } from './domain/zones';
import type { EvidenceStatus, ExportArtifact, MissionStatus, Site, SurveyProject } from './domain/types';
import { loadProject, resetProject, saveProject } from './storage/projectStorage';

export default function App() {
  const [project, setProject] = useState<SurveyProject>(() => loadProject());
  const [selectedMissionId, setSelectedMissionId] = useState(project.missions[0]?.mission_id ?? '');

  useEffect(() => {
    saveProject(project);
  }, [project]);

  const selectedMission = useMemo(
    () => project.missions.find((mission) => mission.mission_id === selectedMissionId) ?? project.missions[0],
    [project.missions, selectedMissionId],
  );

  function updateProject(nextProject: SurveyProject) {
    setProject(nextProject);
  }

  function handleSiteSave(sitePatch: Partial<Site>) {
    const changedFields = Object.keys(sitePatch).filter(
      (key) => project.site[key as keyof Site] !== sitePatch[key as keyof Site],
    );

    if (changedFields.length === 0) return;

    const nextProject = recordProjectEvent(
      {
        ...project,
        updated_at: new Date().toISOString(),
        site: { ...project.site, ...sitePatch },
      },
      'site_updated',
      { changed_fields: changedFields },
      { type: 'site', id: project.site.site_id },
    );
    updateProject(nextProject);
  }

  function handleMissionStatus(missionId: string, status: MissionStatus) {
    const nextProject = recordProjectEvent(
      updateMissionStatus(project, missionId, status),
      status === 'complete' ? 'mission_completed' : 'mission_status_changed',
      { status },
      { type: 'mission', id: missionId },
    );
    updateProject(nextProject);
  }

  function handleChecklistToggle(missionId: string, phase: 'preflight' | 'postflight', checklistItemId: string) {
    updateProject(toggleChecklistItem(project, missionId, phase, checklistItemId));
  }

  function handleEvidenceStatus(zoneId: string, requirementId: string, status: EvidenceStatus) {
    const eventType =
      status === 'complete'
        ? 'evidence_marked_complete'
        : status === 'partial'
          ? 'evidence_marked_partial'
          : status === 'missing'
            ? 'evidence_missing_added'
            : 'evidence_status_changed';

    const nextProject = recordProjectEvent(
      updateRequirementStatus(project, zoneId, requirementId, status),
      eventType,
      { status, requirement_id: requirementId },
      { type: 'design_zone', id: zoneId },
    );
    updateProject(nextProject);
  }

  function handleAddZone(draft: ZoneDraft) {
    const nextProject = recordProjectEvent(
      addDesignZone(project, draft),
      'zone_created',
      { name: draft.name, priority: draft.priority },
      { type: 'site', id: project.site.site_id },
    );
    updateProject(nextProject);
  }

  function handleUpdateZone(zoneId: string, patch: Partial<ZoneDraft>) {
    const nextProject = recordProjectEvent(
      updateDesignZone(project, zoneId, patch),
      'zone_updated',
      { changed_fields: Object.keys(patch) },
      { type: 'design_zone', id: zoneId },
    );
    updateProject(nextProject);
  }

  function handleAddEvidenceRequirement(zoneId: string, draft: EvidenceRequirementDraft) {
    const nextProject = recordProjectEvent(
      addEvidenceRequirement(project, zoneId, draft),
      'evidence_requirement_created',
      { label: draft.label, evidence_type: draft.evidence_type, status: draft.status },
      { type: 'design_zone', id: zoneId },
    );
    updateProject(nextProject);
  }

  function handleUpdateEvidenceRequirement(
    zoneId: string,
    requirementId: string,
    patch: Partial<EvidenceRequirementDraft>,
  ) {
    const nextProject = recordProjectEvent(
      updateEvidenceRequirement(project, zoneId, requirementId, patch),
      'evidence_requirement_updated',
      { requirement_id: requirementId, changed_fields: Object.keys(patch) },
      { type: 'design_zone', id: zoneId },
    );
    updateProject(nextProject);
  }

  function handleExportGenerated(artifact: ExportArtifact) {
    const nextProject = recordProjectEvent(
      project,
      'export_generated',
      {
        artifact_id: artifact.id,
        label: artifact.label,
        filename: artifact.filename,
        mime_type: artifact.mime_type,
      },
      { type: 'export_artifact', id: artifact.id },
    );
    updateProject(nextProject);
  }

  function handleResetDemo() {
    const nextProject = resetProject();
    setProject(nextProject);
    setSelectedMissionId(nextProject.missions[0]?.mission_id ?? '');
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">PermaSurvey FlightOps v0.1</p>
        <h1>Drone survey field intelligence for rapid permaculture design.</h1>
        <p>
          Plan manual flights, verify field evidence, and export a WebODM-ready packet without
          adding autonomous drone control or swarm behavior.
        </p>
      </header>

      <SiteCommandCenter project={project} onResetDemo={handleResetDemo} />

      <section className="grid two-column">
        <SiteSetupForm site={project.site} onSave={handleSiteSave} />
        <ExportCenter project={project} onExportGenerated={handleExportGenerated} />
      </section>

      <ZonePlanner
        project={project}
        onEvidenceStatusChange={handleEvidenceStatus}
        onAddZone={handleAddZone}
        onUpdateZone={handleUpdateZone}
        onAddEvidenceRequirement={handleAddEvidenceRequirement}
        onUpdateEvidenceRequirement={handleUpdateEvidenceRequirement}
      />

      <MissionQueue
        project={project}
        selectedMissionId={selectedMission?.mission_id}
        onSelectMission={setSelectedMissionId}
        onMissionStatusChange={handleMissionStatus}
        onChecklistToggle={handleChecklistToggle}
      />

      <EvidenceQA project={project} onEvidenceStatusChange={handleEvidenceStatus} />
    </main>
  );
}
