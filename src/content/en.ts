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
  experience: {
    roles: [
      {
        id: 'herinox',
        company: 'Herinox',
        role: 'Data Scientist / ML Engineer',
        period: 'Apr 2026 – Present',
        location: 'Mexico',
        intro: "Building the internal software platform used across the company's 11 branches.",
        bullets: [
          'Design and ship full-stack internal tools — FastAPI, PostgreSQL and React + TypeScript — replacing manual Excel workflows for the sales, purchasing and pricing teams.',
          'Operate services on AWS EC2 with Docker, nginx and GitHub Actions; tests, linting and type checks gate every production release.',
          'Apply ML to operations: auto-generating SAP article codes from free-text descriptions (scikit-learn + fuzzy matching) and forecasting sales, demand and inventory across all branches.',
        ],
        technologies: ['FastAPI', 'PostgreSQL', 'React', 'AWS', 'Docker', 'scikit-learn'],
      },
      {
        id: 'safran-manufacturing',
        company: 'Safran Aerosystems',
        role: 'Manufacturing Engineer 4.0',
        period: 'Sep 2025 – Apr 2026',
        location: 'Chihuahua, MX',
        bullets: [
          'Built Python monitoring for automated production lines, flagging anomalies in live machine data before they reached scrap.',
          'Led an electric-torque automation project that replaced a manual tightening operation — digitized traceability and reduced torque-related defects.',
        ],
        technologies: ['Python', 'Industrial automation', 'Data monitoring'],
        photo: {
          alt: 'Electric-torque station on the production line: automated screwdriver, torque controller and station signage',
          caption: 'Electric-torque automation station — Safran Aerosystems',
          buttonLabel: 'View photo of the electric-torque station',
        },
      },
      {
        id: 'safran-intern',
        company: 'Safran Aerosystems',
        role: 'Project Engineer Intern',
        period: 'Nov 2024 – Jul 2025',
        location: 'Chihuahua, MX',
        bullets: [
          'Supported the industrial transfer of production lines from Niort, France — standardizing processes and automation for the new site.',
        ],
      },
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
    viewPdf: 'View PDF',
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
    lightbox: {
      close: 'Close viewer',
      previous: 'Previous',
      next: 'Next',
      of: 'of',
    },
    skipToContent: 'Skip to content',
  },
}
