import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { haptic } from "@/lib/haptics";
import { useAppState } from "@/state/app-state";

const LANGUAGES = ["English", "Arabic", "Urdu"] as const;

export default function LanguageScreen() {
  const { preferences, updatePreferences } = useAppState();

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader title="Language" eyebrow="Learning experience" onBack={() => router.back()} />
        <Text style={styles.label}>App language</Text>
        <SurfaceCard>
          {LANGUAGES.map((language, index) => {
            const isSelected = preferences.language === language;
            return (
              <Pressable
                key={language}
                accessibilityRole="button"
                onPress={() => {
                  haptic.selection();
                  updatePreferences({ language });
                }}
                style={({ pressed }) => [
                  styles.row,
                  index < LANGUAGES.length - 1 && styles.border,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.rowLabel}>{language}</Text>
                {isSelected ? (
                  <MaterialIcons name="check-circle" size={21} color={Brand.emerald} />
                ) : (
                  <MaterialIcons name="radio-button-unchecked" size={21} color={Brand.border} />
                )}
              </Pressable>
            );
          })}
        </SurfaceCard>
        <SurfaceCard tone="gold" style={styles.note}>
          <MaterialIcons name="info-outline" size={22} color={Brand.gold} />
          <Text style={styles.noteText}>
            Arabic and Urdu translations are being finalized. Some screens may still appear in
            English during Phase 1.
          </Text>
        </SurfaceCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 22, gap: 16 },
  label: {
    color: Brand.sage,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  row: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Brand.border },
  rowLabel: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "600" },
  pressed: { opacity: 0.65 },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  noteText: { flex: 1, color: Brand.sage, fontSize: 12, lineHeight: 18 },
});
