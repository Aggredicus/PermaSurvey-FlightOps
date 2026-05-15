import type { Site } from '../domain/types';

interface SiteSetupFormProps {
  site: Site;
  onChange: (sitePatch: Partial<Site>) => void;
}

export function SiteSetupForm({ site, onChange }: SiteSetupFormProps) {
  return (
    <section className="panel" aria-labelledby="site-setup-title">
      <p className="eyebrow">Site setup</p>
      <h2 id="site-setup-title">Survey project</h2>
      <div className="form-grid">
        <label>
          Site name
          <input value={site.name} onChange={(event) => onChange({ name: event.target.value })} />
        </label>
        <label>
          Client
          <input value={site.client_name} onChange={(event) => onChange({ client_name: event.target.value })} />
        </label>
        <label>
          Location label
          <input value={site.location_label} onChange={(event) => onChange({ location_label: event.target.value })} />
        </label>
        <label>
          Survey date
          <input type="date" value={site.survey_date} onChange={(event) => onChange({ survey_date: event.target.value })} />
        </label>
        <label className="full-span">
          Survey goal
          <textarea value={site.survey_goal} onChange={(event) => onChange({ survey_goal: event.target.value })} />
        </label>
        <label className="full-span">
          Field notes
          <textarea value={site.notes} onChange={(event) => onChange({ notes: event.target.value })} />
        </label>
        <label className="full-span">
          Hazards notes
          <textarea value={site.hazards_notes ?? ''} onChange={(event) => onChange({ hazards_notes: event.target.value })} />
        </label>
        <label className="full-span">
          No-fly / no-photo notes
          <textarea value={site.no_fly_no_photo_notes ?? ''} onChange={(event) => onChange({ no_fly_no_photo_notes: event.target.value })} />
        </label>
        <label className="full-span">
          Launch / landing notes
          <textarea value={site.launch_landing_notes ?? ''} onChange={(event) => onChange({ launch_landing_notes: event.target.value })} />
        </label>
      </div>
    </section>
  );
}
