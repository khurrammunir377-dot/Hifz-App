import { drizzle } from 'drizzle-orm/mysql2';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import mysql from 'mysql2/promise';
import axios from 'axios';
import { surahs, ayahs, words } from './schema';
import { normalizeArabic } from '../utils/arabicNormalization';

const connection = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const db = drizzle(connection);

const QURAN_WBW_BASE_URL = 'https://raw.githubusercontent.com/qazasaz/quranwbw/master/surahs/data/';

interface WordData {
  b: string; // begin timestamp
  h: string; // end timestamp
  c: string; // arabic word
  d: string; // transliteration
  e: string; // english translation
}

interface AyahData {
  w: WordData[];
  a: { g: string }; // ayah english translation
}

interface SurahData {
  [key: string]: AyahData;
}

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Clear existing data (optional, for development)
    await db.delete(words);
    await db.delete(ayahs);
    await db.delete(surahs);
    console.log('Cleared existing data.');

    // Fetch Surah metadata (e.g., from a static JSON or API if available)
    // For now, we'll manually define some basic surah info or fetch from a simpler source
    // A more robust solution would involve a dedicated surah metadata API/file.
    const surahMetadata = [
      { id: 1, surah_number: 1, name_arabic: 'الفاتحة', name_english: 'Al-Fatiha', revelation_type: 'Meccan', ayah_count: 7 },
      { id: 2, surah_number: 2, name_arabic: 'البقرة', name_english: 'Al-Baqarah', revelation_type: 'Medinan', ayah_count: 286 },
      { id: 3, surah_number: 3, name_arabic: 'آل عمران', name_english: "Ali 'Imran", revelation_type: 'Medinan', ayah_count: 200 },
      { id: 4, surah_number: 4, name_arabic: 'النساء', name_english: 'An-Nisa', revelation_type: 'Medinan', ayah_count: 176 },
      { id: 5, surah_number: 5, name_arabic: 'المائدة', name_english: 'Al-Maidah', revelation_type: 'Medinan', ayah_count: 120 },
      { id: 6, surah_number: 6, name_arabic: 'الأنعام', name_english: 'Al-An`am', revelation_type: 'Meccan', ayah_count: 165 },
      { id: 7, surah_number: 7, name_arabic: 'الأعراف', name_english: 'Al-A`raf', revelation_type: 'Meccan', ayah_count: 206 },
      { id: 8, surah_number: 8, name_arabic: 'الأنفال', name_english: 'Al-Anfal', revelation_type: 'Medinan', ayah_count: 75 },
      { id: 9, surah_number: 9, name_arabic: 'التوبة', name_english: 'At-Tawbah', revelation_type: 'Medinan', ayah_count: 129 },
      { id: 10, surah_number: 10, name_arabic: 'يونس', name_english: 'Yunus', revelation_type: 'Meccan', ayah_count: 109 },
      { id: 11, surah_number: 11, name_english: 'Hud', name_arabic: 'هود', revelation_type: 'Meccan', ayah_count: 123 },
      { id: 12, surah_number: 12, name_english: 'Yusuf', name_arabic: 'يوسف', revelation_type: 'Meccan', ayah_count: 111 },
      { id: 13, surah_number: 13, name_english: 'Ar-Ra`d', name_arabic: 'الرعد', revelation_type: 'Medinan', ayah_count: 43 },
      { id: 14, surah_number: 14, name_english: 'Ibrahim', name_arabic: 'ابراهيم', revelation_type: 'Meccan', ayah_count: 52 },
      { id: 15, surah_number: 15, name_english: 'Al-Hijr', name_arabic: 'الحجر', revelation_type: 'Meccan', ayah_count: 99 },
      { id: 16, surah_number: 16, name_english: 'An-Nahl', name_arabic: 'النحل', revelation_type: 'Meccan', ayah_count: 128 },
      { id: 17, surah_number: 17, name_english: 'Al-Isra', name_arabic: 'الإسراء', revelation_type: 'Meccan', ayah_count: 111 },
      { id: 18, surah_number: 18, name_english: 'Al-Kahf', name_arabic: 'الكهف', revelation_type: 'Meccan', ayah_count: 110 },
      { id: 19, surah_number: 19, name_english: 'Maryam', name_arabic: 'مريم', revelation_type: 'Meccan', ayah_count: 98 },
      { id: 20, surah_number: 20, name_english: 'Taha', name_arabic: 'طه', revelation_type: 'Meccan', ayah_count: 135 },
      { id: 21, surah_number: 21, name_english: 'Al-Anbiya', name_arabic: 'الأنبياء', revelation_type: 'Meccan', ayah_count: 112 },
      { id: 22, surah_number: 22, name_english: 'Al-Hajj', name_arabic: 'الحج', revelation_type: 'Medinan', ayah_count: 78 },
      { id: 23, surah_number: 23, name_english: 'Al-Mu`minun', name_arabic: 'المؤمنون', revelation_type: 'Meccan', ayah_count: 118 },
      { id: 24, surah_number: 24, name_english: 'An-Nur', name_arabic: 'النور', revelation_type: 'Medinan', ayah_count: 64 },
      { id: 25, surah_number: 25, name_english: 'Al-Furqan', name_arabic: 'الفرقان', revelation_type: 'Meccan', ayah_count: 77 },
      { id: 26, surah_number: 26, name_english: 'Ash-Shu`ara', name_arabic: 'الشعراء', revelation_type: 'Meccan', ayah_count: 227 },
      { id: 27, surah_number: 27, name_english: 'An-Naml', name_arabic: 'النمل', revelation_type: 'Meccan', ayah_count: 93 },
      { id: 28, surah_number: 28, name_english: 'Al-Qasas', name_arabic: 'القصص', revelation_type: 'Meccan', ayah_count: 88 },
      { id: 29, surah_number: 29, name_english: 'Al-`Ankabut', name_arabic: 'العنكبوت', revelation_type: 'Meccan', ayah_count: 69 },
      { id: 30, surah_number: 30, name_english: 'Ar-Rum', name_arabic: 'الروم', revelation_type: 'Meccan', ayah_count: 60 },
      { id: 31, surah_number: 31, name_english: 'Luqman', name_arabic: 'لقمان', revelation_type: 'Meccan', ayah_count: 34 },
      { id: 32, surah_number: 32, name_english: 'As-Sajdah', name_arabic: 'السجدة', revelation_type: 'Meccan', ayah_count: 30 },
      { id: 33, surah_number: 33, name_english: 'Al-Ahzab', name_arabic: 'الأحزاب', revelation_type: 'Medinan', ayah_count: 73 },
      { id: 34, surah_number: 34, name_english: 'Saba', name_arabic: 'سبأ', revelation_type: 'Meccan', ayah_count: 54 },
      { id: 35, surah_number: 35, name_english: 'Fatir', name_arabic: 'فاطر', revelation_type: 'Meccan', ayah_count: 45 },
      { id: 36, surah_number: 36, name_english: 'Ya-Sin', name_arabic: 'يس', revelation_type: 'Meccan', ayah_count: 83 },
      { id: 37, surah_number: 37, name_english: 'As-Saffat', name_arabic: 'الصافات', revelation_type: 'Meccan', ayah_count: 182 },
      { id: 38, surah_number: 38, name_english: 'Sad', name_arabic: 'ص', revelation_type: 'Meccan', ayah_count: 88 },
      { id: 39, surah_number: 39, name_english: 'Az-Zumar', name_arabic: 'الزمر', revelation_type: 'Meccan', ayah_count: 75 },
      { id: 40, surah_number: 40, name_english: 'Ghafir', name_arabic: 'غافر', revelation_type: 'Meccan', ayah_count: 85 },
      { id: 41, surah_number: 41, name_english: 'Fussilat', name_arabic: 'فصلت', revelation_type: 'Meccan', ayah_count: 54 },
      { id: 42, surah_number: 42, name_english: 'Ash-Shuraa', name_arabic: 'الشورى', revelation_type: 'Meccan', ayah_count: 53 },
      { id: 43, surah_number: 43, name_english: 'Az-Zukhruf', name_arabic: 'الزخرف', revelation_type: 'Meccan', ayah_count: 89 },
      { id: 44, surah_number: 44, name_english: 'Ad-Dukhan', name_arabic: 'الدخان', revelation_type: 'Meccan', ayah_count: 59 },
      { id: 45, surah_number: 45, name_english: 'Al-Jathiyah', name_arabic: 'الجاثية', revelation_type: 'Meccan', ayah_count: 37 },
      { id: 46, surah_number: 46, name_english: 'Al-Ahqaf', name_arabic: 'الأحقاف', revelation_type: 'Meccan', ayah_count: 35 },
      { id: 47, surah_number: 47, name_english: 'Muhammad', name_arabic: 'محمد', revelation_type: 'Medinan', ayah_count: 38 },
      { id: 48, surah_number: 48, name_english: 'Al-Fath', name_arabic: 'الفتح', revelation_type: 'Medinan', ayah_count: 29 },
      { id: 49, surah_number: 49, name_english: 'Al-Hujurat', name_arabic: 'الحجرات', revelation_type: 'Medinan', ayah_count: 18 },
      { id: 50, surah_number: 50, name_english: 'Qaf', name_arabic: 'ق', revelation_type: 'Meccan', ayah_count: 45 },
      { id: 51, surah_number: 51, name_english: 'Adh-Dhariyat', name_arabic: 'الذاريات', revelation_type: 'Meccan', ayah_count: 60 },
      { id: 52, surah_number: 52, name_english: 'At-Tur', name_arabic: 'الطور', revelation_type: 'Meccan', ayah_count: 49 },
      { id: 53, surah_number: 53, name_english: 'An-Najm', name_arabic: 'النجم', revelation_type: 'Meccan', ayah_count: 62 },
      { id: 54, surah_number: 54, name_english: 'Al-Qamar', name_arabic: 'القمر', revelation_type: 'Meccan', ayah_count: 55 },
      { id: 55, surah_number: 55, name_english: 'Ar-Rahman', name_arabic: 'الرحمن', revelation_type: 'Medinan', ayah_count: 78 },
      { id: 56, surah_number: 56, name_english: 'Al-Waqi`ah', name_arabic: 'الواقعة', revelation_type: 'Meccan', ayah_count: 96 },
      { id: 57, surah_number: 57, name_english: 'Al-Hadid', name_arabic: 'الحديد', revelation_type: 'Medinan', ayah_count: 29 },
      { id: 58, surah_number: 58, name_english: 'Al-Mujadila', name_arabic: 'المجادلة', revelation_type: 'Medinan', ayah_count: 22 },
      { id: 59, surah_number: 59, name_english: 'Al-Hashr', name_arabic: 'الحشر', revelation_type: 'Medinan', ayah_count: 24 },
      { id: 60, surah_number: 60, name_english: 'Al-Mumtahanah', name_arabic: 'الممتحنة', revelation_type: 'Medinan', ayah_count: 13 },
      { id: 61, surah_number: 61, name_english: 'As-Saff', name_arabic: 'الصف', revelation_type: 'Medinan', ayah_count: 14 },
      { id: 62, surah_number: 62, name_english: 'Al-Jumu`ah', name_arabic: 'الجمعة', revelation_type: 'Medinan', ayah_count: 11 },
      { id: 63, surah_number: 63, name_english: 'Al-Munafiqun', name_arabic: 'المنافقون', revelation_type: 'Medinan', ayah_count: 11 },
      { id: 64, surah_number: 64, name_english: 'At-Taghabun', name_arabic: 'التغابن', revelation_type: 'Medinan', ayah_count: 18 },
      { id: 65, surah_number: 65, name_english: 'At-Talaq', name_arabic: 'الطلاق', revelation_type: 'Medinan', ayah_count: 12 },
      { id: 66, surah_number: 66, name_english: 'At-Tahrim', name_arabic: 'التحريم', revelation_type: 'Medinan', ayah_count: 12 },
      { id: 67, surah_number: 67, name_english: 'Al-Mulk', name_arabic: 'الملك', revelation_type: 'Meccan', ayah_count: 30 },
      { id: 68, surah_number: 68, name_english: 'Al-Qalam', name_arabic: 'القلم', revelation_type: 'Meccan', ayah_count: 52 },
      { id: 69, surah_number: 69, name_english: 'Al-Haqqah', name_arabic: 'الحاقة', revelation_type: 'Meccan', ayah_count: 52 },
      { id: 70, surah_number: 70, name_english: 'Al-Ma`arij', name_arabic: 'المعارج', revelation_type: 'Meccan', ayah_count: 44 },
      { id: 71, surah_number: 71, name_english: 'Nuh', name_arabic: 'نوح', revelation_type: 'Meccan', ayah_count: 28 },
      { id: 72, surah_number: 72, name_english: 'Al-Jinn', name_arabic: 'الجن', revelation_type: 'Meccan', ayah_count: 28 },
      { id: 73, surah_number: 73, name_english: 'Al-Muzzammil', name_arabic: 'المزمل', revelation_type: 'Meccan', ayah_count: 20 },
      { id: 74, surah_number: 74, name_english: 'Al-Muddaththir', name_arabic: 'المدثر', revelation_type: 'Meccan', ayah_count: 56 },
      { id: 75, surah_number: 75, name_english: 'Al-Qiyamah', name_arabic: 'القيامة', revelation_type: 'Meccan', ayah_count: 40 },
      { id: 76, surah_number: 76, name_english: 'Al-Insan', name_arabic: 'الإنسان', revelation_type: 'Medinan', ayah_count: 31 },
      { id: 77, surah_number: 77, name_english: 'Al-Mursalat', name_arabic: 'المرسلات', revelation_type: 'Meccan', ayah_count: 50 },
      { id: 78, surah_number: 78, name_english: 'An-Naba', name_arabic: 'النبأ', revelation_type: 'Meccan', ayah_count: 40 },
      { id: 79, surah_number: 79, name_english: 'An-Nazi`at', name_arabic: 'النازعات', revelation_type: 'Meccan', ayah_count: 46 },
      { id: 80, surah_number: 80, name_english: '`Abasa', name_arabic: 'عبس', revelation_type: 'Meccan', ayah_count: 42 },
      { id: 81, surah_number: 81, name_english: 'At-Takwir', name_arabic: 'التكوير', revelation_type: 'Meccan', ayah_count: 29 },
      { id: 82, surah_number: 82, name_english: 'Al-Infitar', name_arabic: 'الإنفطار', revelation_type: 'Meccan', ayah_count: 19 },
      { id: 83, surah_number: 83, name_english: 'Al-Mutaffifin', name_arabic: 'المطففين', revelation_type: 'Meccan', ayah_count: 36 },
      { id: 84, surah_number: 84, name_english: 'Al-Inshiqaq', name_arabic: 'الإنشقاق', revelation_type: 'Meccan', ayah_count: 25 },
      { id: 85, surah_number: 85, name_english: 'Al-Buruj', name_arabic: 'البروج', revelation_type: 'Meccan', ayah_count: 22 },
      { id: 86, surah_number: 86, name_english: 'At-Tariq', name_arabic: 'الطارق', revelation_type: 'Meccan', ayah_count: 17 },
      { id: 87, surah_number: 87, name_english: 'Al-A`la', name_arabic: 'الأعلى', revelation_type: 'Meccan', ayah_count: 19 },
      { id: 88, surah_number: 88, name_english: 'Al-Ghashiyah', name_arabic: 'الغاشية', revelation_type: 'Meccan', ayah_count: 26 },
      { id: 89, surah_number: 89, name_english: 'Al-Fajr', name_arabic: 'الفجر', revelation_type: 'Meccan', ayah_count: 30 },
      { id: 90, surah_number: 90, name_english: 'Al-Balad', name_arabic: 'البلد', revelation_type: 'Meccan', ayah_count: 20 },
      { id: 91, surah_number: 91, name_english: 'Ash-Shams', name_arabic: 'الشمس', revelation_type: 'Meccan', ayah_count: 15 },
      { id: 92, surah_number: 92, name_english: 'Al-Layl', name_arabic: 'الليل', revelation_type: 'Meccan', ayah_count: 21 },
      { id: 93, surah_number: 93, name_english: 'Ad-Duhaa', name_arabic: 'الضحى', revelation_type: 'Meccan', ayah_count: 11 },
      { id: 94, surah_number: 94, name_english: 'Ash-Sharh', name_arabic: 'الشرح', revelation_type: 'Meccan', ayah_count: 8 },
      { id: 95, surah_number: 95, name_english: 'At-Tin', name_arabic: 'التين', revelation_type: 'Meccan', ayah_count: 8 },
      { id: 96, surah_number: 96, name_english: 'Al-`Alaq', name_arabic: 'العلق', revelation_type: 'Meccan', ayah_count: 19 },
      { id: 97, surah_number: 97, name_english: 'Al-Qadr', name_arabic: 'القدر', revelation_type: 'Meccan', ayah_count: 5 },
      { id: 98, surah_number: 98, name_english: 'Al-Bayyinah', name_arabic: 'البينة', revelation_type: 'Medinan', ayah_count: 8 },
      { id: 99, surah_number: 99, name_english: 'Az-Zalzalah', name_arabic: 'الزلزلة', revelation_type: 'Medinan', ayah_count: 8 },
      { id: 100, surah_number: 100, name_english: 'Al-`Adiyat', name_arabic: 'العاديات', revelation_type: 'Meccan', ayah_count: 11 },
      { id: 101, surah_number: 101, name_english: 'Al-Qari`ah', name_arabic: 'القارعة', revelation_type: 'Meccan', ayah_count: 11 },
      { id: 102, surah_number: 102, name_english: 'At-Takathur', name_arabic: 'التكاثر', revelation_type: 'Meccan', ayah_count: 8 },
      { id: 103, surah_number: 103, name_english: 'Al-`Asr', name_arabic: 'العصر', revelation_type: 'Meccan', ayah_count: 3 },
      { id: 104, surah_number: 104, name_english: 'Al-Humazah', name_arabic: 'الهمزة', revelation_type: 'Meccan', ayah_count: 9 },
      { id: 105, surah_number: 105, name_english: 'Al-Fil', name_arabic: 'الفيل', revelation_type: 'Meccan', ayah_count: 5 },
      { id: 106, surah_number: 106, name_english: 'Quraish', name_arabic: 'قريش', revelation_type: 'Meccan', ayah_count: 4 },
      { id: 107, surah_number: 107, name_english: 'Al-Ma`un', name_arabic: 'الماعون', revelation_type: 'Meccan', ayah_count: 7 },
      { id: 108, surah_number: 108, name_english: 'Al-Kawthar', name_arabic: 'الكوثر', revelation_type: 'Meccan', ayah_count: 3 },
      { id: 109, surah_number: 109, name_english: 'Al-Kafirun', name_arabic: 'الكافرون', revelation_type: 'Meccan', ayah_count: 6 },
      { id: 110, surah_number: 110, name_english: 'An-Nasr', name_arabic: 'النصر', revelation_type: 'Medinan', ayah_count: 3 },
      { id: 111, surah_number: 111, name_english: 'Al-Masad', name_arabic: 'المسد', revelation_type: 'Meccan', ayah_count: 5 },
      { id: 112, surah_number: 112, name_english: 'Al-Ikhlas', name_arabic: 'الإخلاص', revelation_type: 'Meccan', ayah_count: 4 },
      { id: 113, surah_number: 113, name_english: 'Al-Falaq', name_arabic: 'الفلق', revelation_type: 'Meccan', ayah_count: 5 },
      { id: 114, surah_number: 114, name_english: 'An-Nas', name_arabic: 'الناس', revelation_type: 'Meccan', ayah_count: 6 },
    ];

    await db.insert(surahs).values(surahMetadata);
    console.log('Surah metadata inserted.');

    for (const surahMeta of surahMetadata) {
      const surahNumber = surahMeta.surah_number;
      console.log(`Processing Surah ${surahNumber}...`);

      const response = await axios.get<SurahData>(`${QURAN_WBW_BASE_URL}${surahNumber}.json`);
      const surahData = response.data;

      let ayahUthmaniText = '';
      let ayahJuzNumber = 0;
      let ayahHizbNumber = 0;
      let ayahRubNumber = 0;
      let ayahManzilNumber = 0;
      let ayahSajda = 0;

      for (const ayahNumberStr in surahData) {
        const ayahNumber = parseInt(ayahNumberStr);
        const ayahContent = surahData[ayahNumberStr];

        // Construct Uthmani text for the ayah
        ayahUthmaniText = ayahContent.w.map(word => word.c).join(' ');

        // For Juz, Hizb, Rub, Manzil, Sajda, we need a more comprehensive metadata source.
        // For now, we'll use placeholder values or derive from surah/ayah number if possible.
        // A proper solution would involve fetching this from Tanzil metadata or a similar source.
        // For simplicity, we'll set them to 0 or a derived value.
        ayahJuzNumber = 0; // Placeholder
        ayahHizbNumber = 0; // Placeholder
        ayahRubNumber = 0; // Placeholder
        ayahManzilNumber = 0; // Placeholder
        ayahSajda = 0; // Placeholder

        const [insertedAyah] = await db.insert(ayahs).values({
          surah_id: surahMeta.id,
          ayah_number: ayahNumber,
          text_uthmani: ayahUthmaniText,
          juz_number: ayahJuzNumber,
          hizb_number: ayahHizbNumber,
          rub_number: ayahRubNumber,
          manzil_number: ayahManzilNumber,
          sajda: ayahSajda,
        });

        const ayahId = insertedAyah.insertId;

        const wordValues = ayahContent.w.map((word, index) => ({
          ayah_id: ayahId,
          word_number: index + 1,
          arabic_text: word.c,
          translation_english: word.e,
          transliteration_english: word.d,
          normalized_arabic_text: normalizeArabic(word.c), // Apply normalization
        }));

        if (wordValues.length > 0) {
          await db.insert(words).values(wordValues);
        }
      }
      console.log(`Surah ${surahNumber} data inserted.`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seed();
