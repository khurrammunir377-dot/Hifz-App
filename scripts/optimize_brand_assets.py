from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"
SOURCE = IMAGES / "icon.png"

TARGETS = {
    "icon.png": 1024,
    "android-icon-foreground.png": 1024,
    "splash-icon.png": 512,
    "favicon.png": 128,
}


def optimize(source: Path, target: Path, size: int) -> None:
    with Image.open(source) as image:
        rgb = image.convert("RGB")
        resized = rgb.resize((size, size), Image.Resampling.LANCZOS)
        quantized = resized.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
        quantized.save(target, format="PNG", optimize=True, compress_level=9)


def main() -> None:
    source_copy = IMAGES / ".hifz-icon-source.png"
    source_copy.write_bytes(SOURCE.read_bytes())
    try:
        for filename, size in TARGETS.items():
            optimize(source_copy, IMAGES / filename, size)
    finally:
        source_copy.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
