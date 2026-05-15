import type { Mission, MissionStatus, SurveyProject } from '../domain/types';

interface MissionQueueProps {
  project: SurveyProject;
  selectedMissionId?: string;
  onSelectMission: (missionId: string) => void;
  onMissionStatusChange: (missionId: string, status: MissionStatus) => void;
  onChecklistToggle: (missionId: string, phase: 'preflight' | 'postflight', checklistItemId: string) => void;
}

const missionStatuses: MissionStatus[] = ['planned', 'ready', 'in_progress', 'complete', 'needs_refly', 'skipped'];

export function MissionQueue({
  project,
  selectedMissionId,
  onSelectMission,
  onMissionStatusChange,
  onChecklistToggle,
}: MissionQueueProps) {
  const selectedMission = project.missions.find((mission) => mission.mission_id === selectedMissionId) ?? project.missions[0];

  return (
    <section className="panel" aria-labelledby="mission-queue-title">
      <p className="eyebrow">Manual mission queue</p>
      <h2 id="mission-queue-title">One-drone survey workflow</h2>
      <div className="mission-layout">
        <div className="mission-list" aria-label="Mission list">
          {project.missions.map((mission) => (
            <button
              type="button"
              className={`mission-list-item ${mission.mission_id === selectedMission?.mission_id ? 'selected' : ''}`}
              key={mission.mission_id}
              onClick={() => onSelectMission(mission.mission_id)}
            >
              <span>{mission.name}</span>
              <small>{mission.status.replaceAll('_', ' ')}</small>
            </button>
          ))}
        </div>

        {selectedMission ? (
          <FlightCard
            mission={selectedMission}
            project={project}
            onMissionStatusChange={onMissionStatusChange}
            onChecklistToggle={onChecklistToggle}
          />
        ) : null}
      </div>
    </section>
  );
}

interface FlightCardProps {
  mission: Mission;
  project: SurveyProject;
  onMissionStatusChange: (missionId: string, status: MissionStatus) => void;
  onChecklistToggle: (missionId: string, phase: 'preflight' | 'postflight', checklistItemId: string) => void;
}

function FlightCard({ mission, project, onMissionStatusChange, onChecklistToggle }: FlightCardProps) {
  const relatedZones = project.zones.filter((zone) => mission.related_zone_ids.includes(zone.zone_id));
  const drone = project.fleet.find((item) => item.drone_id === mission.assigned_drone_id);
  const operator = project.operators.find((item) => item.operator_id === mission.assigned_operator_id);

  return (
    <article className="flight-card" aria-label={`${mission.name} flight card`}>
      <div className="card-header-row">
        <div>
          <p className="eyebrow">Flight card</p>
          <h3>{mission.name}</h3>
        </div>
        <span className="status-pill">{mission.status.replaceAll('_', ' ')}</span>
      </div>
      <p>{mission.purpose}</p>
      <dl className="compact-details">
        <div><dt>Drone</dt><dd>{drone?.nickname ?? mission.assigned_drone_id}</dd></div>
        <div><dt>Operator</dt><dd>{operator?.name ?? mission.assigned_operator_id}</dd></div>
        <div><dt>Estimated time</dt><dd>{mission.estimated_duration_minutes} min</dd></div>
      </dl>

      <label>
        Mission status
        <select value={mission.status} onChange={(event) => onMissionStatusChange(mission.mission_id, event.target.value as MissionStatus)}>
          {missionStatuses.map((status) => (
            <option value={status} key={status}>{status.replaceAll('_', ' ')}</option>
          ))}
        </select>
      </label>

      <div>
        <h4>Related zones</h4>
        <div className="tag-row">
          {relatedZones.map((zone) => <span className="tag" key={zone.zone_id}>{zone.name}</span>)}
        </div>
      </div>

      <div>
        <h4>Capture goals</h4>
        <ul className="check-list readonly-list">
          {mission.capture_goals.map((goal) => <li key={goal}>{goal}</li>)}
        </ul>
      </div>

      <Checklist
        title="Preflight checklist"
        items={mission.preflight_checklist}
        onToggle={(itemId) => onChecklistToggle(mission.mission_id, 'preflight', itemId)}
      />
      <Checklist
        title="Postflight checklist"
        items={mission.postflight_checklist}
        onToggle={(itemId) => onChecklistToggle(mission.mission_id, 'postflight', itemId)}
      />

      {mission.notes ? <p className="subtle-note">{mission.notes}</p> : null}
    </article>
  );
}

interface ChecklistProps {
  title: string;
  items: Array<{ checklist_item_id: string; label: string; complete: boolean }>;
  onToggle: (itemId: string) => void;
}

function Checklist({ title, items, onToggle }: ChecklistProps) {
  return (
    <div>
      <h4>{title}</h4>
      <div className="check-list">
        {items.map((item) => (
          <label className="checkbox-row" key={item.checklist_item_id}>
            <input type="checkbox" checked={item.complete} onChange={() => onToggle(item.checklist_item_id)} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
