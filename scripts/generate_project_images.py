#!/usr/bin/env python3
"""Genera las imágenes WebP de la sección Projects desde raw-assets/screenshots/.

Antes de exportar, CENSURA (pixelado, color plano o desenfoque) las zonas con datos de negocio reales (nombres de
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

from PIL import Image, ImageFilter

SIZES = ((800, "thumb", 80), (1600, "large", 76))
SRC_DIR = "raw-assets/screenshots"
OUT_DIR = "public/images/projects"

# Modos de censura por caja (sin modo: pixelado).
#  - pixelado: bloques de BLOCK px; texto ilegible con textura visible.
#  - FLAT: color plano (promedio de la zona); para cuando la longitud o el
#    color de lo pixelado seguirían delatando un resultado.
#  - BLUR: desenfoque gaussiano fuerte (reducción + blur encadenados) que deja
#    la mancha del texto sin ningún trazo recuperable; conserva mejor el
#    aspecto de la UI que el pixelado.
BLOCK = 12
FLAT = "flat"
BLUR = "blur"
# BLUR: factor de reducción y radios de desenfoque (en la versión reducida y en
# la restaurada). Con texto de ~10 px de alto, la reducción lo deja en <2 px
# antes del primer blur: no queda ningún glifo que reconstruir.
BLUR_SHRINK = 6
BLUR_RADIUS_SMALL = 2.0
BLUR_RADIUS_LARGE = 5.0

# Caja de censura: (x0, y0, x1, y1[, modo]).
Box = tuple[int, int, int, int] | tuple[int, int, int, int, str]

# Precio–volumen: barras (x0, x1, y_tope) medidas del original. La etiqueta
# "N.N M" en pesos ocupa la franja de ~3 a ~9 px sobre el tope de cada barra y
# puede sobresalir unos px a los lados; se tapa esa franja.
YOY_BARS: list[tuple[int, int, int]] = [
    (78, 96, 515),
    (98, 116, 446),
    (146, 164, 499),
    (166, 184, 461),
    (215, 233, 474),
    (235, 253, 449),
    (283, 301, 517),
    (303, 321, 511),
    (351, 369, 430),
    (371, 389, 410),
    (420, 438, 484),
    (440, 458, 475),
    (488, 506, 499),
    (508, 526, 493),
    (556, 574, 467),
    (576, 594, 469),
    (625, 643, 489),
    (645, 663, 494),
    (693, 711, 439),
    (713, 731, 455),
]
YOY_BAR_LABEL_BOXES: list[Box] = [
    (x0 - 8, top - 12, x1 + 8, top - 2, BLUR) for x0, x1, top in YOY_BARS
]

# Cajas (x0, y0, x1, y1[, modo]) en coordenadas del original de cada captura
# sobre datos sensibles. Documentar aquí QUÉ tapa cada caja al agregar
# capturas nuevas.
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
    # Tablero del Director de ventas (871x889). Criterio: se tapan valores
    # absolutos en pesos y conteos de negocio; quedan la UI, los porcentajes
    # y los nombres de sucursal de la línea de filtros (sin valor asociado).
    #  - Valor de los KPI Venta sin IVA, Margen bruto, Clientes nuevos y
    #    Facturas (la línea "% vs mes anterior" bajo cada uno queda).
    #  - Ejes en pesos de Venta sin IVA, Margen bruto y Utilidad operativa,
    #    y eje de conteo de Clientes nuevos; las curvas/barras quedan.
    "reporte-ventas-1-tablero.jpg": [
        (26, 356, 176, 375, BLUR),
        (196, 356, 346, 375, BLUR),
        (366, 356, 516, 375, BLUR),
        (536, 356, 686, 375, BLUR),
        (26, 494, 68, 634, BLUR),
        (454, 494, 496, 634, BLUR),
        (26, 722, 68, 864, BLUR),
        (450, 722, 498, 864, BLUR),
    ],
    # Presupuesto (766x868). Sucursal anónima: barras, semáforos y porcentajes
    # quedan; se tapan los nombres de sucursal y todo importe en pesos.
    #  - Nombres de sucursal del eje de la gráfica de cumplimiento.
    #  - Tabla lateral: columnas Presupuesto al corte, Venta real y Variación
    #    (la columna Cumplimiento en % queda).
    #  - Línea de totales: importes de Presupuesto al corte, Venta real,
    #    Variación y Proyección de cierre (el % de cumplimiento global queda).
    #  - Tabla inferior: columna Sucursal y columnas de pesos (presupuestos,
    #    ventas y diferencia); el semáforo y "Días de venta" quedan.
    "reporte-ventas-2-presupuesto.jpg": [
        (26, 328, 106, 530, BLUR),
        (486, 326, 754, 530, BLUR),
        (204, 564, 252, 581, BLUR),
        (298, 564, 346, 581, BLUR),
        (393, 564, 440, 581, BLUR),
        (525, 564, 573, 581, BLUR),
        (12, 630, 122, 830, BLUR),
        (170, 630, 645, 830, BLUR),
    ],
    # Precio–volumen (772x868). Se tapan el eje en pesos, la etiqueta de valor
    # sobre cada barra (franja fija encima de cada barra), los nombres de
    # sucursal del eje X y de la tabla, y las columnas de la tabla (pesos,
    # kilos y $/KG). Quedan las barras pareadas, el % de variación bajo cada
    # sucursal, el resumen "N de 10 sucursales crecieron" y la fila TOTAL
    # (solo su etiqueta).
    "reporte-ventas-3-vs-anio.jpg": [
        (24, 386, 62, 546, BLUR),
        *YOY_BAR_LABEL_BOXES,
        (24, 547, 754, 558, BLUR),
        (14, 646, 176, 842, BLUR),
        (178, 626, 772, 844, BLUR),
    ],
    # Tablero del Director en móvil (739x1600): valor de los KPI Venta sin
    # IVA, Margen bruto, Clientes nuevos y Facturas; sus "% vs mes anterior"
    # y los nombres de sucursal de la línea de filtros quedan.
    "reporte-ventas-4-movil.jpg": [
        (48, 834, 348, 876, BLUR),
        (398, 805, 692, 848, BLUR),
        (48, 1130, 348, 1168, BLUR),
        (398, 1130, 692, 1172, BLUR),
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


def redact(image: Image.Image, box: Box) -> None:
    """Censura irreversible de la región según el modo de la caja."""
    x0, y0, x1, y1 = box[:4]
    mode = box[4] if len(box) == 5 else None
    region = image.crop((x0, y0, x1, y1))
    w, h = region.size
    if mode == BLUR:
        small = region.resize(
            (max(1, w // BLUR_SHRINK), max(1, h // BLUR_SHRINK)), Image.BILINEAR
        ).filter(ImageFilter.GaussianBlur(BLUR_RADIUS_SMALL))
        result = small.resize((w, h), Image.BILINEAR).filter(
            ImageFilter.GaussianBlur(BLUR_RADIUS_LARGE)
        )
    else:
        block = 100_000 if mode == FLAT else BLOCK
        small = region.resize((max(1, w // block), max(1, h // block)), Image.BILINEAR)
        result = small.resize((w, h), Image.NEAREST)
    image.paste(result, (x0, y0, x1, y1))


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
            redact(image, box)
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
