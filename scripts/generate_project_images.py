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

# Tamaño de bloque del pixelado por defecto (texto ilegible, textura visible).
BLOCK = 12
# Bloque "infinito": la caja queda como un color plano (promedio de la zona).
# Para barras de gráficas, semáforos y texto coloreado, donde la longitud o el
# color pixelado seguirían delatando el resultado por sucursal.
FLAT = 100_000

# Cajas (x0, y0, x1, y1[, bloque]) en coordenadas del original de cada captura
# sobre datos sensibles. Documentar aquí QUÉ tapa cada caja al agregar
# capturas nuevas.
Box = tuple[int, int, int, int] | tuple[int, int, int, int, int]
REDACTIONS: dict[str, list[Box]] = {
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
    #
    # Tablero del Director de ventas (871x889): valor, variación y % de los
    # KPI Venta sin IVA, Margen bruto, Clientes nuevos y Facturas; ejes
    # numéricos de las gráficas Venta sin IVA, Margen bruto y Utilidad
    # operativa (pesos) y de Clientes nuevos (conteo). Sucursales quedan.
    "reporte-ventas-1-tablero.jpg": [
        (26, 354, 176, 390, FLAT),
        (196, 354, 346, 392, FLAT),
        (366, 354, 516, 402, FLAT),
        (536, 354, 686, 390, FLAT),
        (26, 494, 68, 634),
        (454, 494, 496, 634),
        (26, 722, 68, 864),
        (450, 722, 498, 864),
    ],
    # Presupuesto (766x868): resumen "N de 10 sucursales arriba de la meta",
    # barras y % de cumplimiento por sucursal, tabla lateral (cumplimiento,
    # presupuesto, venta real, variación), línea de totales globales y el
    # cuerpo de la tabla inferior (semáforo, presupuestos, ventas, diferencia,
    # días de venta). Solo quedan los nombres de sucursal y las cabeceras.
    "reporte-ventas-2-presupuesto.jpg": [
        (148, 279, 340, 295),
        (108, 326, 374, 530, FLAT),
        (418, 326, 754, 530, FLAT),
        (16, 564, 640, 582, FLAT),
        (124, 630, 756, 830, FLAT),
    ],
    # Precio–volumen (772x868): "N de 10 sucursales crecieron", eje en pesos,
    # barras y etiquetas de venta por sucursal, % de variación bajo cada
    # sucursal y el cuerpo de la tabla (ventas, variación, kilos, $/KG).
    "reporte-ventas-3-vs-anio.jpg": [
        (426, 344, 548, 359),
        (24, 386, 754, 547, FLAT),
        (24, 556, 754, 571, FLAT),
        (174, 626, 772, 844, FLAT),
    ],
    # Tablero del Director en móvil (739x1600): valor y variación de los KPI
    # Venta sin IVA, Margen bruto, Clientes nuevos y Facturas.
    "reporte-ventas-4-movil.jpg": [
        (48, 830, 348, 912, FLAT),
        (398, 800, 692, 884, FLAT),
        (48, 1122, 348, 1238, FLAT),
        (398, 1122, 692, 1208, FLAT),
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
    ("reporte-ventas-1-tablero.jpg", "sales-1-dashboard"),
    ("reporte-ventas-2-presupuesto.jpg", "sales-2-budget"),
    ("reporte-ventas-3-vs-anio.jpg", "sales-3-yoy"),
    ("reporte-ventas-4-movil.jpg", "sales-4-mobile"),
    ("cotizaciones-1-tablero.jpg", "quotes-1-dashboard"),
    ("cotizaciones-2-pedido-oc.jpg", "quotes-2-order-po"),
    ("cotizaciones-3-solicitudes.jpg", "quotes-3-requests"),
    ("cotizaciones-4-notificaciones.jpg", "quotes-4-notifications"),
    ("cotizaciones-5-movil.jpg", "quotes-5-mobile"),
    ("auto-precios.png", "pricing"),
    ("generador-codigos..png", "codegen"),
    ("ordenes-compra.png", "purchase-orders"),
]


def pixelate(image: Image.Image, box: Box) -> None:
    """Pixelado grueso e irreversible de la región (bloques de BLOCK px, o
    color plano con FLAT)."""
    x0, y0, x1, y1 = box[:4]
    block = box[4] if len(box) == 5 else BLOCK
    region = image.crop((x0, y0, x1, y1))
    w, h = region.size
    small = region.resize((max(1, w // block), max(1, h // block)), Image.BILINEAR)
    image.paste(small.resize((w, h), Image.NEAREST), (x0, y0, x1, y1))


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
