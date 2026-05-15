import { describe, expect, it } from 'vitest';
import { sampleProject } from '../data/sampleProject';
import { getEvidenceCompletionPercent, getMissingEvidence, updateRequirementStatus } from './evidence';

describe('evidence helpers', () => {
  it('finds missing and partial evidence', () => {
    const missing = getMissingEvidence(sampleProject);

    expect(missing.length).toBeGreaterThan(0);
    expect(missing.some((item) => item.status === 'partial')).toBe(true);
    expect(missing.some((item) => item.status === 'missing')).toBe(true);
  });

  it('updates a requirement status', () => {
    const updated = updateRequirementStatus(
      sampleProject,
      'zone_garage_slope_runoff',
      'req_slope_erosion',
      'complete',
    );

    const requirement = updated.zones
      .find((zone) => zone.zone_id === 'zone_garage_slope_runoff')
      ?.required_evidence.find((item) => item.requirement_id === 'req_slope_erosion');

    expect(requirement?.status).toBe('complete');
  });

  it('calculates an evidence completion percentage', () => {
    expect(getEvidenceCompletionPercent(sampleProject)).toBeGreaterThanOrEqual(0);
    expect(getEvidenceCompletionPercent(sampleProject)).toBeLessThanOrEqual(100);
  });
});
