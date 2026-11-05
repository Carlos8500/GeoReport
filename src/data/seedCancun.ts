import { HealthAlert, IncidentReport, LandmarkPoint } from '../types/rabiaCun';

export const INITIAL_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'inc-001',
    folio: 'CUN-2026-0104',
    title: 'Zorra gris con desorientación diurna en lindero sur de reserva',
    eventType: 'comportamiento_erratico',
    species: 'zorra_gris',
    verificationStatus: 'verificado_oficial',
    approxLat: 21.1392,
    approxLng: -86.8358,
    privacyRadiusMeters: 150,
    supermanzana: 'Parque Ecológico Kabah',
    referenceLandmark: 'Lindero Av. Nichupté con Av. Rodrigo Gómez (Kabah)',
    reportedAt: '2026-11-02 08:40',
    description:
      'Ejemplar de zorra gris (Urocyon cinereoargenteus) observado caminando en círculos a plena luz del día cerca del área de trote sur, sin temor ante transeúntes. Personal de guardaparques acordonó el sendero.',
    officialSource:
      'SESA Quintana Roo / Dirección de Ecología Cancún · Comunicado Preventivo 11/2026',
    evidenceNote:
      'Verificado por brigada de zoonosis municipal tras reporte de corredores matutinos.',
    recommendations: [
      'No acercarse ni intentar alimentar o capturar a fauna silvestre dentro ni fuera del Parque Kabah.',
      'Mantener perros con correa al transitar por Av. Nichupté y Av. Rodrigo Gómez.',
      'Si tuvo contacto físico o lamedura sobre piel lesionada, acudir de inmediato al IMSS HGR No. 17.',
    ],
  },
  {
    id: 'inc-002',
    folio: 'CUN-2026-0108',
    title: 'Mordedura superficial de gato sin dueño en andador habitacional',
    eventType: 'mordedura',
    species: 'gato',
    verificationStatus: 'verificado_oficial',
    approxLat: 21.1328,
    approxLng: -86.8412,
    privacyRadiusMeters: 150,
    supermanzana: 'SM 51',
    referenceLandmark: 'Entorno Av. Nichupté Sur y calle cerrada SM 51',
    reportedAt: '2026-11-03 17:15',
    description:
      'Gato adulto sin collar agredió sin provocación a un residente que intentaba retirarlo de su cochera. El felino presentaba salivación excesiva y se ocultó hacia el área arbolada.',
    officialSource:
      'Jurisdicción Sanitaria No. 2 Cancún · Seguimiento Profiláctico Activo',
    evidenceNote:
      'Paciente atendido en IMSS HGR No. 17 con lavado quirúrgico e inicio de esquema profiláctico post-exposición.',
    recommendations: [
      'Evitar manipular gatos o perros ferales o sin dueño aunque parezcan heridos o dóciles.',
      'Verificar vigencia del certificado de vacunación antirrábica de mascotas domésticas en SM 51 y Paraíso Villas.',
    ],
  },
  {
    id: 'inc-003',
    folio: 'CUN-2026-0112',
    title: 'Avistamiento de coatí con marcha errática cruzando hacia zona escolar',
    eventType: 'avistamiento',
    species: 'coati_mapache',
    verificationStatus: 'en_revision',
    approxLat: 21.1424,
    approxLng: -86.8418,
    privacyRadiusMeters: 150,
    supermanzana: 'SM 48',
    referenceLandmark: 'Cruce Av. Kohunlich cerca de Korat Cocina Oriental',
    reportedAt: '2026-11-04 09:20',
    description:
      'Vecinos reportan un coatí solitario desplazándose con dificultad sobre la banqueta de Av. Kohunlich en dirección a SM 48, saliendo del perímetro arbolado.',
    evidenceNote:
      'En revisión por brigada de Protección y Bienestar Animal para inspección ocular en el cuadrante.',
    recommendations: [
      'Mantener botes de basura cerrados herméticamente para no atraer fauna silvestre del Parque Kabah a los domicilios.',
      'Reportar cualquier agresión de inmediato sin intervenir directamente.',
    ],
  },
  {
    id: 'inc-004',
    folio: 'CUN-2026-0115',
    title: 'Perro sin dueño agresivo en corredor peatonal hacia hospital',
    eventType: 'aranazo',
    species: 'perro',
    verificationStatus: 'reporte_ciudadano',
    approxLat: 21.1286,
    approxLng: -86.8495,
    privacyRadiusMeters: 150,
    supermanzana: 'SM 523 / SM 516',
    referenceLandmark: 'Corredor Av. Cancún (Las Torres) próximo a Ultrasonido Itza e IMSS 17',
    reportedAt: '2026-11-04 13:05',
    description:
      'Canino mediano color miel sin placa lanzó mordida y provocó rasguño en pantorrilla a peatón cerca del paradero de Av. Cancún. No se ha confirmado diagnóstico.',
    recommendations: [
      'Este registro es un reporte ciudadano pendiente de verificación oficial.',
      'Ante cualquier rasguño o mordedura, lavar con abundante agua y jabón durante 15 minutos y acudir a valoración médica.',
    ],
  },
  {
    id: 'inc-005',
    folio: 'CUN-2026-0118',
    title: 'Avistamiento nocturno de zorra gris en camellón residencial',
    eventType: 'avistamiento',
    species: 'zorra_gris',
    verificationStatus: 'en_revision',
    approxLat: 21.1289,
    approxLng: -86.8325,
    privacyRadiusMeters: 150,
    supermanzana: 'SM 56 · Paraíso Villas',
    referenceLandmark: 'Intersección Av. Rodrigo Gómez (Kabah) con Av. Cancún',
    reportedAt: '2026-11-04 06:50',
    description:
      'Conductor reporta avistamiento de ejemplar silvestre tipo zorra gris cruzando desde el extremo sur de Av. Rodrigo Gómez hacia los condominios de Paraíso Villas.',
    evidenceNote:
      'En proceso de cotejo con cámaras vecinales y personal de Ecología.',
    recommendations: [
      'No dejar alimento para mascotas en patios abiertos o cocheras durante la noche.',
      'Supervisar a mascotas al salir a pasear en horarios crepusculares.',
    ],
  },
];

