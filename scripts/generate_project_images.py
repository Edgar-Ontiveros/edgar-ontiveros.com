#!/usr/bin/env python3
"""Genera las imágenes WebP de la sección Projects desde raw-assets/screenshots/.

Antes de exportar, PIXELA las zonas con datos de negocio reales (nombres de
clientes, montos, folios de factura) detectadas en la revisión manual de cada
captura; los originales de raw-assets/ quedan intactos. Produce dos tamaños en
public/images/projects/:
  <nombre>-thumb.webp (800px de ancho, para la retícula)
  <nombre>-large.webp (1600px de ancho, para el visor)

Correr tras cambiar capturas:  python3 scripts/generate_project_images.py
Las dimensiones impresas deben reflejarse en src/content/projects.ts.
Requiere: Pillow (pip install pillow).
"""

import os

from PIL import Image

SIZES = ((800, "thumb", 80), (1600, "large", 76))
SRC_DIR = "raw-assets/screenshots"
OUT_DIR = "public/images/projects"

# Cajas (x0, y0, x1, y1) en coordenadas del original (1601x817) sobre datos
# sensibles. Documentar aquí QUÉ tapa cada caja al agregar capturas nuevas.
REDACTIONS: dict[str, list[tuple[int, int, int, int]]] = {
    # KPI de ingreso confirmado + línea "Referencia (cotizadas hoy)" con montos.
    "cotizaciones-1-dashboard.png": [
        (1356, 124, 1578, 174),
        (326, 188, 516, 208),
    ],
    # Columna Cliente (empresas y personas) y columna Monto, cuerpo de la tabla.
    "cotizaciones-2-solicitudes.png": [
        (416, 202, 908, 812),
        (1296, 202, 1516, 812),
    ],
    # Nombre del proveedor en el título, nombres de archivo con folio de
    # factura, valores O.C./remisión/factura y columnas de importes
    # (TOTAL, COSTO) incluida la fila de totales.
    "ordenes-compra.png": [
        (381, 22, 500, 52),
        (322, 350, 668, 414),
        (371, 583, 447, 603),
        (547, 583, 585, 603),
        (695, 583, 744, 603),
        (1028, 648, 1288, 756),
    ],
}

SCREENSHOTS: list[tuple[str, str]] = [
    ("cotizaciones-1-dashboard.png", "quotes-dashboard"),
    ("cotizaciones-2-solicitudes.png", "quotes-requests"),
    ("cotizaciones-3-login.png", "quotes-login"),
    ("auto-precios.png", "pricing"),
    ("generador-codigos..png", "codegen"),
    ("ordenes-compra.png", "purchase-orders"),
]


def pixelate(image: Image.Image, box: tuple[int, int, int, int]) -> None:
    """Pixelado grueso e irreversible de la región (bloques de ~12px)."""
    region = image.crop(box)
    w, h = region.size
    small = region.resize((max(1, w // 12), max(1, h // 12)), Image.BILINEAR)
    image.paste(small.resize((w, h), Image.NEAREST), box)


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    total = 0
    for src, base in SCREENSHOTS:
        image = Image.open(f"{SRC_DIR}/{src}").convert("RGB")
        for box in REDACTIONS.get(src, []):
            pixelate(image, box)
        for width, suffix, quality in SIZES:
            height = round(width / image.width * image.height)
            resized = image.resize((width, height), Image.LANCZOS)
            out = f"{OUT_DIR}/{base}-{suffix}.webp"
            resized.save(out, "WEBP", quality=quality, method=6)
            size = os.path.getsize(out)
            total += size
            print(f"{base}-{suffix}.webp  {width}x{height}  {size / 1024:.0f} KB")
    print(f"TOTAL: {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
