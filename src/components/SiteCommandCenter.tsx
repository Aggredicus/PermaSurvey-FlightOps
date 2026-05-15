import { getMissingEvidence, getEvidenceCompletionPercent } from '../domain/evidence';
import { getNextAction, getSurveyProgressPercent } from '../domain/missions';
import type { SurveyProject } from '../domain/types';

interface SiteCommandCenterProps {
  project: SurveyProject;
  onResetDemo: () => void;
}

export function SiteCommandCenter({ project, onResetDemo }: SiteCommandCenterProps) {
  const missingEvidence = getMissingEvidence(project);
  const missionProgress = getSurveyProgressPercent(project);
  const evidenceProgress = getEvidenceCompletionPercent(project);
  const nextAction = getNextAction(project);

  return (
    <section className="panel command-center" aria-labelledby="command-center-title">
      <div>
        <p className="eyebrow">Site Command Center</p>
        <h2 id="command-center-title">{project.site.name}</h2>
        <p>{project.site.survey_goal}</p>
      </div>

      <div className="metrics-grid" aria-label="Survey status metrics">
        <article className="metric-card">
          <span>{missionProgress}%</span>
          <p>Mission progress</p>
        </article>
        <article className="metric-card">
          <span>{evidenceProgress}%</span>
          <p>Evidence completion</p>
        </article>
        <article className="metric-card">
          <span>{missingEvidence.length}</span>
          <p>Missing / partial evidence</p>
        </article>
        <article className="metric-card">
          <span>{project.fleet.length}</span>
          <p>Drone in fleet-ready model</p>
        </article>
      </div>

      <div className="next-action">
        <p className="eyebrow">Next action</p>
        <strong>{nextAction}</strong>
      </div>

      <div className="safety-note">
        <strong>Safety boundary:</strong> manual flight planning and evidence verification only. No autonomous flight control, waypoint execution, collision avoidance, or swarm behavior.
      </div>

      <button className="secondary-button" type="button" onClick={onResetDemo}>
        Reset demo project
      </button>
    </section>
  );
}
