import { describe, expect, it } from 'vitest';
import { sampleProject } from '../data/sampleProject';
import {
  addDesignZone,
  addEvidenceRequirement,
  formatTagsInput,
  parseTagsInput,
  updateDesignZone,
  updateEvidenceRequirement,
} from './zones';

describe('zone editing helpers', () => {
  it('adds a design zone while preserving fleet-ready project arrays', () => {
    const updated = addDesignZone(sampleProject, {
      name: 'Kitchen Garden',
      description: 'Near-house annual and herb production area.',
      priority: 'medium',
      tags: ['kitchen', 'annuals'],
    });

    const lastZone = updated.zones[updated.zones.length - 1];
    expect(updated.zones).toHaveLength(sampleProject.zones.length + 1);
    expect(lastZone?.name).toBe('Kitchen Garden');
    expect(Array.isArray(updated.fleet)).toBe(true);
    expect(Array.isArray(updated.operators)).toBe(true);
    expect(Array.isArray(updated.missions)).toBe(true);
  });

  it('updates a design zone', () => {
    const updated = updateDesignZone(sampleProject, 'zone_orchard_planning', {
      name: 'Food Forest Planning Area',
      priority: 'high',
      tags: ['food-forest', 'tree-guilds'],
    });

    const zone = updated.zones.find((item) => item.zone_id === 'zone_orchard_planning');
    expect(zone?.name).toBe('Food Forest Planning Area');
    expect(zone?.priority).toBe('high');
    expect(zone?.tags).toContain('tree-guilds');
  });

  it('adds an evidence requirement to a zone', () => {
    const updated = addEvidenceRequirement(sampleProject, 'zone_orchard_planning', {
      label: 'Access path context video',
      evidence_type: 'transect_video',
      status: 'missing',
    });

    const zone = updated.zones.find((item) => item.zone_id === 'zone_orchard_planning');
    const requirements = zone?.required_evidence ?? [];
    const lastRequirement = requirements[requirements.length - 1];
    expect(lastRequirement?.label).toBe('Access path context video');
  });

  it('updates an evidence requirement', () => {
    const updated = updateEvidenceRequirement(
      sampleProject,
      'zone_pond_wetland_edge',
      'req_pond_overview',
      { label: 'Updated pond overview', status: 'complete' },
    );

    const requirement = updated.zones
      .find((item) => item.zone_id === 'zone_pond_wetland_edge')
      ?.required_evidence.find((item) => item.requirement_id === 'req_pond_overview');

    expect(requirement?.label).toBe('Updated pond overview');
    expect(requirement?.status).toBe('complete');
  });

  it('parses and formats tag input', () => {
    expect(parseTagsInput(' wetland, runoff, , orchard ')).toEqual(['wetland', 'runoff', 'orchard']);
    expect(formatTagsInput(['wetland', 'runoff'])).toBe('wetland, runoff');
  });
});
