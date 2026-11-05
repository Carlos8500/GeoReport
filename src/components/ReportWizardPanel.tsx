import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lock,
  Camera,
  ArrowLeft,
  Send,
  Crosshair,
} from 'lucide-react';
import {
  AnimalSpecies,
  EventType,
  IncidentReport,
  LatLng,
} from '../types/rabiaCun';
import {
  applyPrivacyApproximation,
  calculateDistanceMeters,
  detectSupermanzana,
  IMSS_HGR_17_COORDS,
  isPointInPolygon,
  KABAH_MAP_CENTER,
} from '../utils/geofence';

interface ReportWizardPanelProps {
  draftLocation: LatLng;
  onDraftLocationChange: (coords: LatLng) => void;
  onSubmitReport: (newReport: IncidentReport) => void;
  onCancel: () => void;
}

const EVENT_LABELS: Record<EventType, string> = {
  avistamiento: 'Avistamiento sin contacto',
  comportamiento_erratico: 'Animal con comportamiento errático / desorientado',
  aranazo: 'Arañazo o contacto físico superficial',
  mordedura: 'Mordedura (Requiere atención médica inmediata)',
};

const SPECIES_LABELS: Record<AnimalSpecies, string> = {
  zorra_gris: 'Zorra gris (Urocyon cinereoargenteus)',
  perro: 'Perro (sin dueño / callejero)',
  gato: 'Gato (sin dueño / feral)',
  coati_mapache: 'Coatí / Tejón o Mapache',
  murcielago: 'Murciélago',
};

