#!/usr/bin/env python3
"""Genera las vistas previas WebP de los certificados.

Rasteriza la primera página de cada PDF de public/certificaciones/ con
pdftoppm (poppler-utils) y produce dos tamaños en public/certificaciones/preview/:
  <nombre>-thumb.webp (600px de ancho, para la retícula)
  <nombre>-large.webp (1400px de ancho, para el visor)

Correr tras agregar certificados:  npm run certs:previews
Las dimensiones impresas deben reflejarse en src/content/certifications.ts.
Requiere: pdftoppm en PATH y Pillow (pip install pillow).
"""

import glob
import os
import subprocess

from PIL import Image

SIZES = ((600, "thumb", 78), (1400, "large", 74))
OUT_DIR = "public/certificaciones/preview"


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0
    for pdf in sorted(glob.glob("public/certificaciones/*.pdf")):
        base = os.path.splitext(os.path.basename(pdf))[0]
        for width, suffix, quality in SIZES:
            prefix = f"{OUT_DIR}/{base}-{suffix}"
            subprocess.run(
                ["pdftoppm", "-png", "-f", "1", "-l", "1",
                 "-scale-to-x", str(width), "-scale-to-y", "-1", pdf, prefix],
                check=True,
            )
            png = f"{prefix}-1.png"
            image = Image.open(png).convert("RGB")
            out = f"{prefix}.webp"
            image.save(out, "WEBP", quality=quality, method=6)
            os.remove(png)
            size = os.path.getsize(out)
            total += size
            print(f"{base}-{suffix}.webp  {image.size[0]}x{image.size[1]}  {size / 1024:.0f} KB")
    print(f"TOTAL: {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
