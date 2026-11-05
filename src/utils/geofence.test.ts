import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KABAH_MAP_CENTER,
  IMSS_HGR_17_COORDS,
  isPointInPolygon,
  detectSupermanzana,
  applyPrivacyApproximation,
  calculateDistanceMeters,
  computeIncidentSummary,
} from './geofence';
import { IncidentReport } from '../types/rabiaCun';

test('isPointInPolygon validates points inside and outside the Kabah red triangle', () => {
  // Parque Ecológico Kabah center is strictly inside the red triangle
  assert.equal(isPointInPolygon(KABAH_MAP_CENTER), true);

  // Paraíso Villas / SM 51 inside the triangle
  assert.equal(isPointInPolygon({ lat: 21.132, lng: -86.839 }), true);

  // Zona Hotelera / Playa Delfines is outside the triangle
  assert.equal(isPointInPolygon({ lat: 21.0605, lng: -86.7795 }), false);

  // Far northwest outside Av. Andrés Quintana Roo
  assert.equal(isPointInPolygon({ lat: 21.152, lng: -86.855 }), false);
});

test('detectSupermanzana identifies Parque Ecológico Kabah and surrounding Supermanzanas', () => {
  const kabah = detectSupermanzana({ lat: 21.141, lng: -86.836 });
  assert.equal(kabah.code, 'Parque Ecológico Kabah');
  assert.equal(kabah.insidePolygon, true);

  const outside = detectSupermanzana({ lat: 21.16, lng: -86.86 });
  assert.equal(outside.insidePolygon, false);
});

test('applyPrivacyApproximation preserves geofence validity while rounding coordinates', () => {
  const rawPoint = { lat: 21.1384729, lng: -86.8378192 };
  const approx = applyPrivacyApproximation(rawPoint);
  assert.equal(isPointInPolygon(approx), true);
  // Ensure precision is capped to 4 decimal places (no sensitive exact house GPS)
  assert.equal(approx.lat.toString().split('.')[1]?.length <= 4, true);
});

test('calculateDistanceMeters computes realistic distance to IMSS HGR No. 17', () => {
  const dist = calculateDistanceMeters(KABAH_MAP_CENTER, IMSS_HGR_17_COORDS);
  assert.equal(dist > 500 && dist < 3000, true);
});

test('computeIncidentSummary aggregates counts accurately excluding rejected reports', () => {
  const sample: IncidentReport[] = [
    {
      id: '1',
      folio: 'CUN-01',
      title: 'Avistamiento zorra gris',
      eventType: 'avistamiento',
      species: 'zorra_gris',
      verificationStatus: 'verificado_oficial',
      approxLat: 21.14,
      approxLng: -86.836,
      privacyRadiusMeters: 150,
      supermanzana: 'Parque Ecológico Kabah',
      referenceLandmark: 'Sendero Norte',
      reportedAt: '2026-11-01',
      description: 'Test',
      recommendations: [],
    },
    {
      id: '2',
      folio: 'CUN-02',
      title: 'Reporte duplicado',
      eventType: 'avistamiento',
      species: 'perro',
      verificationStatus: 'rechazado',
      approxLat: 21.135,
      approxLng: -86.84,
      privacyRadiusMeters: 150,
      supermanzana: 'SM 51',
      referenceLandmark: 'Av. Nichupté',
      reportedAt: '2026-11-02',
      description: 'Test',
      recommendations: [],
    },
  ];

  const stats = computeIncidentSummary(sample);
  assert.equal(stats.totalActive, 1);
  assert.equal(stats.verifiedCount, 1);
  assert.equal(stats.bySpecies['zorra_gris'], 1);
});
