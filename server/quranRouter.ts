import { publicProcedure, router } from "./_core/trpc";
import { QuranRepository } from "./db/quranRepository";
import { z } from "zod";

const quranRepository = new QuranRepository();

export const quranRouter = router({
  createLesson: publicProcedure
    .input(z.object({
      userId: z.string(),
      surahId: z.number(),
      ayahNumberStart: z.number(),
      ayahNumberEnd: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return quranRepository.createLesson(input.userId, input.surahId, input.ayahNumberStart, input.ayahNumberEnd, input.notes);
    }),

  getLessonsByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return quranRepository.getLessonsByUserId(input.userId);
    }),

  updateLessonStatus: publicProcedure
    .input(z.object({
      lessonId: z.number(),
      status: z.string(),
    }))
    .mutation(async ({ input }) => {
      return quranRepository.updateLessonStatus(input.lessonId, input.status);
    }),

  createBookmark: publicProcedure
    .input(z.object({
      userId: z.string(),
      surahId: z.number(),
      ayahId: z.number(),
      ayahNumber: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return quranRepository.createBookmark(input.userId, input.surahId, input.ayahId, input.ayahNumber, input.notes);
    }),

  getBookmarksByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return quranRepository.getBookmarksByUserId(input.userId);
    }),

  deleteBookmark: publicProcedure
    .input(z.object({ bookmarkId: z.number() }))
    .mutation(async ({ input }) => {
      return quranRepository.deleteBookmark(input.bookmarkId);
    }),
  getSurahs: publicProcedure.query(async () => {
    return quranRepository.getSurahs();
  }),

  getSurahByNumber: publicProcedure
    .input(z.object({ surahNumber: z.number() }))
    .query(async ({ input }) => {
      return quranRepository.getSurahByNumber(input.surahNumber);
    }),

  getAyahsBySurahId: publicProcedure
    .input(z.object({ surahId: z.number() }))
    .query(async ({ input }) => {
      return quranRepository.getAyahsBySurahId(input.surahId);
    }),

  getAyahBySurahAndAyahNumber: publicProcedure
    .input(z.object({ surahNumber: z.number(), ayahNumber: z.number() }))
    .query(async ({ input }) => {
      return quranRepository.getAyahBySurahAndAyahNumber(input.surahNumber, input.ayahNumber);
    }),

  getWordsByAyahId: publicProcedure
    .input(z.object({ ayahId: z.number() }))
    .query(async ({ input }) => {
      return quranRepository.getWordsByAyahId(input.ayahId);
    }),

  searchQuran: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return quranRepository.searchQuran(input.query);
    }),
});
