import { useEffect, useState } from 'react';
import type { Site } from '../domain/types';

interface SiteSetupFormProps {
  site: Site;
  onSave: (sitePatch: Partial<Site>) => void;
}

export function SiteSetupForm({ site, onSave }: SiteSetupFormProps) {
  const [draft, setDraft] = useState<Site>(site);

  useEffect(() => {
    setDraft(site);
  }, [site]);

  function updateDraft(sitePatch: Partial<Site>) {
    setDraft((current) => ({ ...current, ...sitePatch }));
  }

  return (
    <section className="panel" aria-labelledby="site-setup-title">
      <p className="eyebrow">Site setup</p>
      <h2 id="site-setup-title">Survey project</h2>
      <p className="subtle-note">Edits are drafted locally and recorded as one chronicle event when saved.</p>
      <div className="form-grid">
        <label>
          Site name
          <input value={draft.name} onChange={(event) => updateDraft({ name: event.target.value })} />
        </label>
        <label>
          Client
          <input value={draft.client_name} onChange={(event) => updateDraft({ client_name: event.target.value })} />
        </label>
        <label>
          Location label
          <input value={draft.location_label} onChange={(event) => updateDraft({ location_label: event.target.value })} />
        </label>
        <label>
          Survey date
          <input type="date" value={draft.survey_date} onChange={(event) => updateDraft({ survey_date: event.target.value })} />
        </label>
        <label className="full-span">
          Survey goal
          <textarea value={draft.survey_goal} onChange={(event) => updateDraft({ survey_goal: event.target.value })} />
        </label>
        <label className="full-span">
          Field notes
          <textarea value={draft.notes} onChange={(event) => updateDraft({ notes: event.target.value })} />
        </label>
        <label className="full-span">
          Hazards notes
          <textarea value={draft.hazards_notes ?? ''} onChange={(event) => updateDraft({ hazards_notes: event.target.value })} />
        </label>
        <label className="full-span">
          No-fly / no-photo notes
          <textarea value={draft.no_fly_no_photo_notes ?? ''} onChange={(event) => updateDraft({ no_fly_no_photo_notes: event.target.value })} />
        </label>
        <label className="full-span">
          Launch / landing notes
          <textarea value={draft.launch_landing_notes ?? ''} onChange={(event) => updateDraft({ launch_landing_notes: event.target.value })} />
        </label>
      </div>
      <div className="button-row">
        <button className="primary-button" type="button" onClick={() => onSave(draft)}>
          Save site changes
        </button>
        <button className="secondary-button" type="button" onClick={() => setDraft(site)}>
          Revert draft
        </button>
      </div>
    </section>
  );
}
