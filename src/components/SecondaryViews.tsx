import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  UserCheck,
  ExternalLink,
  PhoneCall,
  Check,
  Copy,
  FileCheck2,
  XCircle,
  Filter,
  Smartphone,
  Server,
  Database,
} from 'lucide-react';
import {
  AnimalSpecies,
  EventType,
  HealthAlert,
  IncidentReport,
  VerificationStatus,
} from '../types/rabiaCun';
import { computeIncidentSummary } from '../utils/geofence';

/* ============================================================================
 * 1. VISTA ALERTAS SANITARIAS Y CENTRO DE PREVENCIÓN (Funcionalidades 4 y 5)
 * ========================================================================== */
interface AlertsAndPreventionProps {
  alerts: HealthAlert[];
  onFocusHospitalOnMap: () => void;
}

export const AlertsAndPreventionView: React.FC<AlertsAndPreventionProps> = ({
  alerts,
  onFocusHospitalOnMap,
}) => {
  const [selectedExposureType, setSelectedExposureType] = useState<
    'mordedura' | 'contacto_saliva' | 'avistamiento'
  >('mordedura');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 cols: Official Health Alerts */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#123047]">
                Alertas Sanitarias Oficiales · Cancún
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Avisos centralizados con fecha, vigencia, zona y enlace al comunicado original verificable.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <article
                key={alert.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-mono-tabular font-semibold text-[#123047]">
                    {alert.folio}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#D97706]">
                     Prioridad {alert.severity.toUpperCase()}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Emitido: {alert.issuedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>Vigencia: {alert.validUntil}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {alert.title}
                </h3>

                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Zona cubierta:</span>{' '}
                  {alert.zone}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {alert.summary}
                </p>

                <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                  <div className="text-xs font-semibold text-[#123047] mb-2">
                    Recomendaciones oficiales:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                    {alert.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                  <span>Fuente: {alert.source}</span>
                  <a
                    href={alert.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#087E8B] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Consultar fuente oficial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Right 5 cols: Interactive Prevention Center & Emergency Protocol */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#123047]">
              Centro de Prevención y Protocolo
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Selecciona la situación para consultar los pasos inmediatos basados en guías de la Secretaría de Salud:
            </p>
          </div>

          {/* Interactive scenario selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedExposureType('mordedura')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                selectedExposureType === 'mordedura'
                  ? 'bg-[#123047] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mordedura / Arañazo
            </button>
            <button
              type="button"
              onClick={() => setSelectedExposureType('contacto_saliva')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                selectedExposureType === 'contacto_saliva'
                  ? 'bg-[#123047] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contacto / Mascota
            </button>
            <button
              type="button"
              onClick={() => setSelectedExposureType('avistamiento')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                selectedExposureType === 'avistamiento'
                  ? 'bg-[#123047] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Avistamiento Silvestre
            </button>
          </div>

          {selectedExposureType === 'mordedura' && (
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 flex flex-col gap-3">
              <div className="text-sm font-bold text-red-900">
                Protocolo de Atención Médica Inmediata (Exposición de Riesgo)
              </div>
              <ol className="space-y-2 text-xs text-slate-800 list-decimal pl-4">
                <li>
                  <strong>Lavado inmediato (15 minutos):</strong> Lava la herida o rasguño de inmediato bajo el chorro de agua corriente y jabón abundante durante al menos 15 minutos.
                </li>
                <li>
                  <strong>No cubras ni sutures la herida por tu cuenta:</strong> Evita aplicar remedios caseros, pomadas o vendajes oclusivos.
                </li>
                <li>
                  <strong>Acude hoy mismo a Urgencias:</strong> El médico valorará el inicio de inmunoglobulina y vacuna antirrábica humana post-exposición.
                </li>
              </ol>
              <button
                type="button"
                onClick={onFocusHospitalOnMap}
                className="mt-1 py-2.5 px-4 bg-[#087E8B] hover:bg-[#066873] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Ubicar IMSS HGR No. 17 en el Mapa (Vértice Suroeste Kabah)
              </button>
            </div>
          )}

          {selectedExposureType === 'contacto_saliva' && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col gap-2.5 text-xs text-slate-800">
              <div className="text-sm font-bold text-amber-950">
                Si tu perro o gato tuvo contacto con fauna silvestre (zorra gris, coatí, murciélago)
              </div>
              <p>
                1. No toques con las manos descubiertas la saliva o heridas frescas de tu mascota (usa guantes gruesos).
              </p>
              <p>
                2. Aísla preventivamente a tu mascota en casa y notifica a la <strong>Dirección de Bienestar Animal de Cancún</strong> o acude con tu médico veterinario con su carnet de vacunación antirrábica vigente.
              </p>
            </div>
          )}

          {selectedExposureType === 'avistamiento' && (
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-col gap-2.5 text-xs text-slate-800">
              <div className="text-sm font-bold text-[#123047]">
                Qué hacer al observar una zorra gris, coatí o animal errático en Parque Kabah
              </div>
              <p>
                1. <strong>Observación a distancia (&gt; 15 metros):</strong> Los animales silvestres con rabia suelen perder el miedo natural al humano o caminar desorientados de día.
              </p>
              <p>
                2. <strong>No intentes alimentarlos ni capturarlos:</strong> Registra la ubicación aproximada en <strong>RABIA-CUN</strong> para que personal capacitado revise el cuadrante.
              </p>
            </div>
          )}

          {/* Official Cancún Directory */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-bold text-[#123047] mb-3">
              Directorio Oficial de Atención en Cancún
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900">
                    IMSS - Hospital General Regional No. 17
                  </div>
                  <div className="text-slate-600">
                    Av. Politécnico Nacional / Av. Cancún (SM 509, junto al polígono Kabah)
                  </div>
                </div>
                <span className="font-mono-tabular font-semibold text-[#087E8B] shrink-0">
                  Urgencias 24h
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900">
                    Jurisdicción Sanitaria No. 2 (SESA Quintana Roo)
                  </div>
                  <div className="text-slate-600">
                    Vigilancia Epidemiológica y Zoonosis · Cancún
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-mono-tabular font-semibold text-slate-800 shrink-0">
                  <PhoneCall className="w-3.5 h-3.5 text-[#087E8B]" />
                  998 884 4803
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900">
                    Dirección de Protección y Bienestar Animal Benito Juárez
                  </div>
                  <div className="text-slate-600">
                    SM 99 · Campañas antirrábicas y reporte de fauna en riesgo
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-mono-tabular font-semibold text-slate-800 shrink-0">
                  <PhoneCall className="w-3.5 h-3.5 text-[#087E8B]" />
                  998 892 3326
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. VISTA ESTADÍSTICAS DESCRIPTIVAS Y CONSOLA DE REVISIÓN (Funcionalidades 3 y 6)
 * ========================================================================== */
interface StatsAndAdminReviewProps {
  incidents: IncidentReport[];
  onUpdateIncidentStatus: (
    incidentId: string,
    newStatus: VerificationStatus,
    officialSource: string,
    evidenceNote: string
  ) => void;
  onSelectIncidentOnMap: (incident: IncidentReport) => void;
}

export const StatsAndAdminReviewView: React.FC<StatsAndAdminReviewProps> = ({
  incidents,
  onUpdateIncidentStatus,
  onSelectIncidentOnMap,
}) => {
  const [speciesFilter, setSpeciesFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceDrafts, setSourceDrafts] = useState<Record<string, string>>({});

  const filteredIncidents = incidents.filter((inc) => {
    if (speciesFilter !== 'all' && inc.species !== speciesFilter) return false;
    if (statusFilter !== 'all' && inc.verificationStatus !== statusFilter)
      return false;
    return true;
  });

  const stats = computeIncidentSummary(filteredIncidents);

  const speciesLabels: Record<AnimalSpecies, string> = {
    zorra_gris: 'Zorra gris',
    perro: 'Perro',
    gato: 'Gato',
    coati_mapache: 'Coatí / Mapache',
    murcielago: 'Murciélago',
  };

  const eventLabels: Record<EventType, string> = {
    avistamiento: 'Avistamiento',
    mordedura: 'Mordedura',
    aranazo: 'Arañazo',
    comportamiento_erratico: 'Conducta errática',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Descriptive KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500">
            Registros Activos en Polígono Kabah
          </div>
          <div className="text-3xl font-bold text-[#123047] font-mono-tabular mt-1">
            {stats.totalActive}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Distribución descriptiva (no estima brotes)
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500">
            Respaldados por Fuente Oficial
          </div>
          <div className="text-3xl font-bold text-[#087E8B] font-mono-tabular mt-1">
            {stats.verifiedCount}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Validados con evidencia SESA / Ecología
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500">
            En Revisión Administrativa
          </div>
          <div className="text-3xl font-bold text-[#D97706] font-mono-tabular mt-1">
            {stats.inReviewCount}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            En cotejo por brigada sanitaria
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500">
            Reportes Ciudadanos por Revisar
          </div>
          <div className="text-3xl font-bold text-slate-800 font-mono-tabular mt-1">
            {stats.citizenCount}
          </div>
          <div className="text-xs text-slate-600 mt-1">
            Pendientes de dictamen administrativo
          </div>
        </div>
      </div>

      {/* Breakdown by Species & Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#123047]">
              Distribución por Especie y Zona
            </h2>
            <Filter className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="stats-species-filter"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Filtrar por especie
              </label>
              <select
                id="stats-species-filter"
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">Todas las especies</option>
                <option value="zorra_gris">Zorra gris</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="coati_mapache">Coatí / Mapache</option>
                <option value="murcielago">Murciélago</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="stats-status-filter"
                className="block text-xs font-semibold text-slate-600 mb-1"
              >
                Estado de revisión
              </label>
              <select
                id="stats-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="all">Todos los estados</option>
                <option value="verificado_oficial">Verificado oficial</option>
                <option value="en_revision">En revisión</option>
                <option value="reporte_ciudadano">Reporte ciudadano</option>
              </select>
            </div>
          </div>

          {/* Species Bars */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-semibold text-slate-700">
              Registros por especie observada
            </div>
            {(Object.keys(speciesLabels) as AnimalSpecies[]).map((sp) => {
              const count = stats.bySpecies[sp] || 0;
              const pct =
                stats.totalActive > 0
                  ? Math.round((count / stats.totalActive) * 100)
                  : 0;
              return (
                <div key={sp} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-700 font-medium">
                      {speciesLabels[sp]}
                    </span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#087E8B] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zone Breakdown */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="text-xs font-semibold text-slate-700">
              Registros por Supermanzana / Sector Kabah
            </div>
            {Object.entries(stats.byZone).map(([zone, count]) => (
              <div
                key={zone}
                className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
              >
                <span className="text-slate-700">{zone}</span>
                <span className="font-mono-tabular font-bold text-[#123047]">
                  {count} reg.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 cols: Administrative Review & Verification Console (Funcionalidad 3) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#123047]">
              Consola de Revisión y Verificación (Rol Administrador)
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Regla de integridad: Solo el administrador puede publicar un incidente como <strong>Verificado por fuente oficial</strong> asociando el folio o evidencia correspondiente.
            </p>
          </div>

          <div className="space-y-3">
            {filteredIncidents.map((inc) => {
              const draftSource =
                sourceDrafts[inc.id] ??
                inc.officialSource ??
                'SESA Quintana Roo · Brigada Zoonosis Jurisdicción No. 2';

              return (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="font-mono-tabular font-bold text-[#123047]">
                        {inc.folio}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{inc.supermanzana}</span>
                      <span aria-hidden="true">·</span>
                      <span>{eventLabels[inc.eventType]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{speciesLabels[inc.species]}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectIncidentOnMap(inc)}
                      className="text-xs font-semibold text-[#087E8B] hover:underline cursor-pointer"
                    >
                      Ver en mapa
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {inc.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {inc.description}
                    </p>
                  </div>

                  {/* Source citation input for Admin Verification */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <input
                      type="text"
                      aria-label={`Fuente oficial para ${inc.folio}`}
                      value={draftSource}
                      onChange={(e) =>
                        setSourceDrafts((prev) => ({
                          ...prev,
                          [inc.id]: e.target.value,
                        }))
                      }
                      placeholder="Fuente oficial (ej. SESA Q. Roo Folio 2026-X)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                    />

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateIncidentStatus(
                            inc.id,
                            'verificado_oficial',
                            draftSource,
                            'Validado oficialmente por administrador con fuente documental.'
                          )
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${
                          inc.verificationStatus === 'verificado_oficial'
                            ? 'bg-[#087E8B] text-white'
                            : 'bg-teal-50 text-[#087E8B] border border-[#087E8B]/30 hover:bg-teal-100'
                        }`}
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>Verificar Oficial</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateIncidentStatus(
                            inc.id,
                            'en_revision',
                            '',
                            'En revisión por brigada de verificación.'
                          )
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          inc.verificationStatus === 'en_revision'
                            ? 'bg-[#E7A83E] text-slate-950'
                            : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        En Revisión
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateIncidentStatus(
                            inc.id,
                            'rechazado',
                            '',
                            'Descartado por duplicidad o falta de sustento.'
                          )
                        }
                        aria-label={`Descartar reporte ${inc.folio}`}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Descartar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 3. VISTA GUÍA TÉCNICA: REACT NATIVE (UBER PIN) + POSTGIS + DOCKER
 * ========================================================================== */
export const TechnicalBlueprintView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<
    'react_native' | 'postgis' | 'docker'
  >('react_native');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const codeSnippets: Record<'react_native' | 'postgis' | 'docker', string> = {
    react_native: `// src/screens/UberPinMapScreen.tsx (React Native + Expo + react-native-maps / MapTiler)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Polygon, Circle, UrlTile, Region } from 'react-native-maps';

// Polígono rojo exacto del Parque Ecológico Kabah y SM 48, 50, 51, 56, 516, 523
const KABAH_POLYGON = [
  { latitude: 21.1538, longitude: -86.8355 }, // Norte: Av. Xcaret / Av. Kabah
  { latitude: 21.1268, longitude: -86.8286 }, // Sureste: Av. Rodrigo Gómez / Av. Cancún
  { latitude: 21.1252, longitude: -86.8578 }, // Suroeste: Av. Cancún / IMSS HGR 17
];

export default function UberPinMapScreen() {
  const [centerPin, setCenterPin] = useState({
    latitude: 21.1372,
    longitude: -86.8398,
  });

  // 1. El mapa se mueve libremente; al soltarlo actualizamos la coordenada del Pin Central
  const handleRegionChangeComplete = (region: Region) => {
    setCenterPin({
      latitude: Number(region.latitude.toFixed(5)),
      longitude: Number(region.longitude.toFixed(5)),
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 21.1372,
          longitude: -86.8398,
          latitudeDelta: 0.032,
          longitudeDelta: 0.032,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* Teselas gratuitas de MapTiler para el MVP académico */}
        <UrlTile
          urlTemplate="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=TU_API_KEY_MAPTILER"
          maximumZ={19}
        />

        {/* Polígono Rojo del Área de Interés en Cancún */}
        <Polygon
          coordinates={KABAH_POLYGON}
          strokeColor="#DC2626"
          fillColor="rgba(220, 38, 38, 0.08)"
          strokeWidth={3}
        />

        {/* Círculo de Privacidad Pública (150 metros) alrededor del punto */}
        <Circle
          center={centerPin}
          radius={150}
          strokeColor="#087E8B"
          fillColor="rgba(8, 126, 139, 0.15)"
        />
      </MapView>

      {/* 2. Pin Central Fijo Estilo Uber (pointerEvents="none" para no bloquear gestos) */}
      <View pointerEvents="none" style={styles.centerPinOverlay}>
        <View style={styles.pinBubble}>
          <Text style={styles.pinText}>Radio de privacidad 150 m</Text>
        </View>
        <View style={styles.pinHead} />
        <View style={styles.pinStem} />
      </View>
    </View>
  );
}`,
    postgis: `-- 1. Inicializar extensión PostGIS en PostgreSQL (ejecutado en contenedor Docker)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Tabla de Zonas / Geocercas Sanitarias en Cancún
CREATE TABLE zonas_vigilancia (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  geom GEOMETRY(Polygon, 4326) NOT NULL
);

-- Insertar el Polígono Triangular del Parque Ecológico Kabah (SRID 4326 - WGS84)
INSERT INTO zonas_vigilancia (nombre, geom)
VALUES (
  'Corredor Parque Ecológico Kabah (SM 48, 50, 51, 56, 516, 523)',
  ST_GeomFromText(
    'POLYGON((
      -86.8355 21.1538,
      -86.8286 21.1268,
      -86.8578 21.1252,
      -86.8355 21.1538
    ))',
    4326
  )
);

-- 3. Consulta en NestJS antes de guardar un reporte ciudadano:
-- Verifica ST_Contains (que caiga dentro del triángulo) y aplica ST_SnapToGrid (~110m)
-- para no almacenar ni exponer jamás el domicilio exacto del ciudadano.
SELECT
  z.nombre AS zona_detectada,
  ST_Contains(
    z.geom,
    ST_SetSRID(ST_MakePoint($1, $2), 4326)
  ) AS dentro_del_poligono,
  ST_AsGeoJSON(
    ST_SnapToGrid(ST_SetSRID(ST_MakePoint($1, $2), 4326), 0.001)
  ) AS coordenada_publica_aproximada
FROM zonas_vigilancia z
WHERE z.id = 1;`,
    docker: `# docker-compose.yml (Se ejecuta SOLO en el VPS Linux de $200 MXN/mes, NO en los iPhones/tablets)
version: '3.9'

services:
  db_postgis:
    image: postgis/postgis:16-3.4-alpine
    container_name: rabia_cun_postgis
    restart: always
    environment:
      POSTGRES_USER: rabia_admin
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: rabia_cun_geo
    volumes:
      - postgis_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  api_nestjs:
    build: ./backend-nestjs
    container_name: rabia_cun_api
    restart: always
    depends_on:
      - db_postgis
    environment:
      DATABASE_URL: postgres://rabia_admin:\${DB_PASSWORD}@db_postgis:5432/rabia_cun_geo
      PORT: 4000

  caddy_https:
    image: caddy:2-alpine
    container_name: rabia_cun_proxy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

volumes:
  postgis_data:
  caddy_data:`,
  };

  const handleCopy = (key: 'react_native' | 'postgis' | 'docker') => {
    navigator.clipboard?.writeText(codeSnippets[key]);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Direct Answer Card: Docker vs React Native on iPhones & Tablets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-[#123047]">
          Arquitectura Recomendada: ¿Es necesario usar Docker para iPhones y Tablets?
        </h2>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Respuesta directa para tu entrega académica del <strong>Instituto Tecnológico de Cancún</strong>: Docker <strong>no se instala ni corre dentro de iPhones, iPads ni tablets Android</strong>. Su función es exclusivamente empaquetar tu servidor Backend y la base de datos PostGIS en el VPS Linux.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#123047] mb-2">
              <Smartphone className="w-4 h-4 text-[#087E8B]" />
              <span>1. iPhones y Tablets (Sin Docker)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Usas <strong>React Native + Expo (TypeScript)</strong>. Durante el desarrollo en clase, cualquier compañero con iPhone o tablet Android escanea el código QR con la app <strong>Expo Go</strong>. Para entrega final se compila en la nube con <strong>EAS Build</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#123047] mb-2">
              <Database className="w-4 h-4 text-[#087E8B]" />
              <span>2. Mapa Estilo Uber + Geocerca</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En vez de arrastrar un marcador lento, dejas un <strong>View con el pin fijo al centro</strong> de la pantalla (<code>pointerEvents=&quot;none&quot;</code>) y lees <code>onRegionChangeComplete</code> del mapa junto con un círculo de 150 m de privacidad.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-bold text-[#123047] mb-2">
              <Server className="w-4 h-4 text-[#087E8B]" />
              <span>3. Servidor VPS Linux (Sí usa Docker)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              En tu VPS de $200 MXN/mes sí usas <strong>Docker Compose</strong> para levantar <strong>PostgreSQL + PostGIS + NestJS + Caddy HTTPS</strong> en 10 segundos sin configurar librerías geoespaciales manualmente en Linux.
            </p>
          </div>
        </div>
      </div>

      {/* Code Blueprint Viewer */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveCodeTab('react_native')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'react_native'
                  ? 'bg-[#123047] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. React Native (Pin Estilo Uber)
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('postgis')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'postgis'
                  ? 'bg-[#123047] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. SQL PostGIS (Polígono Kabah)
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('docker')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeCodeTab === 'docker'
                  ? 'bg-[#123047] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Docker Compose (VPS Backend)
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(activeCodeTab)}
            className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copiedTab === activeCodeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#087E8B]" />
                <span>Código copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar bloque</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono-tabular overflow-x-auto leading-relaxed">
          <code>{codeSnippets[activeCodeTab]}</code>
        </pre>
      </div>
    </div>
  );
};
