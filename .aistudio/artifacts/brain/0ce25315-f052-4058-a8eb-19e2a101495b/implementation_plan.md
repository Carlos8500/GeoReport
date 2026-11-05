# RABIA-CUN: Vigilancia Sanitaria Geolocalizada y Arquitectura Híbrida (Polígono Kabah)

Plan de diseño, arquitectura y prototipo funcional para **RABIA-CUN**, una aplicación híbrida de vigilancia y alertas sanitarias geolocalizadas en Cancún, enfocada en el polígono de interés del **Parque Ecológico Kabah y Supermanzanas adyacentes (SM 48, 50, 51, 56, 516 y 523)**, acompañada de la guía de implementación técnica para **React Native (Expo), NestJS, PostGIS y Docker**.

---

## Decisiones Confirmadas y Respuestas Arquitectónicas

> [!IMPORTANT]
> **Decisiones de producto y arquitectura confirmadas para la construcción:**
> - **Alcance de la aplicación**: Prototipo interactivo completo (App Móvil Ciudadana + Consola de Revisión Sanitaria) integrado con un **Laboratorio de Arquitectura y Código (React Native + PostGIS + Docker)** listo para copiar y desplegar por el equipo del Instituto Tecnológico de Cancún.
> - **Geocerca Estricta (Polígono Rojo Kabah)**: El levantamiento de reportes valida en tiempo real mediante geometría espacial (*Point-in-Polygon*) que la coordenada seleccionada esté **dentro del triángulo trazado** entre Av. Andrés Quintana Roo, Av. Kabah (Rodrigo Gómez) y Av. Cancún (Las Torres). Si el usuario arrastra el mapa fuera del triángulo, el botón de envío se bloquea con un aviso claro de zona fuera de cobertura.
> - **Selector de Ubicación Estilo Uber con Radio de Privacidad**: En lugar de marcadores arrastrables imprecisos, el mapa se desplaza libremente debajo de una **mira/pin central fijo**, calculando automáticamente la Supermanzana correspondiente y aplicando un **círculo de privacidad aproximado (~150 m)** para cumplir con la regla de integridad de no exponer domicilios ni coordenadas exactas.

> [!NOTE]
> **¿Es necesario usar Docker para iPhones y tablets de cualquier marca?**
> - **En los dispositivos móviles (iPhone, iPad, tablets Android): NO se usa Docker.** Los sistemas operativos móviles (iOS/iPadOS y Android) no ejecutan contenedores Docker. Para que la app funcione en iPhones y tablets de cualquier marca se utiliza **React Native con Expo (Expo Go en desarrollo y EAS Build para generar el `.ipa` de iOS y `.apk`/`.aab` de Android)**.
> - **En el servidor Backend (VPS Linux): SÍ es altamente recomendable usar Docker Compose.** Docker empaqueta la API (**NestJS**), la base de datos geoespacial (**PostgreSQL + extensión PostGIS**) y el proxy HTTPS (**Caddy**) en el servidor de $200 MXN/mes, garantizando que cualquier integrante del equipo levante el backend con un solo comando (`docker compose up -d`) sin instalar PostGIS manualmente en cada computadora.

---

## 1. Visión General y Concepto Central

- **Qué hace**: Centraliza la vigilancia comunitaria y oficial sobre incidentes con fauna urbana y silvestre potencialmente riesgosa (avistamientos de zorra gris, coatíes, perros o gatos sin dueño con comportamiento errático, mordeduras o arañazos) dentro del corredor ecológico del **Parque Urbano Kabah** y sus zonas habitacionales colindantes.
- **Público Objetivo**:
  - *Ciudadanos y residentes de Cancún*: Consultan alertas oficiales vigentes, ubican zonas con reportes verificados, levantan reportes geolocalizados en pasos cortos y consultan el protocolo médico inmediato ante exposición (ej. acudir al **IMSS HGR No. 17** ubicado en el vértice suroeste del mismo polígono).
  - *Personal Administrador / Verificador*: Revisa los reportes ciudadanos entrantes, solicita aclaraciones, adjunta evidencia de fuentes oficiales (SESA / Dirección de Bienestar Animal) y cambia el estado entre `Reporte ciudadano`, `En revisión` y `Verificado por fuente oficial`.
  - *Equipo de Desarrollo (ITC)*: Consulta y copia la implementación exacta de `react-native-maps` / `MapLibre`, consultas espaciales PostGIS (`ST_Contains`, `ST_DWithin`) y el `docker-compose.yml` para producción.
