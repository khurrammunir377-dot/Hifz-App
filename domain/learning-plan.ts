export type NormalizedAyahRange = {
  startAyah: number;
  endAyah: number;
};

export function normalizeAyahRange(startAyah: number, endAyah: number, ayahCount: number): NormalizedAyahRange {
  const maximum = Math.max(1, Math.floor(ayahCount));
  const start = Math.max(1, Math.min(maximum, Math.floor(startAyah)));
  const end = Math.max(start, Math.min(maximum, Math.floor(endAyah)));
  return { startAyah: start, endAyah: end };
}

export function formatAyahTarget(startAyah: number, endAyah: number) {
  return startAyah === endAyah ? `Ayah ${startAyah}` : `Ayahs ${startAyah}–${endAyah}`;
}
