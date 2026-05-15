export type Priority = 'low' | 'medium' | 'high';

export type MissionStatus =
  | 'planned'
  | 'ready'
  | 'in_progress'
  | 'complete'
  | 'needs_refly'
  | 'skipped';

export type EvidenceStatus = 'missing' | 'partial' | 'complete' | 'not_needed';

export type EvidenceType =
  | 'overview_photo'
  | 'detail_photo'
  | 'slow_video'
  | 'transect_video'
  | 'orthomosaic_coverage'
  | 'slope_erosion_detail'
  | 'planting_corridor_view'
  | 'access_infrastructure_view'
  | 'client_beauty_shot'
  | 'custom_other';

export type ChronicleEventType =
  | 'site_created'
  | 'site_updated'
  | 'zone_created'
  | 'zone_updated'
  | 'mission_created'
  | 'mission_started'
  | 'mission_completed'
  | 'mission_status_changed'
  | 'evidence_requirement_created'
  | 'evidence_requirement_updated'
  | 'evidence_marked_complete'
  | 'evidence_marked_partial'
  | 'evidence_missing_added'
  | 'evidence_status_changed'
  | 'export_generated'
  | 'correction_recorded'
  | 'event_superseded';

export interface Site {
  site_id: string;
  name: string;
  client_name: string;
  location_label: string;
  survey_date: string;
  survey_goal: string;
  notes: string;
  hazards_notes?: string;
  no_fly_no_photo_notes?: string;
  launch_landing_notes?: string;
}

export interface Drone {
  drone_id: string;
  nickname: string;
  model: string;
  role: string;
  battery_notes?: string;
  storage_media_notes?: string;
  lens_check_status?: 'unchecked' | 'clean' | 'needs_cleaning';
  field_condition_notes?: string;
}

export interface Operator {
  operator_id: string;
  name: string;
  role: 'remote_pilot_in_command' | 'visual_observer' | 'field_assistant' | 'designer';
}

export interface EvidenceRequirement {
  requirement_id: string;
  evidence_type: EvidenceType;
  label: string;
  status: EvidenceStatus;
  notes?: string;
}

export interface EvidenceItem {
  evidence_id: string;
  zone_id: string;
  evidence_type: EvidenceType;
  status: EvidenceStatus;
  description: string;
  related_mission_id?: string;
  notes?: string;
}

export interface DesignZone {
  zone_id: string;
  name: string;
  description: string;
  priority: Priority;
  tags: string[];
  required_evidence: EvidenceRequirement[];
  completion_status: 'not_started' | 'in_progress' | 'design_ready';
  notes?: string;
  related_mission_ids: string[];
  related_evidence_ids: string[];
}

export interface ChecklistItem {
  checklist_item_id: string;
  label: string;
  complete: boolean;
}

export interface Mission {
  mission_id: string;
  name: string;
  purpose: string;
  assigned_drone_id: string;
  assigned_operator_id: string;
  related_zone_ids: string[];
  estimated_duration_minutes: number;
  capture_goals: string[];
  preflight_checklist: ChecklistItem[];
  postflight_checklist: ChecklistItem[];
  status: MissionStatus;
  notes?: string;
}

export interface ChronicleEvent {
  event_id: string;
  event_type: ChronicleEventType;
  created_at: string;
  actor_id?: string;
  site_id: string;
  subject_type?: string;
  subject_id?: string;
  payload: Record<string, unknown>;
  supersedes_event_id?: string;
  correction_reason?: string;
}

export interface ExportArtifact {
  id: string;
  label: string;
  filename: string;
  mime_type: string;
  content: string;
  created_at: string;
}

export interface WebODMHandoffManifest {
  project_name: string;
  site_id: string;
  survey_date: string;
  missions: Array<{
    mission_id: string;
    name: string;
    media_folder: string;
    related_zones: string[];
  }>;
  recommended_folder_structure: string[];
  notes: string[];
}

export interface SurveyProject {
  project_id: string;
  version: string;
  created_at: string;
  updated_at: string;
  site: Site;
  fleet: Drone[];
  operators: Operator[];
  zones: DesignZone[];
  missions: Mission[];
  evidence_items: EvidenceItem[];
  chronicle_events: ChronicleEvent[];
}
