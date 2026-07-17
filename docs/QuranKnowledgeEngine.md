# Quran Knowledge Engine Documentation

## 1. Introduction

This document provides a comprehensive overview of the Quran Knowledge Engine, a core component of the AI Quran Teacher mobile application. The engine is responsible for storing, managing, and providing access to Quranic data, including surahs, ayahs, and word-by-word translations, along with functionalities for lessons and bookmarks.

## 2. Architecture Overview

The Quran Knowledge Engine is built using a Node.js/TypeScript backend, leveraging Drizzle ORM for database interactions and MySQL as the relational database. It exposes a tRPC API for efficient and type-safe communication with the mobile application.

## 3. Database Schema

The database schema is designed to store detailed Quranic information, including surah metadata, ayah texts, and word-by-word breakdowns. It also includes tables for managing user-specific lessons and bookmarks.

### 3.1. Database Schema Diagram

![Quran Database Schema](/home/ubuntu/ai-quran-teacher/docs/QuranSchema.png)

### 3.2. Tables

| Table Name | Description |
|---|---|
| `surahs` | Stores metadata for each Surah (chapter) of the Quran. |
| `ayahs` | Stores information for each Ayah (verse), including its Uthmani text and various numerical classifications. |
| `words` | Stores word-by-word data for each Ayah, including Arabic text, English translation, transliteration, and normalized Arabic text for search. |
| `lessons` | Stores user-specific lesson progress, including the range of Ayahs being studied, status, and notes. |
| `bookmarks` | Stores user-specific bookmarks for Ayahs, allowing users to mark and revisit specific verses. |

### 3.2. Schema Definition (`server/db/schema.ts`)

```typescript
import { mysqlTable, int, varchar, text, primaryKey, uniqueIndex, serial, timestamp } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Surah Table
export const surahs = mysqlTable("surahs", {
  id: int("id").notNull().primaryKey().autoincrement(),
  surah_number: int("surah_number").notNull().unique(),
  name_arabic: varchar("name_arabic", { length: 255 }).notNull(),
  name_english: varchar("name_english", { length: 255 }).notNull(),
  revelation_type: varchar("revelation_type", { length: 50 }).notNull(),
  ayah_count: int("ayah_count").notNull(),
});

// Ayah Table
export const ayahs = mysqlTable("ayahs", {
  id: int("id").notNull().primaryKey().autoincrement(),
  surah_id: int("surah_id").notNull(),
  ayah_number: int("ayah_number").notNull(),
  text_uthmani: text("text_uthmani").notNull(),
  juz_number: int("juz_number").notNull(),
  hizb_number: int("hizb_number").notNull(),
  rub_number: int("rub_number").notNull(),
  manzil_number: int("manzil_number").notNull(),
  sajda: int("sajda").default(0), // 0 for no sajda, 1 for recommended, 2 for obligatory
}, (table) => {
  return {
    surahAyahIndex: uniqueIndex("surah_ayah_idx").on(table.surah_id, table.ayah_number),
  };
});

// Lesson Table
export const lessons = mysqlTable("lessons", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 256 }).notNull(), // Assuming user_id from auth system
  surah_id: int("surah_id").references(() => surahs.id),
  ayah_number_start: int("ayah_number_start").notNull(),
  ayah_number_end: int("ayah_number_end").notNull(),
  lesson_date: timestamp("lesson_date").default(sql`CURRENT_TIMESTAMP`),
  status: varchar("status", { length: 50 }).default("pending"), // e.g., "pending", "completed", "in_progress"
  notes: text("notes"),
});

// Bookmark Table
export const bookmarks = mysqlTable("bookmarks", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 256 }).notNull(),
  surah_id: int("surah_id").references(() => surahs.id),
  ayah_number: int("ayah_number").notNull(),
  ayah_id: int("ayah_id").notNull().references(() => ayahs.id),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  notes: text("notes"),
});

// Word Table (for word-by-word data)
export const words = mysqlTable("words", {
  id: int("id").notNull().primaryKey().autoincrement(),
  ayah_id: int("ayah_id").notNull(),
  word_number: int("word_number").notNull(),
  arabic_text: varchar("arabic_text", { length: 255 }).notNull(),
  translation_english: text("translation_english"),
  transliteration_english: text("transliteration_english"),
  normalized_arabic_text: varchar("normalized_arabic_text", { length: 255 }),
  // Additional fields for morphology, root, lemma, tajweed can be added here
  // For simplicity, we'll start with these basic fields.
}, (table) => {
  return {
    ayahWordIndex: uniqueIndex("ayah_word_idx").on(table.ayah_id, table.word_number),
  };
});

// Relations
export const surahRelations = relations(surahs, ({ many }) => ({
  ayahs: many(ayahs),
  lessons: many(lessons),
  bookmarks: many(bookmarks),
}));

export const ayahRelations = relations(ayahs, ({ one, many }) => ({
  surah: one(surahs, {
    fields: [ayahs.surah_id],
    references: [surahs.id],
  }),
  words: many(words),
  lessons: many(lessons),
  bookmarks: many(bookmarks),
}));

export const wordRelations = relations(words, ({ one }) => ({
  ayah: one(ayahs, {
    fields: [words.ayah_id],
    references: [ayahs.id],
  }),
}));

export const lessonRelations = relations(lessons, ({ one }) => ({
  surah: one(surahs, {
    fields: [lessons.surah_id],
    references: [surahs.id],
  }),
}));

export const bookmarkRelations = relations(bookmarks, ({ one }) => ({
  surah: one(surahs, {
    fields: [bookmarks.surah_id],
    references: [surahs.id],
  }),
  ayah: one(ayahs, {
    fields: [bookmarks.ayah_id],
    references: [ayahs.id],
  }),
}));
```

