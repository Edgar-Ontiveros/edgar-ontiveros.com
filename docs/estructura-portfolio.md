# edgar-ontiveros.com — Estructura y contenido v2

Dirección: **Constelación** · One-page EN/ES · React 19 + TypeScript + Vite + Tailwind v4 · Cloudflare Pages
Copy del sitio en inglés (idioma default); la versión ES se genera como espejo al construir.

---

## 0 · Header (fijo)

- Izquierda: monograma `EO·` en mono cian (favicon usa el mismo).
- Nav por anclas: About · Stack · Experience · Projects · Education · Research · Contact.
- Extremo derecho: toggle **EN/ES** + toggle **claro/oscuro**.
- Comportamiento: transparente sobre el hero; con scroll toma fondo `#0A0E1A` translúcido con borde inferior sutil. Ancla activa en cian. Móvil: menú de pantalla completa.

## 1 · Hero

- Fondo: canvas con el **grafo-constelación**. Los nodos son el stack real (Python, FastAPI, PostgreSQL, React, TypeScript, Docker, AWS, scikit-learn, TensorFlow, nginx, GitHub Actions, Pandas). Drift lento, enlaces por proximidad, atracción sutil al cursor; hover sobre un nodo ilumina sus conexiones. Con `prefers-reduced-motion`: constelación estática.
- Copy EN:
  - Eyebrow (mono): `PHYSICS ENGINEER · CHIHUAHUA, MX`
  - H1: **Edgar Ontiveros**
  - Typewriter (cian, cursor ámbar): `Machine Learning Engineer / Developer`
  - Frase de valor: *"I take systems from idea to production — the API, the data model, the interface, and the deploy."*
  - CTAs: **Get in touch** (primario) · **Download CV** (secundario) · iconos GitHub / LinkedIn.
- ES: typewriter `Ingeniero de Machine Learning / Developer`; frase: *"Llevo sistemas de la idea a producción — el API, el modelo de datos, la interfaz y el deploy."*

## 2 · About — `01`

- Layout: foto (la del CV) a la izquierda con marco sutil de nodos; texto a la derecha. Apilado en móvil.
- Copy EN:

> I'm a physics engineer who ended up doing what physicists do best: building models that have to survive contact with reality. Today that means production software — I design REST APIs in FastAPI, model data in PostgreSQL, build interfaces in React, and deploy on AWS with Docker and CI/CD. Machine learning goes in where it solves something real — forecasting, classification, similarity matching — always shipped as an application people use daily, never a notebook that stops at the analysis. Currently building the internal platform used across Herinox's 11 branches; previously, automation and production data systems in aerospace at Safran.

- Metric chips (3): `2+ years shipping` · `4 systems in production` · `11 branches served`
- Idiomas: se omiten en el sitio (quedan en el CV descargable).

## 3 · Stack — `02`

- Grid de categorías; **cada tecnología con su logo**: simple-icons (paquete npm, SVG inline) en monocromo tintado al tema, y color de marca o cian al hover. Si una marca no existe en simple-icons (p. ej. AWS), se usa un SVG local en `raw-assets/icons/`. Los conceptos sin marca (REST APIs, Forecasting) van como chip de texto sin logo.
- Etiqueta de nivel por tecnología: `daily` (cian) / `solid` (gris) / `learning` (ámbar). Sin barras de porcentaje.
- Categorías y etiquetas propuestas (ajustables en iteración):
  - **Backend & APIs**: Python (daily) · FastAPI (daily) · Pydantic (daily) · SQLAlchemy (daily) · Django (solid) · REST APIs (daily)
  - **Databases**: PostgreSQL (daily) · SQL (daily) · Alembic (solid) · SQLite (solid) · Supabase (solid)
  - **Cloud & DevOps**: Docker (daily) · AWS EC2/EBS (solid) · GitHub Actions (solid) · nginx (solid) · Linux (daily)
  - **Machine Learning & Data**: scikit-learn (solid) · TensorFlow/Keras (solid) · Pandas (daily) · NumPy (daily) · Forecasting (solid)
  - **Frontend**: React (daily) · TypeScript (daily) · Vite (daily) · Streamlit (solid)
  - **Testing & Quality**: pytest (daily) · ruff (daily) · mypy (solid) · Git (daily)
  - **BI & ERP**: Power BI (solid) · SAP (solid)

