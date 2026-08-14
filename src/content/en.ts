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
    ctaContact: 'Get in touch',
    ctaDownloadCv: 'Download CV',
    githubLabel: 'Edgar Ontiveros on GitHub',
    linkedinLabel: 'Edgar Ontiveros on LinkedIn',
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