export const ReportWizardPanel: React.FC<ReportWizardPanelProps> = ({
  draftLocation,
  onDraftLocationChange,
  onSubmitReport,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [eventType, setEventType] = useState<EventType>('avistamiento');
  const [species, setSpecies] = useState<AnimalSpecies>('zorra_gris');
  const [referenceLandmark, setReferenceLandmark] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attachPhotoSample, setAttachPhotoSample] = useState<boolean>(false);
  const [acceptedIntegrityRule, setAcceptedIntegrityRule] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  const insidePolygon = isPointInPolygon(draftLocation);
  const zoneInfo = detectSupermanzana(draftLocation);
  const publicApprox = applyPrivacyApproximation(draftLocation);
  const distToHospital = calculateDistanceMeters(draftLocation, IMSS_HGR_17_COORDS);

  const handleConfirmStep1 = () => {
    if (!insidePolygon) {
      setFormError(
        'La ubicación seleccionada está fuera del polígono rojo del Parque Kabah. Desplaza el mapa hacia adentro para continuar.'
      );
      return;
    }
    setFormError(null);
    if (!referenceLandmark.trim()) {
      setReferenceLandmark(`Cerca de ${zoneInfo.code} (${zoneInfo.sectorName})`);
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insidePolygon) {
      setFormError(
        'No se puede registrar un reporte fuera del polígono trazado del Parque Kabah.'
      );
      return;
    }
    if (description.trim().length < 12) {
      setFormError(
        'Por favor escribe una descripción breve del incidente (mínimo 12 caracteres) para orientar la revisión.'
      );
      return;
    }
    if (!acceptedIntegrityRule) {
      setFormError(
        'Debes confirmar la regla de integridad sanitaria y privacidad antes de enviar.'
      );
      return;
    }

    const folioNumber = Math.floor(120 + Math.random() * 850);
    const now = new Date();
    const formattedDate = `2026-11-04 ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newReport: IncidentReport = {
      id: `inc-${Date.now()}`,
      folio: `CUN-2026-0${folioNumber}`,
      title: `${EVENT_LABELS[eventType].split(' (')[0]} · ${
        SPECIES_LABELS[species].split(' (')[0]
      } en ${zoneInfo.code}`,
      eventType,
      species,
      verificationStatus: 'reporte_ciudadano',
      approxLat: publicApprox.lat,
      approxLng: publicApprox.lng,
      privacyRadiusMeters: 150,
      supermanzana: zoneInfo.code,
      referenceLandmark:
        referenceLandmark.trim() || `Perímetro ${zoneInfo.code}`,
      reportedAt: formattedDate,
      description: description.trim(),
      evidenceNote: attachPhotoSample
        ? 'Evidencia fotográfica ciudadana adjunta en expediente para validación administrativa.'
        : 'Reporte ciudadano en espera de revisión por personal autorizado.',
      recommendations:
        eventType === 'mordedura' || eventType === 'aranazo'
          ? [
              'URGENTE: Lava la herida con abundante agua y jabón durante 15 minutos continuos.',
              `Acude de inmediato al IMSS HGR No. 17 (ubicado a ${distToHospital} m en Av. Politécnico / SM 509) para valoración antirrábica.`,
              'No intentes capturar ni manipular al animal por tu cuenta.',
            ]
          : [
              'Mantén distancia de seguridad y evita alimentar o acorralar al ejemplar.',
              'Este registro se publica como Reporte Ciudadano con radio aproximado de 150 m hasta su verificación oficial.',
            ],
    };

    onSubmitReport(newReport);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-medium text-[#087E8B]">
            Paso {step} de 2 · Selector Estilo Uber
          </span>
          <h2 className="text-lg font-bold text-[#123047]">
            Levantar Reporte Ciudadano
          </h2>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Desplaza el mapa a la izquierda para ubicar la mira central fija sobre el lugar del incidente. Solo se aceptan reportes dentro del{' '}
            <span className="font-semibold text-slate-900">
              polígono triangular rojo (Parque Ecológico Kabah y SM colindantes)
            </span>
            .
          </p>

          {/* Live Geocerca & Privacy Card */}
          <div
            className={`p-4 rounded-xl border ${
              insidePolygon
                ? 'bg-teal-50/50 border-[#087E8B]/30'
                : 'bg-red-50/70 border-red-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {insidePolygon ? (
                <CheckCircle2 className="w-5 h-5 text-[#087E8B] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900">
                  {insidePolygon
                    ? `Ubicación válida en ${zoneInfo.code}`
                    : 'Ubicación fuera del polígono permitido'}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {zoneInfo.sectorName}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Pin exacto (privado):</span>
                    <span className="font-mono-tabular font-medium text-slate-800">
                      {draftLocation.lat.toFixed(5)}, {draftLocation.lng.toFixed(5)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">
                      Coordenada pública (150m):
                    </span>
                    <span className="font-mono-tabular font-semibold text-[#087E8B]">
                      {publicApprox.lat.toFixed(4)}, {publicApprox.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Geocerca Test Buttons */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Simular movimiento del pin en el mapa:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onDraftLocationChange(KABAH_MAP_CENTER)}
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:border-[#087E8B] text-slate-700 cursor-pointer"
              >
                Dentro: Parque Kabah
              </button>
              <button
                type="button"
                onClick={() =>
                  onDraftLocationChange({ lat: 21.1322, lng: -86.8402 })
                }
                className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:border-[#087E8B] text-slate-700 cursor-pointer"
              >
                Dentro: SM 51 / Paraíso Villas
              </button>
              <button
                type="button"
                onClick={() =>
                  onDraftLocationChange({ lat: 21.1415, lng: -86.8565 })
                }
                className="px-2.5 py-1.5 text-xs font-medium bg-red-50 border border-red-200 rounded-lg text-red-700 hover:bg-red-100 cursor-pointer"
              >
                Probar Fuera: SM 95 (Bloquea envío)
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Lock className="w-4 h-4 text-[#123047] shrink-0 mt-0.5" />
            <span>
              <strong>Regla de privacidad RABIA-CUN:</strong> No se guardarán domicilios ni coordenadas exactas. El mapa público mostrará únicamente el círculo aproximado de 150 m en {zoneInfo.code}.
            </span>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {formError}
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmStep1}
            disabled={!insidePolygon}
            className={`w-full py-3 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              insidePolygon
                ? 'bg-[#087E8B] text-white hover:bg-[#066873]'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            {insidePolygon
              ? `Confirmar ubicación aproximada en ${zoneInfo.code}`
              : 'Ubicación fuera del polígono rojo · Mueve el mapa adentro'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs">
            <span>
              Zona fijada: <strong>{zoneInfo.code}</strong> · Radio 150 m (
              <span className="font-mono-tabular">
                {publicApprox.lat.toFixed(4)}, {publicApprox.lng.toFixed(4)}
              </span>
              )
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[#087E8B] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              Ajustar pin
            </button>
          </div>

          <div>
            <label
              htmlFor="report-event-type"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Tipo de evento observado
            </label>
            <select
              id="report-event-type"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#087E8B]"
            >
              {(Object.keys(EVENT_LABELS) as EventType[]).map((key) => (
                <option key={key} value={key}>
                  {EVENT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="report-species"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Especie involucrada
            </label>
            <select
              id="report-species"
              value={species}
              onChange={(e) => setSpecies(e.target.value as AnimalSpecies)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#087E8B]"
            >
              {(Object.keys(SPECIES_LABELS) as AnimalSpecies[]).map((key) => (
                <option key={key} value={key}>
                  {SPECIES_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="report-landmark"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Referencia pública (sin números de casa ni datos personales)
            </label>
            <input
              id="report-landmark"
              type="text"
              value={referenceLandmark}
              onChange={(e) => setReferenceLandmark(e.target.value)}
              placeholder="Ej. Cerca de ciclopista Av. Nichupté / Parque Kabah"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div>
            <label
              htmlFor="report-description"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Descripción del encuentro o signos observados
            </label>
            <textarea
              id="report-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe qué observaste (ej. animal desorientado de día, salivación, dirección hacia donde se desplazó)..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          {/* Optional photo attachment toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Camera className="w-4 h-4 text-[#087E8B]" />
              <span>Adjuntar fotografía opcional para revisión administrativa</span>
            </div>
            <input
              id="report-photo-toggle"
              type="checkbox"
              checked={attachPhotoSample}
              onChange={(e) => setAttachPhotoSample(e.target.checked)}
              aria-label="Adjuntar fotografía opcional"
              className="w-4 h-4 accent-[#087E8B] cursor-pointer"
            />
          </div>

          {/* Integrity checkbox */}
          <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedIntegrityRule}
              onChange={(e) => setAcceptedIntegrityRule(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#087E8B]"
            />
            <span>
              Comprendo que este envío se registrará como <strong>Reporte ciudadano (no confirma rabia)</strong> y será revisado por el administrador antes de verificarse.
            </span>
          </label>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {formError}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Atrás
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#087E8B] hover:bg-[#066873] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Reporte al Mapa Kabah</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