## 4 · Experience — `03`

Timeline vertical: línea con nodos cian, años grandes en mono, tags de stack por puesto.

**Apr 2026 – Present · Data Scientist / ML Engineer · Herinox — Mexico**
*Building the internal software platform used across the company's 11 branches.*
- Design and ship full-stack internal tools — FastAPI, PostgreSQL and React + TypeScript — replacing manual Excel workflows for the sales, purchasing and pricing teams.
- Operate services on AWS EC2 with Docker, nginx and GitHub Actions; tests, linting and type checks gate every production release.
- Apply ML to operations: auto-generating SAP article codes from free-text descriptions (scikit-learn + fuzzy matching) and forecasting sales, demand and inventory across all branches.
`FastAPI · PostgreSQL · React · AWS · Docker · scikit-learn`

**Sep 2025 – Apr 2026 · Manufacturing Engineer 4.0 · Safran Aerosystems — Chihuahua, MX**
- Built Python monitoring for automated production lines, flagging anomalies in live machine data before they reached scrap.
- Led an electric-torque automation project that replaced a manual tightening operation — digitized traceability and reduced torque-related defects.
- **Foto de torque, discreta**: thumbnail (~180 px) dentro de la tarjeta; click abre lightbox con caption *"Electric-torque automation station — Safran Aerosystems"*. En el build se encuadra el crop para dejar fuera a la persona del fondo.
`Python · Industrial automation · Data monitoring`

**Nov 2024 – Jul 2025 · Project Engineer Intern · Safran Aerosystems — Chihuahua, MX**
- Supported the industrial transfer of production lines from Niort, France — standardizing processes and automation for the new site.

## 5 · Projects — `04 · Production systems`

- Subtítulo de sección: *"Systems currently running in production."*
- Grid 2×2 (desktop). Cada tarjeta: screenshot con marco de navegador estilizado, nombre, 2 líneas problema→solución, chips y link a GitHub.

1. **Quotation Management System** — Internal platform for 11 branches: quote requests, business-hours SLA tracking across time zones, and quoted vs. confirmed revenue by branch, buyer, rep and client. Alembic migrations, background scheduler, pytest against real PostgreSQL, gated CI/CD deploys.
   `FastAPI · PostgreSQL 17 · React 19 · Docker · GitHub Actions`
2. **Automated Pricing Engine** — Turns SAP master data into branch price lists, cost sheets and variance reports under supplier-priority rules with fail-closed validation. Migrated from Streamlit to FastAPI + React, keeping the original as a parity test.
   `FastAPI · React · Pandas · Docker`
3. **SAP Article Code Generator** — Infers SAP code, product hierarchy, unit of measure and weight for new items from the most similar historical records. Multi-stage Docker build on EC2 with persistent EBS storage.
   `FastAPI · scikit-learn · RapidFuzz · AWS EC2/EBS`
4. **Purchase Order Processor** — Parses CFDI XML invoices and PDF proformas into SAP-ready Excel: unit conversion, line-item grouping, supplier-parser Protocol. Strict mypy and 97 tests.
   `FastAPI · Pydantic · lxml · pdfplumber`

- Screenshots: pendientes (guía ya entregada).

## 6 · Education & Certifications — `05`

- **B.Sc. in Physics Engineering** — Autonomous University of Chihuahua (2019–2024). Detalle: Vice President, Student Council.
- **Certifications**: grid de tarjetas compactas (emisor · nombre · año · link a credencial cuando exista). **Pendiente: lista del PDF de LinkedIn.**

## 7 · Research — `06`

Tres tarjetas horizontales (imagen izquierda, contenido derecha), cada una con evidencia:

1. **Early melanoma detection with AI** — 1st Scientific Research Summer, UACH (2023)
   Led a research project on early melanoma detection using convolutional neural networks — a VGG16 transfer-learning classifier over dermatoscopic images reaching an 88% F1-score. Presented at UACH.
   Imagen: foto presentando (la frontal). `TensorFlow/Keras · VGG16 · Deep learning`
