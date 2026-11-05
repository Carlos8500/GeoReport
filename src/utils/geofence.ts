import { IncidentReport, LatLng } from '../types/rabiaCun';

/**
 * Vértices exactos del polígono triangular rojo trazado sobre Cancún:
 * - Norte: Cruce Av. Xcaret / Av. Andrés Quintana Roo / Av. Kabah (junto a SM 21 / Las Plazas Outlet)
 * - Sureste: Cruce Av. Rodrigo Gómez (Av. Kabah) y Av. Cancún (Las Torres) / Av. Huayacán (SM 56/57)
 * - Suroeste: Cruce Av. Andrés Quintana Roo y Av. Cancún (Las Torres) (SM 516 / SM 523 / IMSS HGR No. 17)
 */
export const KABAH_POLYGON_VERTICES: LatLng[] = [
  { lat: 21.1538, lng: -86.8355 }, // Vértice Norte (Av. Xcaret / Av. Kabah)
  { lat: 21.1268, lng: -86.8286 }, // Vértice Sureste (Av. Rodrigo Gómez / Av. Cancún)
  { lat: 21.1252, lng: -86.8578 }, // Vértice Suroeste (Av. Cancún / SM 516 - IMSS 17)
];

export const KABAH_MAP_CENTER: LatLng = {
  lat: 21.1372,
  lng: -86.8398,
};

export const IMSS_HGR_17_COORDS: LatLng = {
  lat: 21.1312,
  lng: -86.8535,
};

/**
 * Ray-casting Point-in-Polygon algorithm para validar si una coordenada (lat, lng)
 * se encuentra dentro del polígono rojo del Parque Ecológico Kabah y alrededores.
 */
export function isPointInPolygon(
  point: LatLng,
  polygon: LatLng[] = KABAH_POLYGON_VERTICES
): boolean {
  if (polygon.length < 3) return false;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi + 1e-12) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Detecta automáticamente la Supermanzana o sector dentro del área de estudio
 * según las coordenadas seleccionadas en el mapa.
 */
export function detectSupermanzana(point: LatLng): {
  code: string;
  sectorName: string;
  insidePolygon: boolean;
} {
  const inside = isPointInPolygon(point);

  if (!inside) {
    return {
      code: 'Fuera del Polígono Kabah',
      sectorName: 'Ubicación externa al triángulo de vigilancia (Envío bloqueado)',
      insidePolygon: false,
    };
  }

  // Parque Ecológico Kabah (triángulo verde central entre Av. Nichupté y Av. Kabah)
  if (
    point.lat >= 21.1365 &&
    point.lat <= 21.1495 &&
    point.lng >= -86.8415 &&
    point.lng <= -86.8315
  ) {
    return {
      code: 'Parque Ecológico Kabah',
      sectorName: 'Reserva Urbana Kabah · Senderos y Área Silvestre',
      insidePolygon: inside,
    };
  }

  // SM 48 (Noroeste del Parque Kabah, junto a Av. Kohunlich / Korat)
  if (point.lat >= 21.1375 && point.lng < -86.8405) {
    return {
      code: 'SM 48',
      sectorName: 'Supermanzana 48 · Corredor Av. Kohunlich / Andrés Q. Roo',
      insidePolygon: inside,
    };
  }

  // SM 50 (Oeste de Av. Kohunlich / Av. Nichupté)
  if (point.lat >= 21.1345 && point.lat < 21.142 && point.lng < -86.8445) {
    return {
      code: 'SM 50',
      sectorName: 'Supermanzana 50 · Sector Av. Kinik / Av. Nichupté',
      insidePolygon: inside,
    };
  }

  // SM 51 (Sur de Av. Nichupté, norte de Paraíso Villas)
  if (
    point.lat >= 21.1308 &&
    point.lat < 21.1375 &&
    point.lng >= -86.8465 &&
    point.lng <= -86.833
  ) {
    return {
      code: 'SM 51',
      sectorName: 'Supermanzana 51 · Av. Nichupté Sur / Rodrigo Gómez',
      insidePolygon: inside,
    };
  }

  // SM 56 / Paraíso Villas (Sureste del triángulo, hacia Av. Cancún y Rodrigo Gómez)
  if (point.lat < 21.1315 && point.lng >= -86.843) {
    return {
      code: 'SM 56 · Paraíso Villas',
      sectorName: 'Supermanzana 56 · Corredor Paraíso Villas / Av. Rodrigo Gómez',
      insidePolygon: inside,
    };
  }

  // SM 523 / SM 516 (Suroeste del triángulo, cerca de IMSS HGR 17 y Av. Cancún)
  if (point.lat < 21.1345 && point.lng < -86.843) {
    return {
      code: 'SM 523 / SM 516',
      sectorName: 'Sector Suroeste · Av. Cancún (Las Torres) / Entorno IMSS HGR 17',
      insidePolygon: inside,
    };
  }

  return {
    code: inside ? 'Polígono Kabah Central' : 'Zona Externa (Fuera de Geocerca)',
    sectorName: inside
      ? 'Corredor de Vigilancia Parque Kabah'
      : 'Ubicación fuera del polígono prioritario trazado',
    insidePolygon: inside,
  };
}

/**
 * Regla de Integridad (Pág. 2 del Brief):
 * "Las ubicaciones públicas serán aproximadas... No se publicarán nombres,
 * domicilios ni coordenadas sensibles."
 * Redondea la coordenada a una rejilla de ~150m (~0.0012 grados) garantizando
 * que el punto resultante permanezca dentro del polígono si el original lo estaba.
 */
export function applyPrivacyApproximation(point: LatLng): LatLng {
  const gridStep = 0.001; // ~111 metros
  const approx: LatLng = {
    lat: Number((Math.round(point.lat / gridStep) * gridStep).toFixed(4)),
    lng: Number((Math.round(point.lng / gridStep) * gridStep).toFixed(4)),
  };

  if (isPointInPolygon(point) && !isPointInPolygon(approx)) {
    return {
      lat: Number(point.lat.toFixed(4)),
      lng: Number(point.lng.toFixed(4)),
    };
  }
  return approx;
}

/**
 * Calcula la distancia en metros (fórmula de Haversine) entre dos coordenadas
 * para indicar a cuántos metros se encuentra el hospital IMSS HGR No. 17 más cercano.
 */
export function calculateDistanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(R * c);
}

/**
 * Resumen estadístico descriptivo (Funcionalidad 6 del Brief RABIA-CUN)
 */
export function computeIncidentSummary(reports: IncidentReport[]) {
  const activeReports = reports.filter((r) => r.verificationStatus !== 'rechazado');
  const verifiedCount = activeReports.filter(
    (r) => r.verificationStatus === 'verificado_oficial'
  ).length;
  const inReviewCount = activeReports.filter(
    (r) => r.verificationStatus === 'en_revision'
  ).length;
  const citizenCount = activeReports.filter(
    (r) => r.verificationStatus === 'reporte_ciudadano'
  ).length;

  const bySpecies: Record<string, number> = {};
  const byEventType: Record<string, number> = {};
  const byZone: Record<string, number> = {};

  for (const r of activeReports) {
    bySpecies[r.species] = (bySpecies[r.species] || 0) + 1;
    byEventType[r.eventType] = (byEventType[r.eventType] || 0) + 1;
    byZone[r.supermanzana] = (byZone[r.supermanzana] || 0) + 1;
  }

  return {
    totalActive: activeReports.length,
    verifiedCount,
    inReviewCount,
    citizenCount,
    bySpecies,
    byEventType,
    byZone,
  };
}