- **Valor Principal**: Combina un flujo de mapeo intuitivo estilo Uber con validación espacial estricta sobre el polígono del Parque Kabah, diferenciando claramente entre reportes ciudadanos no confirmados y alertas sanitarias verificadas sin vulnerar la privacidad vecinal.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos de Usuario Principales
1. **Exploración del Mapa e Incidentes (Polígono Kabah)**:
   - El mapa interactivo muestra el **polígono triangular rojo** delimitado por:
     - **Vértice Norte**: Cruce Av. Xcaret / Av. Andrés Quintana Roo / Av. Kabah (`21.1538, -86.8355`).
     - **Vértice Sureste**: Cruce Av. Rodrigo Gómez (Kabah) y Av. Cancún / Av. Huayacán (`21.1268, -86.8286`).
     - **Vértice Suroeste**: Cruce Av. Andrés Quintana Roo y Av. Cancún / Las Torres (`21.1252, -86.8578`, junto al IMSS HGR No. 17).
   - Filtros superiores de una sola línea permiten segmentar por estado de verificación (`Todos`, `Verificados`, `En revisión`, `Reporte ciudadano`), especie (`Zorra gris`, `Perro`, `Gato`, `Fauna silvestre`) y tipo de evento.
   - Al tocar un marcador o su círculo de ubicación aproximada, se despliega la ficha detallada con fecha, categoría de integridad, descripción, recomendaciones y fuente.
2. **Reporte Ciudadano con Pin Central Fijo (Estilo Uber)**:
   - Al iniciar un reporte, el mapa entra en **Modo Selección Estilo Uber**: un pin fijo permanece al centro del visor con una animación de elevación mientras el usuario desplaza el mapa por debajo, acompañado de un círculo translúcido que representa el **radio de privacidad pública (150 m)**.
   - Un indicador en vivo ejecuta la validación geométrica:
     - **Dentro del polígono**: Muestra *"Ubicación válida · SM detectada (ej. SM 48 / Parque Kabah)"* y habilita el botón **"Confirmar ubicación aproximada"**.
     - **Fuera del polígono**: Muestra *"Fuera del polígono de vigilancia Kabah"* y deshabilita el avance hasta regresar dentro del área delimitada.
   - Confirmada la ubicación, el usuario completa un formulario breve: Tipo de evento (`Avistamiento`, `Mordedura`, `Arañazo`, `Comportamiento errático`), Especie observada, Fecha/hora aproximada, Descripción y Fotografía opcional de referencia, más la casilla de descargo sanitario.
3. **Revisión Administrativa y Estadísticas Descriptivas**:
   - Un conmutador en la barra de herramientas permite alternar hacia la **Vista Administrador (Revisión Sanitaria)** para auditar reportes pendientes, agregar el folio o enlace de la fuente oficial (SESA Quintana Roo / Ayuntamiento de Cancún) y promover un reporte a `Verificado por fuente oficial` o rechazarlo, actualizando el mapa y los gráficos descriptivos al instante.
4. **Alertas Sanitarias, Centro de Prevención y Guía Técnica RN + PostGIS**:
   - Pestañas dedicadas para consultar comunicados oficiales vigentes, guía de primeros auxilios ante mordedura (lavado 15 min con agua y jabón + traslado inmediato al IMSS HGR No. 17 en SM 509/516 o SESA) y una vista interactiva de **Arquitectura Técnica** con los bloques de código listos para React Native, NestJS + PostGIS y Docker Compose.

### Identidad Visual y Tema (Fiel al Brief RABIA-CUN)
- **Dirección Estética**: Utilitaria sanitaria, limpia, de alta legibilidad bajo luz solar y jerarquía institucional clara.
- **Paleta de Colores (Regla 60-30-10)**:
  - **60% Lienzo Neutro Claro**: Fondo principal en blanco cálido/gris clínico (`#F8FAFC`) y superficies de tarjetas en blanco puro (`#FFFFFF`) con bordes sutiles (`#E2E8F0`).
  - **30% Estructura Institucional**: Azul Petróleo (`#123047`) para navegación principal, encabezados y estructura de control.
  - **10% Presupuesto de Acento y Semántica**:
    - Turquesa (`#087E8B`) para acciones primarias, botones de confirmación y estado verificado.
    - Ámbar (`#E7A83E`) para alertas preventivas y registros en revisión.
    - Rojo Coral (`#DC2626`) exclusivamente para el trazo del polígono de interés y avisos de mordedura o alerta sanitaria crítica.
  - *Accesibilidad*: Ningún estado depende únicamente del color; cada estado incluye etiqueta textual clara e iconografía diferenciada (`Verificado Oficial`, `En Revisión`, `Reporte Ciudadano`).
