import type { ChecklistItem, MissionStatus, SurveyProject } from './types';

export function updateMissionStatus(
  project: SurveyProject,
  missionId: string,
  status: MissionStatus,
): SurveyProject {
  return {
    ...project,
    updated_at: new Date().toISOString(),
    missions: project.missions.map((mission) =>
      mission.mission_id === missionId ? { ...mission, status } : mission,
    ),
  };
}

export function toggleChecklistItem(
  project: SurveyProject,
  missionId: string,
  phase: 'preflight' | 'postflight',
  checklistItemId: string,
): SurveyProject {
  const checklistKey = phase === 'preflight' ? 'preflight_checklist' : 'postflight_checklist';

  return {
    ...project,
    updated_at: new Date().toISOString(),
    missions: project.missions.map((mission) => {
      if (mission.mission_id !== missionId) return mission;

      const nextChecklist: ChecklistItem[] = mission[checklistKey].map((item) =>
        item.checklist_item_id === checklistItemId ? { ...item, complete: !item.complete } : item,
      );

      return { ...mission, [checklistKey]: nextChecklist };
    }),
  };
}

export function getSurveyProgressPercent(project: SurveyProject): number {
  if (project.missions.length === 0) return 0;
  const completeCount = project.missions.filter((mission) => mission.status === 'complete').length;
  return Math.round((completeCount / project.missions.length) * 100);
}

export function getNextAction(project: SurveyProject): string {
  const needsRefly = project.missions.find((mission) => mission.status === 'needs_refly');
  if (needsRefly) return `Review refly need: ${needsRefly.name}`;

  const ready = project.missions.find((mission) => mission.status === 'ready');
  if (ready) return `Open flight card: ${ready.name}`;

  const planned = project.missions.find((mission) => mission.status === 'planned');
  if (planned) return `Prepare mission: ${planned.name}`;

  const inProgress = project.missions.find((mission) => mission.status === 'in_progress');
  if (inProgress) return `Complete current mission: ${inProgress.name}`;

  return 'Run Evidence QA and export the field packet.';
}