export const OFFICIAL_HEALTH_ALERTS: HealthAlert[] = [
  {
    id: 'alert-01',
    folio: 'SESA-QROO-2026-10',
    title: 'Vigilancia epidemiológica por fauna silvestre positiva a rabia en Benito Juárez',
    issuedAt: '12 oct 2026',
    validUntil: '31 dic 2026',
    zone: 'Cancún · Corredor Parque Ecológico Kabah (SM 48, 50, 51, 56, 516, 523) y SM 248',
    source: 'Secretaría de Salud de Quintana Roo (SESA) / Ayuntamiento de Cancún',
    sourceUrl: 'https://cgc.qroo.gob.mx/se-fortalece-estrategia-de-prevencion-y-campana-antirrabica-en-quintana-roo/',
    severity: 'alta',
    summary:
      'Derivado del antecedente de alerta sanitaria en octubre de 2026 por contacto con zorra gris positiva a rabia en Cancún y el caso confirmado en 2024 por exposición a felino sin dueño, se mantiene vigilancia preventiva en zonas colindantes con reservas urbanas como el Parque Ecológico Kabah.',
    recommendations: [
      'Si tuviste contacto directo, mordedura, arañazo o lamedura de una zorra gris, coatí, mapache, murciélago o perro/gato desconocido, acude hoy mismo al IMSS HGR No. 17 o tu Centro de Salud.',
      'No manipules animales silvestres que luzcan dóciles, desorientados o heridos en banquetas o parques.',
      'Mantén al día la vacunación antirrábica anual de perros y gatos (gratuita en campañas de SESA).',
    ],
  },
  {
    id: 'alert-02',
    folio: 'BIENESTAR-CUN-2026-11',
    title: 'Jornada de Vacunación Antirrábica Canina y Felina en Perímetro Kabah',
    issuedAt: '01 nov 2026',
    validUntil: '30 nov 2026',
    zone: 'SM 48, SM 50, SM 51 y acceso Av. Nichupté del Parque Ecológico Kabah',
    source: 'Dirección de Protección y Bienestar Animal de Benito Juárez',
    sourceUrl: 'https://rcacancun.gob.mx/',
    severity: 'preventiva',
    summary:
      'Instalación de módulos preventivos de vacunación antirrábica gratuita para perros y gatos domésticos a partir de 1 mes de edad para crear una barrera inmunológica alrededor del Parque Urbano Kabah.',
    recommendations: [
      'Llevar perros con correa (y bozal si son reactivos) y gatos en transportadora segura.',
      'Conservar el comprobante oficial de vacunación para cualquier reporte o seguimiento sanitario.',
    ],
  },
];

export const KABAH_LANDMARKS: LandmarkPoint[] = [
  {
    id: 'lm-imss17',
    name: 'IMSS - HGR No. 17 (Urgencias 24h)',
    category: 'hospital',
    lat: 21.1312,
    lng: -86.8535,
    supermanzana: 'SM 509 / Límite SM 516',
    detail: 'Hospital General Regional No. 17 · Atención inmediata de mordeduras y profilaxis antirrábica.',
  },
  {
    id: 'lm-kabah',
    name: 'Parque Ecológico Kabah',
    category: 'parque',
    lat: 21.1415,
    lng: -86.8365,
    supermanzana: 'Reserva Kabah',
    detail: 'Área natural protegida urbana con presencia de coatíes, zorra gris, ardillas y aves.',
  },
  {
    id: 'lm-outlet',
    name: 'Las Plazas Outlet Cancún',
    category: 'comercio',
    lat: 21.1532,
    lng: -86.8428,
    supermanzana: 'SM 39 / Av. Andrés Q. Roo',
    detail: 'Referencia norte en el cruce de Av. Andrés Quintana Roo.',
  },
  {
    id: 'lm-paraiso',
    name: 'Paraíso Villas / Av. Cancún',
    category: 'vialidad',
    lat: 21.1292,
    lng: -86.8415,
    supermanzana: 'SM 51 / SM 56',
    detail: 'Zona habitacional al sur del Parque Kabah junto a Av. Cancún (Las Torres).',
  },
  {
    id: 'lm-rodrigo',
    name: 'Cruce Av. Rodrigo Gómez y Av. Cancún',
    category: 'vialidad',
    lat: 21.1268,
    lng: -86.8286,
    supermanzana: 'Vértice Sureste SM 56',
    detail: 'Vértice sureste del polígono rojo donde converge Av. Kabah con Av. Huayacán.',
  },
];
