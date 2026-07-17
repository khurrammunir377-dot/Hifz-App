import { mysqlTable, int, varchar, text, primaryKey, uniqueIndex, serial, timestamp } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

// Surah Table
export const surahs = mysqlTable('surahs', {
  id: int('id').notNull().primaryKey().autoincrement(),
  surah_number: int('surah_number').notNull().unique(),
  name_arabic: varchar('name_arabic', { length: 255 }).notNull(),
  name_english: varchar('name_english', { length: 255 }).notNull(),
  revelation_type: varchar('revelation_type', { length: 50 }).notNull(),
  ayah_count: int('ayah_count').notNull(),
});

// Ayah Table
export const ayahs = mysqlTable('ayahs', {
  id: int('id').notNull().primaryKey().autoincrement(),
  surah_id: int('surah_id').notNull(),
  ayah_number: int('ayah_number').notNull(),
  text_uthmani: text('text_uthmani').notNull(),
  juz_number: int('juz_number').notNull(),
  hizb_number: int('hizb_number').notNull(),
  rub_number: int('rub_number').notNull(),
  manzil_number: int('manzil_number').notNull(),
  sajda: int('sajda').default(0), // 0 for no sajda, 1 for recommended, 2 for obligatory
}, (table) => {
  return {
    surahAyahIndex: uniqueIndex('surah_ayah_idx').on(table.surah_id, table.ayah_number),
  };
});

// Word Table (for word-by-word data)
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

export const bookmarks = mysqlTable("bookmarks", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 256 }).notNull(),
  surah_id: int("surah_id").references(() => surahs.id),
  ayah_number: int("ayah_number").notNull(),
  ayah_id: int("ayah_id").notNull().references(() => ayahs.id),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  notes: text("notes"),
});

export const words = mysqlTable('words', {
  id: int('id').notNull().primaryKey().autoincrement(),
  ayah_id: int('ayah_id').notNull(),
  word_number: int('word_number').notNull(),
  arabic_text: varchar('arabic_text', { length: 255 }).notNull(),
  translation_english: text('translation_english'),
  transliteration_english: text('transliteration_english'),
  normalized_arabic_text: varchar('normalized_arabic_text', { length: 255 }),
  // Additional fields for morphology, root, lemma, tajweed can be added here
  // For simplicity, we'll start with these basic fields.
}, (table) => {
  return {
    ayahWordIndex: uniqueIndex('ayah_word_idx').on(table.ayah_id, table.word_number),
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
