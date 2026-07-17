import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { SURAHS } from "../constants/quran-catalog";
import { formatAyahTarget, normalizeAyahRange } from "../domain/learning-plan";
import { isValidAyahRange } from "../domain/quran";
import { formatDashboardDate } from "../hooks/use-current-time";
import { appStateReducer, initialAppState } from "../state/app-state";

describe("Hifz Phase 1 domain rules", () => {
  it("normalizes an Ayah range within the selected Surah", () => {
    expect(normalizeAyahRange(0, 99, 7)).toEqual({ startAyah: 1, endAyah: 7 });
    expect(normalizeAyahRange(5, 3, 10)).toEqual({ startAyah: 5, endAyah: 5 });
    expect(normalizeAyahRange(30, 40, 20)).toEqual({ startAyah: 20, endAyah: 20 });
  });

  it("formats single and multi-Ayah targets clearly", () => {
    expect(formatAyahTarget(3, 3)).toBe("Ayah 3");
    expect(formatAyahTarget(1, 5)).toBe("Ayahs 1–5");
  });

  it("rejects invalid or reversed Quran references", () => {
    expect(isValidAyahRange({ start: { surahNumber: 1, ayahNumber: 1 }, end: { surahNumber: 1, ayahNumber: 7 } })).toBe(true);
    expect(isValidAyahRange({ start: { surahNumber: 2, ayahNumber: 1 }, end: { surahNumber: 1, ayahNumber: 7 } })).toBe(false);
    expect(isValidAyahRange({ start: { surahNumber: 0, ayahNumber: 1 }, end: { surahNumber: 1, ayahNumber: 7 } })).toBe(false);
  });

  it("transitions onboarding, sign-in, profile, plan, and preferences without mutating other state", () => {
    const onboarded = appStateReducer(initialAppState, { type: "COMPLETE_ONBOARDING" });
    const signedIn = appStateReducer(onboarded, { type: "SIGN_IN", payload: { name: "Yusuf" } });
    const updatedPlan = appStateReducer(signedIn, { type: "UPDATE_PLAN", payload: { currentJuz: 29, startAyah: 2, endAyah: 4 } });
    const updatedPreferences = appStateReducer(updatedPlan, { type: "UPDATE_PREFERENCES", payload: { teacherMode: "Gentle" } });

    expect(updatedPreferences.onboardingComplete).toBe(true);
    expect(updatedPreferences.signedIn).toBe(true);
    expect(updatedPreferences.profile.name).toBe("Yusuf");
    expect(updatedPreferences.learningPlan).toMatchObject({ currentJuz: 29, startAyah: 2, endAyah: 4 });
    expect(updatedPreferences.preferences.teacherMode).toBe("Gentle");
    expect(initialAppState.signedIn).toBe(false);
  });

  it("formats a live dashboard date into day, date, and time fields", () => {
    const formatted = formatDashboardDate(new Date(2026, 6, 15, 13, 5), "en-US");
    expect(formatted.day).toBe("Wednesday");
    expect(formatted.date).toContain("July 15");
    expect(formatted.time).toMatch(/1:05\sPM/i);
  });

  it("keeps structural Surah metadata complete, sequential, and unique", () => {
    expect(SURAHS).toHaveLength(114);
    expect(SURAHS.map((item) => item.number)).toEqual(Array.from({ length: 114 }, (_, index) => index + 1));
    expect(new Set(SURAHS.map((item) => item.number)).size).toBe(114);
    expect(SURAHS.every((item) => item.name.length > 0 && item.ayahCount > 0)).toBe(true);
  });

  it("ships every Phase 1 route required by the product flow", () => {
    const routes = [
      "app/index.tsx",
      "app/onboarding.tsx",
      "app/auth/welcome.tsx",
      "app/auth/sign-in.tsx",
      "app/auth/register.tsx",
      "app/(tabs)/index.tsx",
      "app/(tabs)/learn.tsx",
      "app/(tabs)/progress.tsx",
      "app/(tabs)/profile.tsx",
      "app/(tabs)/settings.tsx",
      "app/session-prep.tsx",
      "app/edit-profile.tsx",
      "app/settings/language.tsx",
      "app/settings/teacher-mode.tsx",
      "app/settings/audio.tsx",
      "app/settings/privacy.tsx",
    ];

    expect(routes.filter((route) => !existsSync(resolve(process.cwd(), route)))).toEqual([]);
  });
});
