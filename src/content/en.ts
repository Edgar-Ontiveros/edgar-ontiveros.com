import type { SiteContent } from './types'

export const en: SiteContent = {
  nav: {
    ariaLabel: 'Main navigation',
    labels: {
      about: 'About',
      stack: 'Stack',
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      research: 'Research',
      contact: 'Contact',
    },
  },
  hero: {
    eyebrow: 'PHYSICS ENGINEER · CHIHUAHUA, MX',
    name: 'Edgar Ontiveros',
    tagline: 'Machine Learning Engineer / Developer',
    valueProp:
      'I take systems from idea to production — the API, the data model, the interface, and the deploy.',
    constellationLabel: 'Technologies in the constellation',
    ctaContact: 'Get in touch',
    ctaDownloadCv: 'Download CV',
    githubLabel: 'Edgar Ontiveros on GitHub',
    linkedinLabel: 'Edgar Ontiveros on LinkedIn',
    whatsappLabel: 'Edgar Ontiveros on WhatsApp',
    emailLabel: 'Email Edgar Ontiveros',
  },
  stack: {
    categories: {
      backend: 'Backend & APIs',
      databases: 'Databases',
      cloud: 'Cloud & DevOps',
      ml: 'Machine Learning & Data',
      frontend: 'Frontend',
      quality: 'Testing & Quality',
      bi: 'BI & ERP',
    },
  },
  about: {
    paragraphs: [
      "I'm a physics engineer who ended up doing what physicists do best: building models that have to survive contact with reality. Today that means production software — I design REST APIs in FastAPI, model data in PostgreSQL, build interfaces in React, and deploy on AWS with Docker and CI/CD.",
      'Machine learning goes in where it solves something real — forecasting, classification, similarity matching — always shipped as an application people use daily, never a notebook that stops at the analysis.',
      "Currently building the internal platform used across Herinox's 11 branches; previously, automation and production data systems in aerospace at Safran.",
    ],
    photoAlt: 'Portrait of Edgar Ontiveros',
    metrics: [
      { value: '2+', label: 'years shipping' },
      { value: '4', label: 'systems in production' },
      { value: '11', label: 'branches served' },
    ],
  },
  education: {
    entries: [
      {
        id: 'uach',
        institution: 'Autonomous University of Chihuahua',
        degree: 'B.Sc. in Physics Engineering',
        location: 'Chihuahua, MX',
        period: '2019–2024',
      },
    ],
    certificationsTitle: 'Certifications',
    opensPdf: 'opens PDF in a new tab',
  },
  contact: {
    blurb:
      "Open to opportunities — if you're building something where machine learning meets production, let's talk.",
    github: 'GitHub',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
  },
  ui: {
    themeToggle: {
      toLight: 'Switch to light theme',
      toDark: 'Switch to dark theme',
    },
    languageToggle: {
      label: 'Cambiar a español',
      code: 'ES',
    },
    menu: {
      open: 'Open menu',
      close: 'Close menu',
    },
    skipToContent: 'Skip to content',
  },
}
