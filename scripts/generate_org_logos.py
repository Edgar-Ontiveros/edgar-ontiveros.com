#!/usr/bin/env python3
"""Genera los logos de organización de public/logos/ desde raw-assets/logos/.

Mismo tratamiento que el logo UACH ya publicado: placa BLANCA horneada en un
lienzo cuadrado (las tintas azul/gris oscuro de Herinox y Safran desaparecen
sobre el tema oscuro sin ella) y salida WebP de 256px. El recorte al bounding
box del glifo + padding uniforme deja los tres recuadros de la línea de tiempo
ópticamente equilibrados.

Particularidades de los insumos:
  - herinox.png: RGBA transparente; se compone sobre blanco.
  - safran..png (sic, doble punto): PNG RGB con tablero de transparencia
    FALSO horneado (cuadros blanco/#e7e7e7); se aplana a blanco todo pixel
    gris claro antes de recortar.

Correr tras cambiar insumos:  python3 scripts/generate_org_logos.py
Requiere: Pillow (pip install pillow).
"""

import os

from PIL import Image

OUT_DIR = "public/logos"
SIZE = 256
PADDING = 0.08


def flatten_checkerboard(image: Image.Image) -> Image.Image:
    """Blanquea el tablero de transparencia falso (grises claros ~231-255)."""
    data = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b = data[x, y]
            if max(r, g, b) - min(r, g, b) < 12 and min(r, g, b) > 215:
                data[x, y] = (255, 255, 255)
    return image


def bbox_non_white(image: Image.Image) -> tuple[int, int, int, int]:
    """Bounding box de todo lo que no sea blanco (umbral suave)."""
    from PIL import ImageChops

    diff = ImageChops.difference(image, Image.new("RGB", image.size, (255, 255, 255)))
    box = diff.convert("L").point(lambda v: 255 if v > 16 else 0).getbbox()
    return box if box else (0, 0, image.width, image.height)


def plate(image: Image.Image, out_name: str) -> None:
    """Recorta al glifo, centra en placa blanca cuadrada y guarda WebP."""
    cropped = image.crop(bbox_non_white(image))
    side = round(max(cropped.size) * (1 + 2 * PADDING))
    canvas = Image.new("RGB", (side, side), (255, 255, 255))
    canvas.paste(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
    canvas = canvas.resize((SIZE, SIZE), Image.LANCZOS)
    out = f"{OUT_DIR}/{out_name}"
    canvas.save(out, "WEBP", quality=88, method=6)
    print(f"{out_name}  {SIZE}x{SIZE}  {os.path.getsize(out) / 1024:.0f} KB")


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)

    herinox = Image.open("raw-assets/logos/herinox.png").convert("RGBA")
    white = Image.new("RGBA", herinox.size, (255, 255, 255, 255))
    plate(Image.alpha_composite(white, herinox).convert("RGB"), "herinox.webp")

    safran = Image.open("raw-assets/logos/safran..png").convert("RGB")
    plate(flatten_checkerboard(safran), "safran.webp")


if __name__ == "__main__":
    main()
