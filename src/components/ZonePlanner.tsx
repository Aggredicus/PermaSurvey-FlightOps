import type { EvidenceStatus, SurveyProject } from '../domain/types';

interface ZonePlannerProps {
  project: SurveyProject;
  onEvidenceStatusChange: (zoneId: string, requirementId: string, status: EvidenceStatus) => void;
}

const evidenceStatuses: EvidenceStatus[] = ['missing', 'partial', 'complete', 'not_needed'];

export function ZonePlanner({ project, onEvidenceStatusChange }: ZonePlannerProps) {
  return (
    <section className="panel" aria-labelledby="zone-planner-title">
      <p className="eyebrow">Design zones</p>
      <h2 id="zone-planner-title">Evidence requirements by zone</h2>
      <div className="card-list">
        {project.zones.map((zone) => (
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
            <div className="requirement-list">
              {zone.required_evidence.map((requirement) => (
                <label className="requirement-row" key={requirement.requirement_id}>
                  <span>
                    <strong>{requirement.label}</strong>
                    {requirement.notes ? <small>{requirement.notes}</small> : null}
                  </span>
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
                      <option value={status} key={status}>{status.replaceAll('_', ' ')}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
