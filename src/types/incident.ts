export type Severity = 'Niedrig' | 'Mittel' | 'Hoch';
export type IncidentStatus = 'pending' | 'approved' | 'rejected';
export type IncidentType =
  | 'Taschendiebstahl'
  | 'Aggression'
  | 'Raub'
  | 'Betrug'
  | 'Vandalismus'
  | 'Sonstiges';

export interface Incident {
  id: string;
  city: string;
  area: string;
  incident_type: IncidentType | string;
  severity: Severity;
  description: string;
  status: IncidentStatus;
  ai_confidence?: number | null;
  ai_reason?: string | null;
  reporter_email?: string | null;
  created_at: string;
}

export const INCIDENT_TYPES: IncidentType[] = [
  'Taschendiebstahl',
  'Aggression',
  'Raub',
  'Betrug',
  'Vandalismus',
  'Sonstiges',
];

export const SEVERITIES: Severity[] = ['Niedrig', 'Mittel', 'Hoch'];
