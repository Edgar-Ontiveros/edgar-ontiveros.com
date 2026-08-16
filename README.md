# edgar-ontiveros.com

Portafolio personal one-page — tema "Constelación". React 19 + TypeScript +
Vite + Tailwind CSS v4, bilingüe EN/ES, tema oscuro/claro.

## Desarrollo

```bash
npm install
npm run dev
```

| Comando           | Descripción                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Servidor de desarrollo       |
| `npm run build`   | Type-check + build (`dist/`) |
| `npm run preview` | Sirve el build de producción |
| `npm run lint`    | ESLint                       |
| `npm run format`  | Prettier                     |

La estructura y el contenido del sitio están documentados en
`docs/estructura-portfolio.md`; las convenciones de desarrollo, en `CLAUDE.md`.

## Despliegue (Cloudflare Pages)

| Ajuste               | Valor                                           |
| -------------------- | ----------------------------------------------- |
| Comando de build     | `npm run build`                                 |
| Directorio de salida | `dist`                                          |
| Versión de Node      | `24.18.0` (leída de `.nvmrc`)                   |
| Dominio              | `https://edgar-ontiveros.com` (apex, sin `www`) |

- Es un one-page sin router: **no hace falta configuración de SPA** ni
  `_redirects`; el 404 por defecto para rutas inexistentes es correcto.
- `public/_headers` define las cabeceras de seguridad (incl. CSP) y la
  política de caché: assets con hash de Vite inmutables por un año,
  `index.html` sin caché para que los deploys se reflejen al instante.
- **CSP**: el `script-src` autoriza el script inline de tema/idioma de
  `index.html` por hash SHA-256. Si ese script cambia (¡incluido un
  reformateo!), hay que recalcular el hash tras `npm run build`:

  ```bash
  python3 -c "import hashlib,re,base64; s=re.search(r'<script>(.*?)</script>', open('dist/index.html').read(), re.S).group(1); print('sha256-'+base64.b64encode(hashlib.sha256(s.encode()).digest()).decode())"
  ```

  y reemplazarlo en `public/_headers`.

## Regeneración de assets

El material fuente vive en `raw-assets/` (local, **no versionado**; ver
`CLAUDE.md`). Los assets publicados en `public/` se regeneran con:

| Script                                        | Genera                                              |
| --------------------------------------------- | --------------------------------------------------- |
| `python3 scripts/generate_project_images.py`  | Capturas de Projects (sanea datos sensibles + WebP) |
| `python3 scripts/generate_research_images.py` | Pósters, constancias y fotos de Research            |
| `python3 scripts/generate_org_logos.py`       | Logos de empresas/institución (placa blanca, WebP)  |
| `npm run certs:previews`                      | Vistas previas de certificaciones                   |
| `sh scripts/generate_og_image.sh`             | `public/og-image.png` (Open Graph, 1200×630)        |

Requisitos: Pillow (`pip install pillow`), `pdftoppm` (poppler-utils) y
Google Chrome (para la og:image).
