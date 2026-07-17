import { describe, expect, it } from "vitest";

import { QuranRepository } from "../db/quranRepository";
import { normalizeArabic } from "../utils/arabicNormalization";

const quranRepository = new QuranRepository();

// TODO: Remove `.skip` once a MySQL database (seeded via `server/db/seed.ts`)
// is available in CI. These tests exercise real read/search queries against
// the Quran database and cannot run without a live connection.
describe.skip("Quran Knowledge Engine", () => {
  it("returns all 114 Surahs", async () => {
    const surahsList = await quranRepository.getSurahs();
    expect(surahsList).toHaveLength(114);
  });

  it("returns Al-Fatiha for Surah number 1", async () => {
    const surah1 = await quranRepository.getSurahByNumber(1);
    expect(surah1[0]?.name_english).toBe("Al-Fatiha");
  });

  it("finds results when searching normalized Arabic text", async () => {
    const searchResults = await quranRepository.searchQuran("الحمد");
    expect(searchResults.length).toBeGreaterThan(0);
  });
});

describe("Arabic normalization", () => {
  it("removes tashkeel (diacritics) from Arabic text", () => {
    const originalText = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ";
    const normalizedText = normalizeArabic(originalText);
    expect(normalizedText).not.toContain("\u064B");
    expect(normalizedText).not.toContain("\u0652");
  });
});
