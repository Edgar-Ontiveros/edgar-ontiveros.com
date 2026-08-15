/**
 * Vocabulario de tecnologías del grafo-constelación del hero. Son nombres de
 * tecnologías: no se traducen, por eso viven fuera de en.ts/es.ts.
 *
 * Es un vocabulario, no un conteo de nodos: el canvas crea nodos según la
 * densidad del área y reparte estas etiquetas cíclicamente (pueden repetirse).
 * También alimenta la lista sr-only accesible del Hero (sin duplicados).
 */
export const CONSTELLATION_TECHNOLOGIES = [
  // Backend & APIs
  'Python',
  'FastAPI',
  'Django',
  'Pydantic',
  'SQLAlchemy',
  'Alembic',
  'REST API',
  'Uvicorn',
  'SQLModel',
  'Node.js',
  // Datos
  'PostgreSQL',
  'SQL',
  'SQLite',
  'Supabase',
  // Cloud & DevOps
  'Docker',
  'Docker Compose',
  'Kubernetes',
  'AWS',
  'GitHub Actions',
  'CI/CD',
  'nginx',
  'Linux',
  'Bash',
  'Git',
  // Machine Learning & Data
  'scikit-learn',
  'TensorFlow',
  'Keras',
  'Pandas',
  'NumPy',
  'Matplotlib',
  'Jupyter',
  'Forecasting',
  'RapidFuzz',
  // Frontend
  'React',
  'TypeScript',
  'JavaScript',
  'Vite',
  'Tailwind CSS',
  'Streamlit',
  // Calidad & herramientas
  'pytest',
  'ruff',
  'mypy',
  // BI & ERP
  'Power BI',
  'SAP',
] as const
