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
    gallery: {
      close: 'Cerrar visor',
      previous: 'Certificado anterior',
      next: 'Certificado siguiente',
      viewPdf: 'Ver PDF',
      of: 'de',
    },
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
    skipToContent: 'Saltar al contenido',
  },
}
