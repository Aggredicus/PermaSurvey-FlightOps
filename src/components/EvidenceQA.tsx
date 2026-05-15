import { getMissingEvidence } from '../domain/evidence';
import type { EvidenceStatus, SurveyProject } from '../domain/types';

interface EvidenceQAProps {
  project: SurveyProject;
  onEvidenceStatusChange: (zoneId: string, requirementId: string, status: EvidenceStatus) => void;
}

export function EvidenceQA({ project, onEvidenceStatusChange }: EvidenceQAProps) {
  const missingEvidence = getMissingEvidence(project);

  return (
    <section className="panel" aria-labelledby="evidence-qa-title">
      <p className="eyebrow">Evidence QA</p>
      <h2 id="evidence-qa-title">Do I have enough evidence to leave the site?</h2>
      {missingEvidence.length === 0 ? (
        <div className="success-box">All required evidence is complete or marked not needed.</div>
      ) : (
        <div className="warning-box">
          <strong>Missing evidence before departure</strong>
          <ul>
            {missingEvidence.map((item) => (
              <li key={`${item.zone_id}-${item.requirement_id}`}>
                <span>{item.zone_name}: {item.label}</span>
                <select
                  value={item.status}
                  onChange={(event) =>
                    onEvidenceStatusChange(
                      item.zone_id,
                      item.requirement_id,
                      event.target.value as EvidenceStatus,
                    )
                  }
                >
                  <option value="missing">missing</option>
                  <option value="partial">partial</option>
                  <option value="complete">complete</option>
                  <option value="not_needed">not needed</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
