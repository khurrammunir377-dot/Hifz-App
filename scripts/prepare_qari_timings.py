#!/usr/bin/env python3
"""
Prepares the word-level audio timing data needed for the Qari correction
voice feature (Juz Amma pilot).

Run this ONCE (locally, or as a GitHub Actions step) with normal internet
access - it downloads the quran-align project's released timing data
(CC-BY 4.0 licensed, see https://github.com/cpfair/quran-align) for the
Alafasy reciter, filters it down to just Juz Amma (Surah 78-114), and
writes a small bundled JSON asset the app reads directly.

This script does NOT download any audio itself - only timing metadata.
The actual ayah audio is downloaded on-demand by the app at runtime from
everyayah.com, using the exact same reciter folder name
("Alafasy_128kbps") so the timings line up correctly, and is cached
locally on the device after first use.

Usage:
    pip install requests
    python3 scripts/prepare_qari_timings.py

Output:
    assets/data/qari_word_timings_juz_amma.json
"""

import json
import sys
import tarfile
import zipfile
import io
import os

try:
    import requests
except ImportError:
    print("This script needs the 'requests' package: pip install requests")
    sys.exit(1)

RECITER_FOLDER = "Alafasy_128kbps"  # must match everyayah.com's folder name exactly
JUZ_AMMA_FIRST_SURAH = 78  # An-Naba onward is the conventional Juz Amma range
RELEASE_API_URL = "https://api.github.com/repos/cpfair/quran-align/releases/tags/release-2016-11-24"
OUTPUT_PATH = "assets/data/qari_word_timings_juz_amma.json"


def find_release_asset_url():
    resp = requests.get(RELEASE_API_URL, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    assets = data.get("assets", [])
    if not assets:
        raise RuntimeError(
            "No release assets found - check "
            "https://github.com/cpfair/quran-align/releases manually and "
            "update this script with the correct asset URL if the release "
            "structure has changed."
        )
    print("Available release assets:")
    for a in assets:
        print(f"  - {a['name']} ({a['size']} bytes) -> {a['browser_download_url']}")
    # Prefer an asset whose name suggests it's the full data bundle; fall
    # back to the first asset if naming doesn't match what we expect.
    for a in assets:
        if "data" in a["name"].lower() or "timing" in a["name"].lower():
            return a["browser_download_url"], a["name"]
    return assets[0]["browser_download_url"], assets[0]["name"]


def extract_archive(content_bytes, filename):
    """Returns a dict of {member_name: bytes} from a zip or tar.gz archive."""
    files = {}
    if filename.endswith(".zip"):
        with zipfile.ZipFile(io.BytesIO(content_bytes)) as z:
            for name in z.namelist():
                files[name] = z.read(name)
    elif filename.endswith(".tar.gz") or filename.endswith(".tgz"):
        with tarfile.open(fileobj=io.BytesIO(content_bytes), mode="r:gz") as t:
            for member in t.getmembers():
                if member.isfile():
                    f = t.extractfile(member)
                    if f:
                        files[member.name] = f.read()
    else:
        # Assume it's a raw JSON file, not an archive.
        files[filename] = content_bytes
    return files


def main():
    print(f"Looking up release asset list from {RELEASE_API_URL} ...")
    asset_url, asset_name = find_release_asset_url()
    print(f"Downloading {asset_name} ...")

    resp = requests.get(asset_url, timeout=120)
    resp.raise_for_status()
    files = extract_archive(resp.content, asset_name)

    print(f"Archive contains {len(files)} file(s). Looking for '{RECITER_FOLDER}' data...")
    reciter_key = None
    for name in files:
        if RECITER_FOLDER.lower().split("_")[0] in name.lower():
            reciter_key = name
            break

    if reciter_key is None:
        print("Could not automatically find the Alafasy timing file. Files found:")
        for name in files:
            print(f"  - {name}")
        print(
            "\nPlease inspect the archive manually, find the correct file for "
            f"'{RECITER_FOLDER}', and adjust this script's matching logic above."
        )
        sys.exit(1)

    print(f"Using timing file: {reciter_key}")
    raw_data = json.loads(files[reciter_key])

    juz_amma_entries = [
        entry for entry in raw_data if entry.get("surah", 0) >= JUZ_AMMA_FIRST_SURAH
    ]
    print(f"Filtered to {len(juz_amma_entries)} ayah entries (Surah {JUZ_AMMA_FIRST_SURAH}-114).")

    # Flatten into a simpler structure the Flutter app can index directly:
    # one entry per word, not per ayah-with-nested-segments.
    flat_words = []
    for entry in juz_amma_entries:
        surah = entry["surah"]
        ayah = entry["ayah"]
        for seg in entry.get("segments", []):
            word_start_index, word_end_index, start_msec, end_msec = seg
            for word_index in range(word_start_index, word_end_index):
                flat_words.append({
                    "surah": surah,
                    "ayah": ayah,
                    "word_index": word_index,
                    "start_ms": start_msec,
                    "end_ms": end_msec,
                })

    output = {
        "reciter_folder": RECITER_FOLDER,
        "source": "cpfair/quran-align, CC-BY 4.0",
        "words": flat_words,
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, separators=(",", ":"))

    size_kb = os.path.getsize(OUTPUT_PATH) / 1024
    print(f"\nDone. Wrote {len(flat_words)} word timings to {OUTPUT_PATH} ({size_kb:.1f} KB)")
    print("Remember to add this path to pubspec.yaml's assets list if it isn't there already.")


if __name__ == "__main__":
    main()
