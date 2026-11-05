/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  UserCheck,
  MapPin,
  PlusCircle,
  Bell,
  BarChart3,
  Code2,
  Map,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  IncidentReport,
  LatLng,
  VerificationStatus,
} from './types/rabiaCun';
import {
  INITIAL_INCIDENT_REPORTS,
  OFFICIAL_HEALTH_ALERTS,
} from './data/seedCancun';
import {
  IMSS_HGR_17_COORDS,
  KABAH_MAP_CENTER,
  calculateDistanceMeters,
} from './utils/geofence';
import { KabahInteractiveMap } from './components/KabahInteractiveMap';
import { ReportWizardPanel } from './components/ReportWizardPanel';
import {
  AlertsAndPreventionView,
  StatsAndAdminReviewView,
  TechnicalBlueprintView,
} from './components/SecondaryViews';

type ActiveTab = 'mapa' | 'alertas' | 'estadisticas' | 'arquitectura';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mapa');
  const [incidents, setIncidents] = useState<IncidentReport[]>(
    INITIAL_INCIDENT_REPORTS
  );
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    INITIAL_INCIDENT_REPORTS[0].id
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [draftLocation, setDraftLocation] = useState<LatLng>(KABAH_MAP_CENTER);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const visibleIncidents = incidents.filter((inc) => {
    if (inc.verificationStatus === 'rechazado') return false;
    if (statusFilter !== 'all' && inc.verificationStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  const selectedIncident =
    incidents.find((i) => i.id === selectedIncidentId) ||
    visibleIncidents[0] ||
    null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const handleStartReport = () => {
    setActiveTab('mapa');
    setIsReporting(true);
  };

  const handleCreateReport = (newReport: IncidentReport) => {
    setIncidents((prev) => [newReport, ...prev]);
    setSelectedIncidentId(newReport.id);
    setIsReporting(false);
    setStatusFilter('all');
    showToast(
      `Reporte ${newReport.folio} registrado en ${newReport.supermanzana} con radio de privacidad de 150 m.`
    );
  };

  const handleUpdateIncidentStatus = (
    incidentId: string,
    newStatus: VerificationStatus,
    officialSource: string,
    evidenceNote: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              verificationStatus: newStatus,
              officialSource:
                newStatus === 'verificado_oficial'
                  ? officialSource ||
                    'SESA Quintana Roo · Jurisdicción Sanitaria No. 2'
                  : inc.officialSource,
              evidenceNote,
            }
          : inc
      )
    );
    showToast(`Estado del registro actualizado a: ${newStatus.replace('_', ' ')}`);
  };

  const statusLabel = (status: VerificationStatus) => {
    switch (status) {
      case 'verificado_oficial':
        return 'Verificado por fuente oficial';
      case 'en_revision':
        return 'En revisión administrativa';
      case 'reporte_ciudadano':
        return 'Reporte ciudadano (sin confirmar)';
      case 'rechazado':
        return 'Descartado';
    }
  };

  const eventLabel = (type: IncidentReport['eventType']) => {
    switch (type) {
      case 'avistamiento':
        return 'Avistamiento';
      case 'mordedura':
        return 'Mordedura';
      case 'aranazo':
        return 'Arañazo';
      case 'comportamiento_erratico':
        return 'Conducta errática';
    }
  };

  const speciesLabel = (sp: IncidentReport['species']) => {
    switch (sp) {
      case 'zorra_gris':
        return 'Zorra gris';
      case 'perro':
        return 'Perro sin dueño';
      case 'gato':
        return 'Gato sin dueño';
      case 'coati_mapache':
        return 'Coatí / Mapache';
      case 'murcielago':
        return 'Murciélago';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 pb-16 md:pb-0">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#123047] text-white border-b border-slate-800">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#mapa"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('mapa');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display"
        >
          RABIA-CUN
        </a>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200"
        >
          <button
            type="button"
            onClick={() => setActiveTab('mapa')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'mapa'
                ? 'text-white underline underline-offset-8 decoration-[#2DD4BF] decoration-2 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Mapa Kabah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('alertas')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'alertas'
                ? 'text-white underline underline-offset-8 decoration-[#2DD4BF] decoration-2 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Alertas y Prevención
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('estadisticas')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'estadisticas'
                ? 'text-white underline underline-offset-8 decoration-[#2DD4BF] decoration-2 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Estadísticas y Revisión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arquitectura')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'arquitectura'
                ? 'text-white underline underline-offset-8 decoration-[#2DD4BF] decoration-2 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Guía React Native
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleStartReport}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#087E8B] hover:bg-[#066873] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Levantar Reporte
          </button>
        </div>
      </header>

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div
          role="status"
          className="bg-[#087E8B] text-white px-6 py-2.5 text-xs font-medium flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="underline text-white/90 hover:text-white ml-4 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5">
        {/* Contextual Institutional Strip */}
        <section className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-[#123047]">
                Cancún, Quintana Roo
              </span>
              <span aria-hidden="true">·</span>
              <span>Polígono Parque Ecológico Kabah (SM 48, 50, 51, 56, 516, 523)</span>
              <span aria-hidden="true">·</span>
              <span>Instituto Tecnológico de Cancún</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#123047] mt-0.5">
              Vigilancia Epidemiológica y Reportes Geolocalizados con Geocerca Kabah
            </h1>
          </div>

          {/* Interactive Filter Controls for Map View */}
          {activeTab === 'mapa' && (
            <div
              role="group"
              aria-label="Filtrar marcadores por estado de verificación"
              className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl"
            >
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-[#123047] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({incidents.filter((i) => i.verificationStatus !== 'rechazado').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('verificado_oficial')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === 'verificado_oficial'
                    ? 'bg-white text-[#087E8B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Oficiales (
                {
                  incidents.filter(
                    (i) => i.verificationStatus === 'verificado_oficial'
                  ).length
                }
                )
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('en_revision')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === 'en_revision'
                    ? 'bg-white text-[#D97706] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                En Revisión (
                {
                  incidents.filter((i) => i.verificationStatus === 'en_revision')
                    .length
                }
                )
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('reporte_ciudadano')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  statusFilter === 'reporte_ciudadano'
                    ? 'bg-white text-[#123047] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ciudadanos (
                {
                  incidents.filter(
                    (i) => i.verificationStatus === 'reporte_ciudadano'
                  ).length
                }
                )
              </button>
            </div>
          )}
        </section>

        {/* VIEW 1: INTERACTIVE KABAH POLYGON MAP + REPORT WIZARD / FICHA */}
        {activeTab === 'mapa' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 7 Cols: Interactive Map with Uber Center Pin & Red Triangle */}
            <div className="lg:col-span-7 flex flex-col min-h-[540px]">
              <KabahInteractiveMap
                incidents={visibleIncidents}
                selectedIncidentId={selectedIncident?.id ?? null}
                onSelectIncident={(inc) => {
                  setSelectedIncidentId(inc.id);
                  setDraftLocation({ lat: inc.approxLat, lng: inc.approxLng });
                  setIsReporting(false);
                }}
                isPickingLocation={isReporting}
                draftLocation={draftLocation}
                onDraftLocationChange={setDraftLocation}
                onStartReportAtCurrentPin={() => setIsReporting(true)}
              />
            </div>

            {/* Right 5 Cols: Either Uber-Pin Report Wizard OR Selected Incident Ficha + Feed */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {isReporting ? (
                <ReportWizardPanel
                  draftLocation={draftLocation}
                  onDraftLocationChange={setDraftLocation}
                  onSubmitReport={handleCreateReport}
                  onCancel={() => setIsReporting(false)}
                />
              ) : (
                <>
                  {/* Selected Incident Detailed Ficha */}
                  {selectedIncident ? (
                    <article
                      aria-label="Ficha de incidente seleccionado"
                      className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                          <span className="font-mono-tabular font-bold text-[#123047]">
                            {selectedIncident.folio}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{selectedIncident.reportedAt}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-slate-800">
                            {selectedIncident.supermanzana}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-semibold inline-flex items-center gap-1 ${
                            selectedIncident.verificationStatus ===
                            'verificado_oficial'
                              ? 'text-[#087E8B]'
                              : selectedIncident.verificationStatus ===
                                'en_revision'
                              ? 'text-[#D97706]'
                              : 'text-[#123047]'
                          }`}
                        >
                          {selectedIncident.verificationStatus ===
                          'verificado_oficial' ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : selectedIncident.verificationStatus ===
                            'en_revision' ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          <span>
                            {statusLabel(selectedIncident.verificationStatus)}
                          </span>
                        </span>
                      </div>

                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          {selectedIncident.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                          <span>
                            Evento:{' '}
                            <strong className="text-slate-700">
                              {eventLabel(selectedIncident.eventType)}
                            </strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Especie:{' '}
                            <strong className="text-slate-700">
                              {speciesLabel(selectedIncident.species)}
                            </strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono-tabular">
                            Radio público: {selectedIncident.privacyRadiusMeters} m
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedIncident.description}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div>
                          <span className="font-semibold text-slate-800">
                            Referencia aproximada:
                          </span>{' '}
                          <span className="text-slate-600">
                            {selectedIncident.referenceLandmark}
                          </span>
                        </div>
                        {selectedIncident.officialSource && (
                          <div>
                            <span className="font-semibold text-[#087E8B]">
                              Fuente Oficial:
                            </span>{' '}
                            <span className="text-slate-700">
                              {selectedIncident.officialSource}
                            </span>
                          </div>
                        )}
                        {selectedIncident.evidenceNote && (
                          <div>
                            <span className="font-semibold text-slate-800">
                              Estado de expediente:
                            </span>{' '}
                            <span className="text-slate-600">
                              {selectedIncident.evidenceNote}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-[#123047]">
                          Orientación preventiva para este registro:
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                          {selectedIncident.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500">
                          IMSS HGR No. 17 a{' '}
                          <strong className="font-mono-tabular text-slate-700">
                            {calculateDistanceMeters(
                              {
                                lat: selectedIncident.approxLat,
                                lng: selectedIncident.approxLng,
                              },
                              IMSS_HGR_17_COORDS
                            )}{' '}
                            m
                          </strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('estadisticas')}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                          >
                            Revisar como Admin
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsReporting(true)}
                            className="px-3 py-1.5 rounded-lg bg-[#087E8B] hover:bg-[#066873] text-white text-xs font-semibold cursor-pointer"
                          >
                            Reportar en esta zona
                          </button>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        No hay incidentes con el filtro seleccionado.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className="mt-3 px-4 py-2 bg-[#087E8B] text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Mostrar todos los registros
                      </button>
                    </div>
                  )}

                  {/* Incident List in Polygon */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#123047]">
                        Registros en Polígono Kabah ({visibleIncidents.length})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('arquitectura')}
                        className="text-xs font-semibold text-[#087E8B] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ver código RN + Docker</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[240px] overflow-y-auto pr-1">
                      {visibleIncidents.map((item) => {
                        const isActive = item.id === selectedIncident?.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedIncidentId(item.id);
                              setDraftLocation({
                                lat: item.approxLat,
                                lng: item.approxLng,
                              });
                            }}
                            className={`w-full text-left py-2.5 px-3 rounded-xl transition-colors flex items-start justify-between gap-3 cursor-pointer ${
                              isActive
                                ? 'bg-teal-50/70'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <span className="font-mono-tabular font-semibold text-[#123047]">
                                  {item.folio}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{item.supermanzana}</span>
                                <span aria-hidden="true">·</span>
                                <span>{speciesLabel(item.species)}</span>
                              </div>
                              <div className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                                {item.title}
                              </div>
                            </div>

                            <span
                              className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                                item.verificationStatus === 'verificado_oficial'
                                  ? 'text-[#087E8B]'
                                  : item.verificationStatus === 'en_revision'
                                  ? 'text-[#D97706]'
                                  : 'text-slate-600'
                              }`}
                            >
                              {item.verificationStatus === 'verificado_oficial'
                                ? 'Oficial'
                                : item.verificationStatus === 'en_revision'
                                ? 'Revisión'
                                : 'Ciudadano'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: OFFICIAL HEALTH ALERTS & PREVENTION CENTER */}
        {activeTab === 'alertas' && (
          <AlertsAndPreventionView
            alerts={OFFICIAL_HEALTH_ALERTS}
            onFocusHospitalOnMap={() => {
              setDraftLocation(IMSS_HGR_17_COORDS);
              setActiveTab('mapa');
              showToast(
                'Mapa centrado en IMSS HGR No. 17 (Vértice Suroeste del Polígono Kabah).'
              );
            }}
          />
        )}

        {/* VIEW 3: DESCRIPTIVE STATISTICS & ADMIN VERIFICATION CONSOLE */}
        {activeTab === 'estadisticas' && (
          <StatsAndAdminReviewView
            incidents={incidents}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            onSelectIncidentOnMap={(inc) => {
              setSelectedIncidentId(inc.id);
              setDraftLocation({ lat: inc.approxLat, lng: inc.approxLng });
              setIsReporting(false);
              setActiveTab('mapa');
            }}
          />
        )}

        {/* VIEW 4: REACT NATIVE + POSTGIS + DOCKER TECHNICAL BLUEPRINT */}
        {activeTab === 'arquitectura' && <TechnicalBlueprintView />}
      </main>

      {/* Mobile Bottom Tab Bar (Thumb-zone ergonomic navigation) */}
      <nav
        aria-label="Navegación móvil inferior"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center h-14 px-1"
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('mapa');
            setIsReporting(false);
          }}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
            activeTab === 'mapa' && !isReporting
              ? 'text-[#087E8B] font-bold'
              : 'text-slate-600'
          }`}
        >
          <Map className="w-4 h-4" />
          <span className="mt-0.5">Mapa</span>
        </button>

        <button
          type="button"
          onClick={handleStartReport}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
            isReporting ? 'text-[#087E8B] font-bold' : 'text-slate-600'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span className="mt-0.5">Reportar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alertas')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
            activeTab === 'alertas'
              ? 'text-[#087E8B] font-bold'
              : 'text-slate-600'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="mt-0.5">Alertas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('estadisticas')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
            activeTab === 'estadisticas'
              ? 'text-[#087E8B] font-bold'
              : 'text-slate-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="mt-0.5">Revisión</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('arquitectura')}
          className={`flex flex-col items-center justify-center min-h-[44px] text-[10px] font-medium cursor-pointer ${
            activeTab === 'arquitectura'
              ? 'text-[#087E8B] font-bold'
              : 'text-slate-600'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span className="mt-0.5">Código RN</span>
        </button>
      </nav>
    </div>
  );
}