- **Tipografía y Jerarquía (Regla 2+1)**:
  - *Display y Encabezados*: `Plus Jakarta Sans` (SemiBold/Bold) para títulos de sección y encabezados claros sin palabras huérfanas (`text-wrap: balance`).
  - *Cuerpo y Controles*: `Public Sans` para lectura rápida de fichas sanitarias, formularios y guías preventivas.
  - *Datos Geoespaciales y Métricas*: `JetBrains Mono` con `tabular-nums` para coordenadas truncadas, radios de privacidad, conteos estadísticos y fragmentos de código PostGIS/Docker.
- **Composición Espacial y Ergonomía**:
  - Diseño adaptable que en escritorio (1440px) presenta un **Workspace de Comando Sanitario** a pantalla completa (Mapa interactivo del Polígono Kabah a la izquierda + Panel contextual acoplado a la derecha con simulador móvil / fichas / formulario / código), y en pantallas móviles (390px) opera con barra inferior fija de 5 destinos (`Mapa`, `Reportar`, `Alertas`, `Prevención`, `Arquitectura`) respetando zonas de alcance del pulgar ($\ge 44\text{px}$ por botón) y menos del 15% de altura fija.

---

## 3. Decisiones Clave de Producto y Compensaciones (Trade-Offs)

- **Decisión 1: Selector por Mapa Desplazable con Pin Central Fijo (Estilo Uber) vs. Marcador Arrastrable**
  - *Enfoque elegido*: El mapa se mueve libremente y el pin permanece fijo en el centro del contenedor visual (`onMove` / `onRegionChangeComplete`), dibujando en tiempo real el radio de privacidad de 150 m.
  - *Por qué*: En pantallas táctiles (iPhone y tablets), arrastrar un pin pequeño con el dedo oculta el punto exacto bajo la yema del dedo. El patrón de Uber permite precisión milimétrica, feedback inmediato al cruzar el borde del polígono rojo y una experiencia fluida tanto en web como en React Native.
- **Decisión 2: Ofuscación Geoespacial (Radio de Privacidad de ~150 m) vs. Coordenada Exacta Pública**
  - *Enfoque elegido*: Al guardar un reporte, la coordenada pública se redondea/desplaza ligeramente dentro de su celda de privacidad (~150 m) y se representa con un círculo de zona aproximada en lugar de señalar una casa específica.
  - *Por qué*: Cumple estrictamente la **Regla de Integridad** de la página 2 del Brief (*"Las ubicaciones públicas serán aproximadas... No se publicarán nombres, domicilios ni coordenadas sensibles"*).
- **Decisión 3: Validación Dual del Polígono (Cliente con Ray-Casting + Servidor con PostGIS `ST_Contains`)**
  - *Enfoque elegido*: Validar instantáneamente en la interfaz mientras el usuario mueve el mapa (usando el algoritmo geométrico *Point-in-Polygon* sobre los 3 vértices del triángulo Kabah) y documentar la validación gemela en PostgreSQL/PostGIS (`ST_Contains(zona.geom, ST_SetSRID(ST_MakePoint(lng, lat), 4326))`).
  - *Por qué*: La validación en el cliente da respuesta en 0 ms al mover el mapa, mientras que PostGIS en el backend garantiza que nadie pueda inyectar reportes fuera del área mediante llamadas directas a la API.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama de Arquitectura del Sistema e Interacción de Componentes

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                   BARRA SUPERIOR (3 ZONAS: Marca · Vistas · Acción)                  │
│   [RABIA-CUN Cancún]     [Mapa Kabah | Alertas | Prevención | Estadísticas | Guía]   │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
         ┌─────────────────────────────────┴──────────────────────────────────┐
         ▼                                                                    ▼
