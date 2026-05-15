import { useState } from 'react';
import type { EvidenceStatus, EvidenceType, Priority, SurveyProject } from '../domain/types';
import type { EvidenceRequirementDraft, ZoneDraft } from '../domain/zones';
import { formatTagsInput, parseTagsInput } from '../domain/zones';

interface ZonePlannerProps {
  project: SurveyProject;
  onEvidenceStatusChange: (zoneId: string, requirementId: string, status: EvidenceStatus) => void;
  onAddZone: (draft: ZoneDraft) => void;
  onUpdateZone: (zoneId: string, patch: Partial<ZoneDraft>) => void;
  onAddEvidenceRequirement: (zoneId: string, draft: EvidenceRequirementDraft) => void;
  onUpdateEvidenceRequirement: (
    zoneId: string,
    requirementId: string,
    patch: Partial<EvidenceRequirementDraft>,
  ) => void;
}

const priorities: Priority[] = ['low', 'medium', 'high'];
const evidenceStatuses: EvidenceStatus[] = ['missing', 'partial', 'complete', 'not_needed'];
const evidenceTypes: EvidenceType[] = [
  'overview_photo',
  'detail_photo',
  'slow_video',
  'transect_video',
  'orthomosaic_coverage',
  'slope_erosion_detail',
  'planting_corridor_view',
  'access_infrastructure_view',
  'client_beauty_shot',
  'custom_other',
];

const emptyZoneDraft: ZoneDraft = {
  name: '',
  description: '',
  priority: 'medium',
  tags: [],
};

const emptyRequirementDraft: EvidenceRequirementDraft = {
  label: '',
  evidence_type: 'overview_photo',
  status: 'missing',
};

function formatOptionLabel(value: string): string {
  return value.replace(/_/g, ' ');
}

