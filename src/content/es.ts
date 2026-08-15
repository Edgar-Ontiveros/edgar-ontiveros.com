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
  projects: {
    subtitle: 'Sistemas corriendo en producción hoy.',
    internalTag: 'Proyecto interno',
    viewScreenshots: 'Ver capturas',
    viewRepo: 'Ver repositorio en GitHub',
    items: {
      quotes: {
        name: 'Sistema de Gestión de Cotizaciones',
        description:
          'Plataforma interna para 11 sucursales: solicitudes de cotización, seguimiento de SLA en horario hábil entre zonas horarias, e ingreso cotizado vs. confirmado por sucursal, comprador, vendedor y cliente.',
        detail:
          'Migraciones con Alembic, scheduler en segundo plano, pytest contra PostgreSQL real y deploys condicionados por CI/CD.',
        screenshots: [
          {
            alt: 'Dashboard del sistema de cotizaciones con indicadores de SLA, conversión e ingreso, y gráficas de tendencia semanal',
            caption: 'Dashboard de gestión',
          },
          {
            alt: 'Lista de solicitudes de cotización con folio, estado, banda de SLA, prioridad y monto por solicitud',
            caption: 'Seguimiento de solicitudes',
          },
          {
            alt: 'Pantalla de inicio de sesión del sistema de cotizaciones',
            caption: 'Inicio de sesión',
          },
        ],
      },
      pricing: {
        name: 'Motor Automático de Precios',
        description:
          'Convierte el maestro de SAP en listas de precios por sucursal, respaldos de costos y reportes de variaciones, con reglas de prioridad de proveedor y validación fail-closed.',
        detail:
          'Migrado de Streamlit a FastAPI + React, conservando el original como prueba de paridad.',
        screenshots: [
          {
            alt: 'Paso de carga del motor de precios: archivo maestro SAP y plantillas por sucursal, con el indicador de proceso en cuatro etapas',
            caption: 'Carga y validación de archivos',
          },
        ],
      },
      codegen: {
        name: 'Generador de Códigos de Artículo SAP',
        description:
          'Infere código SAP, jerarquía de producto, unidad de medida y peso de artículos nuevos a partir de los registros históricos más similares.',
        detail: 'Build de Docker multi-etapa en EC2 con almacenamiento persistente en EBS.',
        screenshots: [
          {
            alt: 'Generador de códigos con la descripción libre de un artículo, el código SAP inferido con 100% de confianza y los campos listos para el alta en SAP',
            caption: 'Generación de código desde una descripción',
          },
        ],
      },
      'purchase-orders': {
        name: 'Procesador de Órdenes de Compra',
        description:
          'Convierte facturas CFDI en XML y proformas en PDF en Excel listo para SAP: conversión de unidades, agrupado de partidas y Protocol de parsers por proveedor.',
        detail: 'mypy estricto y 97 tests.',
        screenshots: [
          {
            alt: 'Procesador de órdenes de compra con los archivos de factura cargados y la orden resultante agrupada por calibre, piezas y tarimas',
            caption: 'Procesamiento de factura a formato SAP',
          },
        ],
      },
    },
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
  research: {
    items: {
      melanoma: {
        title: 'Detección temprana de melanoma con IA',
        event: 'I Verano de Investigación Científica, UACH · 2023',
        description:
          'Lideré un proyecto de investigación sobre detección temprana de melanoma con redes neuronales convolucionales — un clasificador VGG16 con transfer learning sobre imágenes dermatoscópicas que alcanzó un F1-score de 88%. Presentado en la UACH.',
        tags: ['TensorFlow/Keras', 'VGG16', 'Deep learning'],
        media: [
          {
            label: 'Presentación',
            alt: 'Edgar presentando el proyecto de detección de melanoma en la UACH, junto al póster proyectado',
            title: 'Presentando el proyecto en la UACH',
            subtitle: 'I Verano de Investigación Científica · 2023',
          },
          {
            label: 'Reconocimiento',
            alt: 'Reconocimiento por la participación activa en el I Verano de Investigación Científica, otorgado por la Facultad de Ingeniería de la UACH',
            title: 'Reconocimiento — I Verano de Investigación Científica',
            subtitle: 'Facultad de Ingeniería, UACH · 2023',
          },
        ],
      },
      fresnel: {
        title: 'Coeficientes de Fresnel para optimización de paneles solares',
        event: 'LXVII Congreso Nacional de Física, SMF · Oct 2024',
        description:
          'Validación teórico-experimental de los coeficientes de Fresnel con un láser de He-Ne, aplicada al diseño de recubrimientos antirreflejantes para paneles solares. Presentado como primer autor (póster, sesión de Óptica).',
        tags: ['Óptica', 'Física experimental'],
        media: [
          {
            label: 'En el congreso',
            alt: 'Edgar presentando el póster de coeficientes de Fresnel a un asistente en el LXVII Congreso Nacional de Física',
            title: 'Sesión de pósters en el LXVII Congreso Nacional de Física',
            subtitle: 'Sociedad Mexicana de Física · Oct 2024',
          },
          {
            label: 'Póster',
            alt: 'Póster completo: análisis teórico-experimental de los coeficientes de Fresnel y su potencial aplicación en la optimización de paneles solares',
            title:
              'Análisis Teórico-Experimental de los Coeficientes de Fresnel y su Potencial Aplicación en la Optimización de Paneles Solares',
            subtitle: 'Póster · LXVII Congreso Nacional de Física · Oct 2024',
          },
          {
            label: 'Certificado',
            alt: 'Certificado de participación en el LXVII Congreso Nacional de Física, expedido por la Sociedad Mexicana de Física',
            title: 'Certificado de participación — LXVII Congreso Nacional de Física',
            subtitle: 'Sociedad Mexicana de Física · Oct 2024',
          },
          {
            label: 'Constancia de póster',
            alt: 'Constancia de la Sociedad Mexicana de Física que acredita la presentación del póster en la sesión de Óptica',
            title: 'Constancia de presentación de póster — sesión de Óptica',
            subtitle: 'Sociedad Mexicana de Física · Oct 2024',
          },
        ],
      },
      raman: {
        title: 'Espectroscopía Raman para control de calidad de licores',
        event: 'UACH',
        description:
          'Cuantifiqué etanol en seis licores comerciales y busqué alcoholes tóxicos (metanol, isopropanol) mediante espectroscopía Raman — curvas de calibración por regresión lineal (R² 0.997) que validaron lo declarado en las etiquetas.',
        tags: ['Espectroscopía', 'Análisis de datos', 'Regresión'],
        media: [
          {
            label: 'Póster',
            alt: 'Póster completo: cuantificación de etanol y detección de contaminantes tóxicos en licores comerciales mediante espectroscopía Raman',
            title:
              'Cuantificación de Etanol y Detección de Contaminantes Tóxicos en Licores Comerciales mediante Espectroscopía Raman',
            subtitle: 'Póster · UACH',
          },
        ],
      },
    },
  },
  contact: {
    blurb:
      'Abierto a oportunidades — si estás construyendo algo donde el machine learning se encuentra con producción, hablemos.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
  },
  footer: {
    navAriaLabel: 'Navegación del pie de página',
    tagline: 'Construido con React + Vite · Desplegado en Cloudflare Pages',
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
