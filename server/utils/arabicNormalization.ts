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
  // normalizedText = normalizedText.replace(/[^\u0600-\u06FF\s]/g, '');

  return normalizedText.trim();
}