export function ZonePlanner({
  project,
  onEvidenceStatusChange,
  onAddZone,
  onUpdateZone,
  onAddEvidenceRequirement,
  onUpdateEvidenceRequirement,
}: ZonePlannerProps) {
  const [newZone, setNewZone] = useState<ZoneDraft>(emptyZoneDraft);
  const [newZoneTags, setNewZoneTags] = useState('');
  const [newRequirementByZone, setNewRequirementByZone] = useState<Record<string, EvidenceRequirementDraft>>({});

  function handleAddZone() {
    onAddZone({ ...newZone, tags: parseTagsInput(newZoneTags) });
    setNewZone(emptyZoneDraft);
    setNewZoneTags('');
  }

  function requirementDraftFor(zoneId: string): EvidenceRequirementDraft {
    return newRequirementByZone[zoneId] ?? emptyRequirementDraft;
  }

  function updateRequirementDraft(zoneId: string, patch: Partial<EvidenceRequirementDraft>) {
    setNewRequirementByZone((current) => ({
      ...current,
      [zoneId]: { ...requirementDraftFor(zoneId), ...patch },
    }));
  }

  function handleAddRequirement(zoneId: string) {
    onAddEvidenceRequirement(zoneId, requirementDraftFor(zoneId));
    setNewRequirementByZone((current) => ({ ...current, [zoneId]: emptyRequirementDraft }));
  }

  return (
    <section className="panel" aria-labelledby="zone-planner-title">
      <p className="eyebrow">Design zones</p>
      <h2 id="zone-planner-title">Evidence requirements by zone</h2>

      <article className="zone-card add-zone-card">
        <h3>Add design zone</h3>
        <div className="form-grid compact-form">
          <label>
            Zone name
            <input value={newZone.name} onChange={(event) => setNewZone({ ...newZone, name: event.target.value })} />
          </label>
          <label>
            Priority
            <select
              value={newZone.priority}
              onChange={(event) => setNewZone({ ...newZone, priority: event.target.value as Priority })}
            >
              {priorities.map((priority) => <option value={priority} key={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="full-span">
            Description
            <textarea value={newZone.description} onChange={(event) => setNewZone({ ...newZone, description: event.target.value })} />
          </label>
          <label className="full-span">
            Tags, comma-separated
            <input value={newZoneTags} onChange={(event) => setNewZoneTags(event.target.value)} placeholder="wetland, runoff, orchard" />
          </label>
        </div>
        <button className="primary-button" type="button" onClick={handleAddZone}>
          Add zone
        </button>
      </article>

      <div className="card-list">
        {project.zones.map((zone) => {
          const requirementDraft = requirementDraftFor(zone.zone_id);
          return (
            <article className="zone-card" key={zone.zone_id}>
              <div className="card-header-row">
                <div>
                  <h3>{zone.name}</h3>
                  <p>{zone.description}</p>
                </div>
                <span className={`status-pill priority-${zone.priority}`}>{zone.priority}</span>
              </div>
              <div className="tag-row">
                {zone.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>

              <details className="edit-details">
                <summary>Edit zone</summary>
                <div className="form-grid compact-form">
                  <label>
                    Zone name
                    <input value={zone.name} onChange={(event) => onUpdateZone(zone.zone_id, { name: event.target.value })} />
                  </label>
                  <label>
                    Priority
                    <select
                      value={zone.priority}
                      onChange={(event) => onUpdateZone(zone.zone_id, { priority: event.target.value as Priority })}
                    >
                      {priorities.map((priority) => <option value={priority} key={priority}>{priority}</option>)}
                    </select>
                  </label>
                  <label className="full-span">
                    Description
                    <textarea value={zone.description} onChange={(event) => onUpdateZone(zone.zone_id, { description: event.target.value })} />
                  </label>
                  <label className="full-span">
                    Tags, comma-separated
                    <input
                      value={formatTagsInput(zone.tags)}
                      onChange={(event) => onUpdateZone(zone.zone_id, { tags: parseTagsInput(event.target.value) })}
                    />
                  </label>
                </div>
              </details>

              <div className="requirement-list">
                {zone.required_evidence.map((requirement) => (
                  <div className="requirement-row" key={requirement.requirement_id}>
                    <label>
                      Evidence label
                      <input
                        value={requirement.label}
                        onChange={(event) =>
                          onUpdateEvidenceRequirement(zone.zone_id, requirement.requirement_id, { label: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      Type
                      <select
                        value={requirement.evidence_type}
                        onChange={(event) =>
                          onUpdateEvidenceRequirement(zone.zone_id, requirement.requirement_id, {
                            evidence_type: event.target.value as EvidenceType,
                          })
                        }
                      >
                        {evidenceTypes.map((type) => <option value={type} key={type}>{formatOptionLabel(type)}</option>)}
                      </select>
                    </label>
                    <label>
                      Status
                      <select
                        value={requirement.status}
                        onChange={(event) =>
                          onEvidenceStatusChange(
                            zone.zone_id,
                            requirement.requirement_id,
                            event.target.value as EvidenceStatus,
                          )
                        }
                      >
                        {evidenceStatuses.map((status) => (
                          <option value={status} key={status}>{formatOptionLabel(status)}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                ))}
              </div>

              <details className="edit-details">
                <summary>Add evidence requirement</summary>
                <div className="form-grid compact-form">
                  <label>
                    Requirement label
                    <input
                      value={requirementDraft.label}
                      onChange={(event) => updateRequirementDraft(zone.zone_id, { label: event.target.value })}
                    />
                  </label>
                  <label>
                    Type
                    <select
                      value={requirementDraft.evidence_type}
                      onChange={(event) =>
                        updateRequirementDraft(zone.zone_id, { evidence_type: event.target.value as EvidenceType })
                      }
                    >
                      {evidenceTypes.map((type) => <option value={type} key={type}>{formatOptionLabel(type)}</option>)}
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      value={requirementDraft.status}
                      onChange={(event) =>
                        updateRequirementDraft(zone.zone_id, { status: event.target.value as EvidenceStatus })
                      }
                    >
                      {evidenceStatuses.map((status) => <option value={status} key={status}>{formatOptionLabel(status)}</option>)}
                    </select>
                  </label>
                </div>
                <button className="secondary-button" type="button" onClick={() => handleAddRequirement(zone.zone_id)}>
                  Add requirement
                </button>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
