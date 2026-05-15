import { sampleProject } from '../data/sampleProject';
import type { SurveyProject } from '../domain/types';

const STORAGE_KEY = 'permasurvey-flightops-current-project';

export function loadProject(): SurveyProject {
  if (typeof window === 'undefined') return sampleProject;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return sampleProject;

  try {
    return JSON.parse(raw) as SurveyProject;
  } catch {
    return sampleProject;
  }
}

export function saveProject(project: SurveyProject): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project, null, 2));
}

export function resetProject(): SurveyProject {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return sampleProject;
}

export function importProjectJson(rawJson: string): SurveyProject {
  const project = JSON.parse(rawJson) as SurveyProject;

  if (!project.project_id || !project.site || !Array.isArray(project.fleet) || !Array.isArray(project.missions)) {
    throw new Error('Invalid PermaSurvey project JSON.');
  }

  saveProject(project);
  return project;
}
