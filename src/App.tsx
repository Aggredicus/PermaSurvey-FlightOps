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
import type { EvidenceStatus, MissionStatus, SurveyProject } from './domain/types';
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

  function handleSiteChange(sitePatch: Partial<SurveyProject['site']>) {
    const nextProject = recordProjectEvent(
      {
        ...project,
        updated_at: new Date().toISOString(),
        site: { ...project.site, ...sitePatch },
      },
      'correction_recorded',
      { changed_fields: Object.keys(sitePatch) },
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
        <SiteSetupForm site={project.site} onChange={handleSiteChange} />
        <ExportCenter project={project} />
      </section>

      <ZonePlanner project={project} onEvidenceStatusChange={handleEvidenceStatus} />

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
