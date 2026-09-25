#!/usr/bin/env python3
"""Genera los placeholders "blur-up" de las miniaturas de la sección Projects.

Lee los *-thumb.webp YA PUBLICADOS en public/images/projects/ (no necesita
raw-assets/, así que corre en cualquier máquina) y, por cada uno, produce una
versión de PLACEHOLDER_WIDTH px de ancho (alto proporcional) codificada como
data URI webp/base64, lista para pegar en el campo `placeholder` de cada
captura en src/content/projects.ts. La tarjeta muestra ese placeholder
desenfocado mientras carga la miniatura real (~300 bytes por imagen: viaja
inline en el bundle sin petición extra).

Correr tras regenerar miniaturas:  python3 scripts/generate_thumb_placeholders.py
Salida: una línea por miniatura, `<slug>: <data URI>` (orden alfabético).
Requiere: Pillow (pip install pillow).
"""

import base64
import glob
import io
import os

from PIL import Image

THUMB_DIR = "public/images/projects"
PLACEHOLDER_WIDTH = 24
# Calidad baja a propósito: la imagen se muestra desenfocada; solo aporta
# el color y la composición general.
QUALITY = 45


def placeholder_data_uri(path: str) -> str:
    image = Image.open(path).convert("RGB")
    width = min(PLACEHOLDER_WIDTH, image.width)
    height = max(1, round(width / image.width * image.height))
    small = image.resize((width, height), Image.LANCZOS)
    buffer = io.BytesIO()
    small.save(buffer, "WEBP", quality=QUALITY, method=6)
    return "data:image/webp;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")


def main() -> None:
    total = 0
    for path in sorted(glob.glob(f"{THUMB_DIR}/*-thumb.webp")):
        slug = os.path.basename(path).removesuffix("-thumb.webp")
        uri = placeholder_data_uri(path)
        total += len(uri)
        print(f"{slug}: {uri}")
    print(f"TOTAL: {total} caracteres en data URIs")


if __name__ == "__main__":
    main()