2. **Fresnel coefficients for solar-panel optimization** — LXVII National Physics Congress, SMF (Oct 2024)
   Theoretical-experimental validation of Fresnel coefficients with a He-Ne laser, applied to anti-reflective coating design for solar panels. Presented as first author (poster, Optics session).
   Imagen: foto en el congreso. Botón: **View poster (PDF, Spanish)**. `Optics · Experimental physics`
3. **Raman spectroscopy for liquor quality control** — UACH → **[pendiente: año]**
   Quantified ethanol in six commercial liquors and screened for toxic alcohols (methanol, isopropanol) via Raman spectroscopy — calibration curves by linear regression (R² 0.997) validated label claims.
   Botón: **View poster (PDF, Spanish)**. `Spectroscopy · Data analysis · Regression`

Nota: el CNN vive solo aquí; no se repite en Projects.

## 8 · Contact — `07`

- Copy EN: *"Open to opportunities — if you're building something where machine learning meets production, let's talk."*
- Email grande clicable (`mailto:edgarontiverosfm@gmail.com`) + botones LinkedIn · GitHub · Download CV.
- Sin teléfono visible, sin formulario.

## 9 · Footer

`© 2026 Edgar Ontiveros · Built with React + Vite · Deployed on Cloudflare Pages` + mini-nav de anclas.

---

## Assets (raw-assets/)

Mapeo de insumos → uso en el sitio. Todo lo colocado aquí terminará publicado.

| Archivo | Uso |
|---|---|
| `cv/edgar-ontiveros-cv.pdf` | Botón Download CV (hero y contacto) |
| `photos/cv-photo.jpg` | About |
| `photos/safran-torque.jpg` | Tarjeta Safran (thumbnail + lightbox; crop excluye persona del fondo) |
| `photos/research-melanoma.jpg` | Tarjeta Research 1 |
| `photos/research-congress.jpg` | Tarjeta Research 2 |
| `posters/poster-fresnel.pdf` | Botón View poster (Research 2) |
| `posters/poster-raman.pdf` | Botón View poster (Research 3) |
| `screenshots/cotizaciones.png` · `auto-precios.png` · `generador-codigos.png` · `ordenes-compra.png` | Tarjetas de Projects |
| `certs/` | Certificaciones (cuando estén) |
| `icons/` | SVGs de marcas que falten en simple-icons (p. ej. AWS) |

Pipeline: los originales viven en `raw-assets/`; el build genera versiones optimizadas (WebP, tamaños responsivos) en `public/`.

## Transversal (calidad profesional)

- **i18n**: EN default con auto-detección de navegador; toggle ES persistido; `content/en.ts` + `content/es.ts` con el mismo type — TypeScript obliga a mantener ambos completos.
- **Temas**: oscuro default (Constelación) + claro espejo; `prefers-color-scheme` + toggle.
- **Accesibilidad WCAG AA**: contraste verificado en ambos temas, foco visible, navegación por teclado, alt text en todas las imágenes, `prefers-reduced-motion` respetado (grafo estático, sin typewriter en loop).
- **SEO / compartibilidad**: `<title>` "Edgar Ontiveros — Machine Learning Engineer / Developer", meta description, Open Graph + Twitter Card con og-image propia (1200×630 con la constelación), favicon monograma, sitemap y robots.
- **Performance**: imágenes en WebP con lazy loading, fuentes self-hosted con subset y `font-display: swap`, canvas pausado fuera del viewport y en pestañas inactivas. Objetivo Lighthouse 90+ móvil.

## Pendientes

| Ítem | Estado |
|---|---|
| PDF de LinkedIn (certificaciones) | Pendiente |
| Foto del CV en resolución original | Pendiente |
| Screenshots de los 4 proyectos | Pendiente |
| Año del trabajo de Raman | Pendiente |
| Foto torque Safran | ✔ Recibida |
| Fotos presentación melanoma + congreso | ✔ Recibidas |
| Pósters PDF (Fresnel, Raman) | ✔ Recibidos |
