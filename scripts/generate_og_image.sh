#!/usr/bin/env sh
# Genera public/og-image.png (1200x630) rasterizando scripts/og-image.html con
# Chrome headless, usando las fuentes self-hosted de node_modules (correr
# `npm install` antes). PNG y no WebP: varios previsualizadores de redes
# sociales aún no soportan WebP.
#
# Correr desde la raíz del repo:  sh scripts/generate_og_image.sh
set -e
google-chrome --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot=public/og-image.png \
  "file://$(pwd)/scripts/og-image.html"
ls -la public/og-image.png