┌─────────────────────────────────────────┐        ┌───────────────────────────────────┐
│   VISOR GEOESPACIAL POLÍGONO KABAH      │        │   PANEL OPERATIVO Y SIMULADOR     │
│  ┌───────────────────────────────────┐  │        │  ┌─────────────────────────────┐  │
│  │ Triángulo Rojo (Vértices Kabah)   │  │        │  │ 1. Ficha / Lista Incidentes │  │
│  │ • N: Av. Xcaret / Q. Roo          │  │◄──────►│  │ 2. Asistente Reporte (Uber) │  │
│  │ • SE: Av. Rodrigo Gómez / Cancún  │  │ Sincr. │  │ 3. Consola Admin Revisión   │  │
│  │ • SO: Av. Q. Roo / Las Torres     │  │ Estado │  │ 4. Alertas y Prevención     │  │
│  └───────────────────────────────────┘  │        │  │ 5. Estadísticas Descriptivas│  │
│  ┌───────────────────────────────────┐  │        │  └─────────────────────────────┘  │
│  │ Mira Central Fija (Modo Uber)     │  │        │  ┌─────────────────────────────┐  │
│  │ + Círculo Privacidad (150m)       │  │        │  │ Laboratorio Técnico RN:     │  │
│  │ + Validador Point-in-Polygon      │  │        │  │ • Código React Native Maps  │  │
│  └───────────────────────────────────┘  │        │  │ • SQL PostGIS ST_Contains   │  │
└─────────────────────────────────────────┘        │  │ • Docker Compose VPS Linux  │  │
                                                   └───────────────────────────────────┘
```

### Modelo de Datos y Entidades Principales
- **`GeofencePolygon` (Polígono Kabah)**: Identificador de zona, nombre (`Corredor Parque Ecológico Kabah - SM 48/50/51/56/516/523`), arreglo de coordenadas `[lat, lng]` de los 3 vértices del triángulo rojo, y puntos de referencia médicos cercanos (`IMSS HGR No. 17`, `Parque Ecológico Kabah`).
- **`IncidentReport` (Reporte / Incidente)**:
  - `id`: Folio único (`CUN-2026-XXXX`).
  - `eventType`: `'avistamiento' | 'mordedura' | 'aranazo' | 'comportamiento_erratico'`.
  - `species`: `'zorra_gris' | 'perro' | 'gato' | 'coati_mapache' | 'murcielago'`.
  - `verificationStatus`: `'reporte_ciudadano' | 'en_revision' | 'verificado_oficial' | 'rechazado'`.
  - `approxLat` / `approxLng`: Coordenadas con ofuscación de privacidad dentro del polígono.
  - `privacyRadiusMeters`: `150` (radio público aproximado).
  - `supermanzana`: Zona detectada automáticamente (`SM 48`, `SM 50`, `SM 51`, `SM 56`, `SM 516`, `SM 523`, `Parque Ecológico Kabah`).
  - `description`, `reportedAt`, `photoUrl` (opcional), `officialSource` (obligatorio cuando pasa a `verificado_oficial`, ej. *"SESA Q. Roo · Folio Epidemiológico"*).
- **`HealthAlert` (Alerta Sanitaria Oficial)**: Título, nivel de atención, fecha de emisión, vigencia, Supermanzanas comprendidas, fuente verificable y lista de acciones preventivas.

### Mapeo de Componentes Interactivos y Transiciones de Estado
- **Motor Geométrico Puro (Desacoplado y Verificable con Pruebas Unitarias)**:
  - Función `isPointInKabahPolygon(lat, lng)` basada en *Ray-Casting* sobre los vértices exactos del triángulo adjunto por el usuario.
  - Función `detectSupermanzana(lat, lng)` que asigna automáticamente la Supermanzana o sector dentro del triángulo según la posición del pin.
  - Función `applyPrivacyJitter(lat, lng)` que trunca y aplica el radio de privacidad para proteger domicilios particulares.
- **Flujo Completo de Creación y Moderación**:
  - Al mover el mapa en modo reporte, el estado `draftLocation` actualiza en vivo las coordenadas, la Supermanzana detectada y el booleano `isInsideGeofence`.
  - Al enviar el formulario validado, el nuevo registro se inserta en el almacén de incidentes con estado inicial `en_revision` (o `reporte_ciudadano`), aparece inmediatamente como marcador y círculo en el mapa del Polígono Kabah, incrementa los contadores de **Estadísticas Descriptivas** y queda disponible en la **Consola de Revisión** para que el administrador lo apruebe con fuente oficial o lo filtre.
