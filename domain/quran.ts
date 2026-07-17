export type QuranEdition = {
  id: string;
  script: "uthmani";
  riwayah: string;
  sourceAuthority: string;
  sourceVersion: string;
  checksum: string;
};

export type AyahReference = {
  surahNumber: number;
  ayahNumber: number;
};

export type AyahRange = {
  start: AyahReference;
  end: AyahReference;
};

export type VerifiedAyah = AyahReference & {
  uthmaniText: string;
  editionId: string;
  contentHash: string;
};

export type QuranRangeResult = {
  edition: QuranEdition;
  ayahs: VerifiedAyah[];
  verifiedAt: string;
};

export type VerificationStatus = "verified" | "pending" | "unavailable" | "failed";

export function isValidAyahRange(range: AyahRange) {
  const validStart = range.start.surahNumber >= 1 && range.start.surahNumber <= 114 && range.start.ayahNumber >= 1;
  const validEnd = range.end.surahNumber >= 1 && range.end.surahNumber <= 114 && range.end.ayahNumber >= 1;
  const ordered =
    range.start.surahNumber < range.end.surahNumber ||
    (range.start.surahNumber === range.end.surahNumber && range.start.ayahNumber <= range.end.ayahNumber);
  return validStart && validEnd && ordered;
}