## 4. API Endpoints (tRPC)

The Quran Knowledge Engine exposes the following tRPC endpoints for interacting with Quranic data, lessons, and bookmarks:

| Endpoint | Description | Input | Output |
|---|---|---|---|
| `quran.getSurahs` | Retrieves a list of all Surahs. | None | `Surah[]` |
| `quran.getSurahByNumber` | Retrieves a specific Surah by its number. | `{ surahNumber: number }` | `Surah[]` |
| `quran.getAyahsBySurahId` | Retrieves all Ayahs for a given Surah ID. | `{ surahId: number }` | `Ayah[]` |
| `quran.getAyahBySurahAndAyahNumber` | Retrieves a specific Ayah by Surah and Ayah number. | `{ surahNumber: number, ayahNumber: number }` | `Ayah[]` |
| `quran.getWordsByAyahId` | Retrieves all words for a given Ayah ID. | `{ ayahId: number }` | `Word[]` |
| `quran.searchQuran` | Searches for words in the Quran based on a normalized Arabic query. | `{ query: string }` | `Word[]` |
| `quran.createLesson` | Creates a new lesson for a user. | `{ userId: string, surahId: number, ayahNumberStart: number, ayahNumberEnd: number, notes?: string }` | `Lesson` |
| `quran.getLessonsByUserId` | Retrieves all lessons for a given user ID. | `{ userId: string }` | `Lesson[]` |
| `quran.updateLessonStatus` | Updates the status of a specific lesson. | `{ lessonId: number, status: string }` | `Lesson[]` |
| `quran.createBookmark` | Creates a new bookmark for a user. | `{ userId: string, surahId: number, ayahId: number, ayahNumber: number, notes?: string }` | `Bookmark` |
| `quran.getBookmarksByUserId` | Retrieves all bookmarks for a given user ID. | `{ userId: string }` | `Bookmark[]` |
| `quran.deleteBookmark` | Deletes a specific bookmark. | `{ bookmarkId: number }` | `{ success: boolean }` |

## 5. Arabic Normalization

The engine includes an Arabic normalization utility (`server/utils/arabicNormalization.ts`) to handle variations in Arabic script, particularly diacritics (tashkeel) and hamza forms. This ensures consistent search results and data processing.

```typescript
export function normalizeArabic(text: string): string {
  if (!text) return "";

  let normalizedText = text;

  // Remove Tashkeel (diacritics)
  normalizedText = normalizedText.replace(/[\u064B-\u0652\u0610-\u061A\u06D6-\u06DC\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06ED]/g, "");

  // Normalize Hamza variations
  normalizedText = normalizedText.replace(/[\u0622\u0623\u0625]/g, "\u0627"); // Alef with hamza above/below to plain Alef
  normalizedText = normalizedText.replace(/\u0624/g, "\u0648"); // Waw with hamza above to Waw
  normalizedText = normalizedText.replace(/\u0626/g, "\u064A"); // Yeh with hamza above to Yeh

  // Normalize Tatweel (Kashida)
  normalizedText = normalizedText.replace(/\u0640/g, "");

  // Normalize Alif Maksura to Ya
  normalizedText = normalizedText.replace(/\u0649/g, "\u064A");

  // Remove optional characters like small alif
  normalizedText = normalizedText.replace(/\u0670/g, "");

  // Remove punctuation and non-Arabic characters (optional, depending on search needs)
  // normalizedText = normalizedText.replace(/[^\u0600-\u06FF\s]/g, ")

  return normalizedText.trim();
}
```

## 6. Data Seeding

The `server/db/seed.ts` script is used to populate the database with initial Quranic data. It fetches word-by-word data from a GitHub repository and inserts it into the `surahs`, `ayahs`, and `words` tables. It also applies Arabic normalization during the seeding process.

## 7. Testing

Unit tests for the Quran Knowledge Engine are located in `server/tests/quranEngine.test.ts`. These tests cover basic data retrieval, search functionality, and Arabic normalization to ensure the correctness and reliability of the engine.

## 8. Future Enhancements

- **Comprehensive Metadata:** Integrate more detailed metadata for Juz, Hizb, Rub, Manzil, and Sajda from authoritative sources like Tanzil.net.
- **Tajweed and Pronunciation Analysis:** Implement AI services for analyzing Tajweed rules and pronunciation, storing results in the database.
- **Offline Support:** Enhance offline capabilities for Quran data, lessons, and bookmarks with robust synchronization and conflict resolution mechanisms.
- **Advanced Search:** Implement more advanced search features, including phonetic search, root word search, and search by translation.
- **User Authentication and Authorization:** Integrate with a robust user authentication system to secure user-specific data.

