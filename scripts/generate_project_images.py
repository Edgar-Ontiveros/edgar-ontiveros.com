#!/usr/bin/env python3
"""Genera las imágenes WebP de la sección Projects desde raw-assets/screenshots/.

Antes de exportar, PIXELA las zonas con datos de negocio reales (nombres de
clientes, montos, folios de factura) detectadas en la revisión manual de cada
captura; los originales de raw-assets/ quedan intactos. Produce dos tamaños en
public/images/projects/:
  <nombre>-thumb.webp (800px de ancho, para la retícula)
  <nombre>-large.webp (1600px de ancho, para el visor)
Las capturas más angostas que esos anchos (p. ej. móvil) no se amplían.
Los originales ausentes en raw-assets/ se omiten con aviso.

Correr tras cambiar capturas:  python3 scripts/generate_project_images.py
Las dimensiones impresas deben reflejarse en src/content/projects.ts.
Requiere: Pillow (pip install pillow).
"""

import os

from PIL import Image

SIZES = ((800, "thumb", 80), (1600, "large", 76))
SRC_DIR = "raw-assets/screenshots"
OUT_DIR = "public/images/projects"

# Cajas (x0, y0, x1, y1) en coordenadas del original de cada captura sobre
# datos sensibles. Documentar aquí QUÉ tapa cada caja al agregar capturas nuevas.
REDACTIONS: dict[str, list[tuple[int, int, int, int]]] = {
    # Dashboard de cotizaciones (1600x764): valor del KPI "Confirmado (MXN)" y
    # su línea "origen" con importes MXN/USD; montos de la línea "Referencia
    # (cotizadas hoy)". Las métricas operativas (conteos, horas, %) quedan.
    "cotizaciones-1-tablero.jpg": [
        (1372, 110, 1590, 158),
        (302, 172, 492, 192),
    ],
    # Pedidos en SAP (1600x791): columna "Folio · cliente" completa (los folios
    # tienen ancho variable y el nombre del cliente arranca pegado a ellos) y
    # columna "OC(s)" con números de orden de compra de SAP, incluida la fila
    # con cuatro OC.
    "cotizaciones-2-pedido-oc.jpg": [
        (152, 128, 540, 788),
        (626, 128, 800, 788),
    ],
    # Solicitudes (1600x782): columna Cliente (empresas y personas) y columna
    # Monto con importes de referencia.
    "cotizaciones-3-solicitudes.jpg": [
        (402, 208, 760, 780),
        (1300, 208, 1440, 780),
    ],
    # Panel de comprador con notificaciones (1600x736): nombre del usuario en
    # la cabecera, columna Cliente y el número de OC de SAP citado en la
    # notificación de recepción parcial.
    "cotizaciones-4-notificaciones.jpg": [
        (1455, 16, 1548, 40),
        (298, 338, 700, 700),
        (1126, 404, 1202, 427),
    ],
    # cotizaciones-5-movil.jpg: pantalla de acceso, sin datos de negocio.
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
    ("cotizaciones-1-tablero.jpg", "quotes-1-dashboard"),
    ("cotizaciones-2-pedido-oc.jpg", "quotes-2-order-po"),
    ("cotizaciones-3-solicitudes.jpg", "quotes-3-requests"),
    ("cotizaciones-4-notificaciones.jpg", "quotes-4-notifications"),
    ("cotizaciones-5-movil.jpg", "quotes-5-mobile"),
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
        path = f"{SRC_DIR}/{src}"
        if not os.path.exists(path):
            # Los originales no viajan entre máquinas: se regeneran solo las
            # capturas cuyo original esté disponible localmente.
            print(f"{base}: sin original en {SRC_DIR}, se omite")
            continue
        image = Image.open(path).convert("RGB")
        for box in REDACTIONS.get(src, []):
            pixelate(image, box)
        for target, suffix, quality in SIZES:
            # Nunca se amplía: capturas más angostas que el objetivo (móvil)
            # conservan su ancho nativo.
            width = min(target, image.width)
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
