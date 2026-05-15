import { describe, expect, it } from 'vitest';
import { sampleProject } from '../data/sampleProject';
import { getNextAction, getSurveyProgressPercent, toggleChecklistItem, updateMissionStatus } from './missions';

describe('mission helpers', () => {
  it('updates mission status', () => {
    const updated = updateMissionStatus(sampleProject, 'mission_overview', 'complete');
    expect(updated.missions.find((mission) => mission.mission_id === 'mission_overview')?.status).toBe('complete');
  });

  it('toggles checklist items', () => {
    const updated = toggleChecklistItem(sampleProject, 'mission_overview', 'preflight', 'pre_overview_battery');
    const item = updated.missions
      .find((mission) => mission.mission_id === 'mission_overview')
      ?.preflight_checklist.find((checklistItem) => checklistItem.checklist_item_id === 'pre_overview_battery');

    expect(item?.complete).toBe(true);
  });

  it('calculates survey progress', () => {
    expect(getSurveyProgressPercent(sampleProject)).toBe(0);
  });

  it('returns a next action', () => {
    expect(getNextAction(sampleProject)).toContain('Overview');
  });
});
