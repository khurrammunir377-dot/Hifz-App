import { eq, like } from "drizzle-orm";
import { db } from "./index";
import { surahs, ayahs, words, lessons, bookmarks } from "./schema";
import { normalizeArabic } from "../utils/arabicNormalization";

export class QuranRepository {
  async getSurahs() {
    return db.select().from(surahs);
  }

  async getSurahByNumber(surahNumber: number) {
    return db.select().from(surahs).where(eq(surahs.surah_number, surahNumber)).limit(1);
  }

  async getAyahsBySurahId(surahId: number) {
    return db.select().from(ayahs).where(eq(ayahs.surah_id, surahId));
  }

  async getAyahBySurahAndAyahNumber(surahNumber: number, ayahNumber: number) {
    return db
      .select()
      .from(ayahs)
      .innerJoin(surahs, eq(ayahs.surah_id, surahs.id))
      .where(eq(surahs.surah_number, surahNumber) && eq(ayahs.ayah_number, ayahNumber))
      .limit(1);
  }

  async getWordsByAyahId(ayahId: number) {
    return db.select().from(words).where(eq(words.ayah_id, ayahId));
  }

  async createLesson(
    userId: string,
    surahId: number,
    ayahNumberStart: number,
    ayahNumberEnd: number,
    notes?: string,
  ) {
    const [newLesson] = await db.insert(lessons).values({
      user_id: userId,
      surah_id: surahId,
      ayah_number_start: ayahNumberStart,
      ayah_number_end: ayahNumberEnd,
      notes: notes,
    });
    return newLesson;
  }

  async getLessonsByUserId(userId: string) {
    return db.select().from(lessons).where(eq(lessons.user_id, userId));
  }

  async updateLessonStatus(lessonId: number, status: string) {
    await db.update(lessons).set({ status: status }).where(eq(lessons.id, lessonId));
    return db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  }

  async createBookmark(
    userId: string,
    surahId: number,
    ayahId: number,
    ayahNumber: number,
    notes?: string,
  ) {
    const [newBookmark] = await db.insert(bookmarks).values({
      user_id: userId,
      surah_id: surahId,
      ayah_id: ayahId,
      ayah_number: ayahNumber,
      notes: notes,
    });
    return newBookmark;
  }

  async getBookmarksByUserId(userId: string) {
    return db.select().from(bookmarks).where(eq(bookmarks.user_id, userId));
  }

  async deleteBookmark(bookmarkId: number) {
    await db.delete(bookmarks).where(eq(bookmarks.id, bookmarkId));
    return { success: true };
  }

  async searchQuran(query: string) {
    const normalizedQuery = normalizeArabic(query);
    return db
      .select()
      .from(words)
      .where(like(words.normalized_arabic_text, `%${normalizedQuery}%`));
  }
}
