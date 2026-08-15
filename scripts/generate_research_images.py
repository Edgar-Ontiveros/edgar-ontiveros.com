#!/usr/bin/env python3
"""Genera las imágenes WebP de la sección Research desde raw-assets/.

Produce en public/images/research/ dos tamaños por asset (miniatura para la
tarjeta, grande para el visor):
  - Pósters (PDF A0): rasterizados con pdftoppm a 600px y 2000px de ancho,
    PIXELANDO los correos institucionales de los autores (contienen la
    matrícula) en cabecera y pie. Los PDFs originales quedan intactos y NO se
    publican.
  - Constancias (PNG): tamaño nativo como grande (no se escala hacia arriba)
    y miniatura de hasta 600px.
  - Fotos (JPEG): miniatura de 600px y grande al ancho nativo.

Correr tras cambiar insumos:  python3 scripts/generate_research_images.py
Las dimensiones impresas deben reflejarse en src/content/research.ts.
Requiere: pdftoppm en PATH y Pillow (pip install pillow).
"""

import os
import subprocess

from PIL import Image

OUT_DIR = "public/images/research"

# Cajas (x0, y0, x1, y1) RELATIVAS al tamaño de la página, sobre los correos
# con matrícula: línea de autores en la cabecera y franjas del pie.
POSTER_REDACTIONS: dict[str, list[tuple[float, float, float, float]]] = {
    "poster-raman.pdf": [
        (0.25, 0.0880, 0.75, 0.1060),
        (0.0, 0.978, 0.145, 1.0),
        (0.855, 0.978, 1.0, 1.0),
    ],
    "poster-fresnel.pdf": [
        (0.25, 0.0880, 0.75, 0.1060),
        (0.0, 0.978, 0.145, 1.0),
        (0.855, 0.978, 1.0, 1.0),
    ],
}

POSTERS = [
    ("raw-assets/posters/poster-fresnel.pdf", "poster-fresnel"),
    ("raw-assets/posters/poster-raman.pdf", "poster-raman"),
]

CREDENTIALS = [
    ("raw-assets/credentials/congreso-fisica-certificado.png", "congreso-certificado"),
    ("raw-assets/credentials/ongreso-fisica-constancia-poster.png", "congreso-constancia-poster"),
    ("raw-assets/credentials/verano-investigacion-reconocimiento.png", "verano-reconocimiento"),
]

PHOTOS = [
    ("raw-assets/photos/research-melanoma.jpeg", "melanoma-presentacion"),
    ("raw-assets/photos/research-congress.jpeg", "congreso-presentacion"),
]

total = 0


def pixelate(image: Image.Image, box: tuple[float, float, float, float]) -> None:
    """Pixelado grueso e irreversible de una región relativa (bloques ~1/90 del ancho)."""
    w, h = image.size
    absolute = (round(box[0] * w), round(box[1] * h), round(box[2] * w), round(box[3] * h))
    region = image.crop(absolute)
    rw, rh = region.size
    block = max(2, w // 90)
    small = region.resize((max(1, rw // block), max(1, rh // block)), Image.BILINEAR)
    image.paste(small.resize((rw, rh), Image.NEAREST), absolute)


def save(image: Image.Image, base: str, suffix: str, quality: int) -> None:
    global total
    out = f"{OUT_DIR}/{base}-{suffix}.webp"
    image.save(out, "WEBP", quality=quality, method=6)
    size = os.path.getsize(out)
    total += size
    print(f"{base}-{suffix}.webp  {image.size[0]}x{image.size[1]}  {size / 1024:.0f} KB")


def render_pdf(pdf: str, width: int) -> Image.Image:
    prefix = f"{OUT_DIR}/.render"
    subprocess.run(
        ["pdftoppm", "-png", "-f", "1", "-l", "1",
         "-scale-to-x", str(width), "-scale-to-y", "-1", pdf, prefix],
        check=True,
    )
    png = f"{prefix}-1.png"
    image = Image.open(png).convert("RGB")
    os.remove(png)
    return image


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    # El grande a 2000px mantiene el póster legible al ampliarlo en el visor.
    for pdf, base in POSTERS:
        for width, suffix, quality in ((600, "thumb", 78), (2000, "large", 72)):
            image = render_pdf(pdf, width)
            for box in POSTER_REDACTIONS[os.path.basename(pdf)]:
                pixelate(image, box)
            save(image, base, suffix, quality)
    for src, base in CREDENTIALS:
        image = Image.open(src).convert("RGB")
        save(image, base, "large", 80)
        if image.width > 600:
            thumb = image.resize((600, round(600 / image.width * image.height)), Image.LANCZOS)
        else:
            thumb = image
        save(thumb, base, "thumb", 80)
    for src, base in PHOTOS:
        image = Image.open(src).convert("RGB")
        save(image, base, "large", 75)
        thumb = image.resize((600, round(600 / image.width * image.height)), Image.LANCZOS)
        save(thumb, base, "thumb", 78)
    print(f"TOTAL: {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
