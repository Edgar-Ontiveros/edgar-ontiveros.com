import type { SiteContent } from './types'

export const es: SiteContent = {
  nav: {
    ariaLabel: 'Navegación principal',
    labels: {
      about: 'Sobre mí',
      stack: 'Stack',
      experience: 'Experiencia',
      projects: 'Proyectos',
      education: 'Educación',
      research: 'Investigación',
      contact: 'Contacto',
    },
  },
  hero: {
    eyebrow: 'INGENIERO FÍSICO · CHIHUAHUA, MX',
    name: 'Edgar Ontiveros',
    tagline: 'Ingeniero de Machine Learning / Developer',
    valueProp:
      'Llevo sistemas de la idea a producción — el API, el modelo de datos, la interfaz y el deploy.',
    constellationLabel: 'Tecnologías de la constelación',
    ctaContact: 'Contáctame',
    ctaDownloadCv: 'Descargar CV',
    githubLabel: 'Edgar Ontiveros en GitHub',
    linkedinLabel: 'Edgar Ontiveros en LinkedIn',
    whatsappLabel: 'Edgar Ontiveros en WhatsApp',
    emailLabel: 'Escribir a Edgar Ontiveros',
  },
  stack: {
    categories: {
      backend: 'Backend y APIs',
      databases: 'Bases de datos',
      cloud: 'Cloud y DevOps',
      ml: 'Machine Learning y datos',
      frontend: 'Frontend',
      quality: 'Testing y calidad',
      bi: 'BI y ERP',
    },
  },
  about: {
    paragraphs: [
      'Soy ingeniero físico y terminé haciendo lo que mejor hacen los físicos: construir modelos que tienen que sobrevivir al contacto con la realidad. Hoy eso significa software en producción — diseño APIs REST en FastAPI, modelo datos en PostgreSQL, construyo interfaces en React y despliego en AWS con Docker y CI/CD.',
      'El machine learning entra donde resuelve algo real — forecasting, clasificación, similarity matching — siempre entregado como una aplicación que la gente usa a diario, nunca un notebook que se queda en el análisis.',
      'Actualmente construyo la plataforma interna que usan las 11 sucursales de Herinox; antes, automatización y sistemas de datos de producción en la industria aeroespacial, en Safran.',
    ],
    photoAlt: 'Retrato de Edgar Ontiveros',
    metrics: [
      { value: '2+', label: 'años entregando software' },
      { value: '4', label: 'sistemas en producción' },
      { value: '11', label: 'sucursales atendidas' },
    ],
  },
  experience: {
    roles: [
      {
        id: 'herinox',
        company: 'Herinox',
        role: 'Data Scientist / ML Engineer',
        period: 'Abr 2026 – Actual',
        location: 'México',
        intro:
          'Construyendo la plataforma interna de software que usan las 11 sucursales de la empresa.',
        bullets: [
          'Diseño y entrego herramientas internas full-stack — FastAPI, PostgreSQL y React + TypeScript — que reemplazan flujos manuales de Excel para los equipos de ventas, compras y precios.',
          'Opero los servicios en AWS EC2 con Docker, nginx y GitHub Actions; tests, linting y chequeo de tipos condicionan cada release a producción.',
          'Aplico ML a la operación: generación automática de códigos de artículo SAP a partir de descripciones libres (scikit-learn + fuzzy matching) y forecasting de ventas, demanda e inventario en todas las sucursales.',
        ],
        technologies: ['FastAPI', 'PostgreSQL', 'React', 'AWS', 'Docker', 'scikit-learn'],
      },
      {
        id: 'safran-manufacturing',
        company: 'Safran Aerosystems',
        role: 'Ingeniero de Manufactura 4.0',
        period: 'Sep 2025 – Abr 2026',
        location: 'Chihuahua, MX',
        bullets: [
          'Construí monitoreo en Python para líneas de producción automatizadas, señalando anomalías en datos de máquina en vivo antes de que llegaran a scrap.',
          'Lideré un proyecto de automatización de torque eléctrico que reemplazó una operación manual de apriete — trazabilidad digitalizada y menos defectos de torque.',
        ],
        technologies: ['Python', 'Industrial automation', 'Data monitoring'],
        photo: {
          alt: 'Estación de torque eléctrico en la línea de producción: atornillador automatizado, controlador de torque y señalización de la estación',
          caption: 'Estación de automatización de torque eléctrico — Safran Aerosystems',
          buttonLabel: 'Ver foto de la estación de torque eléctrico',
        },
      },
      {
        id: 'safran-intern',
        company: 'Safran Aerosystems',
        role: 'Practicante de Ingeniería de Proyectos',
        period: 'Nov 2024 – Jul 2025',
        location: 'Chihuahua, MX',
        bullets: [
          'Apoyé la transferencia industrial de líneas de producción desde Niort, Francia — estandarizando procesos y automatización para la nueva planta.',
        ],
      },
    ],
  },
  education: {
    entries: [
      {
        id: 'uach',
        institution: 'Universidad Autónoma de Chihuahua',
        degree: 'Licenciatura en Ingeniería Física',
        location: 'Chihuahua, MX',
        period: '2019–2024',
      },
    ],
    certificationsTitle: 'Certificaciones',
    opensPdf: 'abre el PDF en una pestaña nueva',
    viewPdf: 'Ver PDF',
  },
  contact: {
    blurb:
      'Abierto a oportunidades — si estás construyendo algo donde el machine learning se encuentra con producción, hablemos.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
  },
  ui: {
    themeToggle: {
      toLight: 'Cambiar a tema claro',
      toDark: 'Cambiar a tema oscuro',
    },
    languageToggle: {
      label: 'Switch to English',
      code: 'EN',
    },
    menu: {
      open: 'Abrir menú',
      close: 'Cerrar menú',
    },
    lightbox: {
      close: 'Cerrar visor',
      previous: 'Anterior',
      next: 'Siguiente',
      of: 'de',
    },
    skipToContent: 'Saltar al contenido',
  },
}
