export type EventType =
  | 'avistamiento'
  | 'mordedura'
  | 'aranazo'
  | 'comportamiento_erratico';

export type AnimalSpecies =
  | 'zorra_gris'
  | 'perro'
  | 'gato'
  | 'coati_mapache'
  | 'murcielago';

export type VerificationStatus =
  | 'verificado_oficial'
  | 'en_revision'
  | 'reporte_ciudadano'
  | 'rechazado';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface IncidentReport {
  id: string;
  folio: string;
  title: string;
  eventType: EventType;
  species: AnimalSpecies;
  verificationStatus: VerificationStatus;
  approxLat: number;
  approxLng: number;
  privacyRadiusMeters: number;
  supermanzana: string;
  referenceLandmark: string;
  reportedAt: string;
  description: string;
  officialSource?: string;
  evidenceNote?: string;
  photoUrl?: string;
  recommendations: string[];
}

export interface HealthAlert {
  id: string;
  folio: string;
  title: string;
  issuedAt: string;
  validUntil: string;
  zone: string;
  source: string;
  sourceUrl: string;
  severity: 'alta' | 'preventiva' | 'informativa';
  summary: string;
  recommendations: string[];
}

export interface LandmarkPoint {
  id: string;
  name: string;
  category: 'hospital' | 'parque' | 'comercio' | 'vialidad';
  lat: number;
  lng: number;
  supermanzana: string;
  detail: string;
}
