import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { haptic } from "@/lib/haptics";
import { useAppState, type TeacherMode } from "@/state/app-state";

const MODES: { value: TeacherMode; description: string }[] = [
  { value: "Gentle", description: "Softer pacing with extra encouragement between corrections." },
  { value: "Balanced", description: "Even pacing that blends encouragement with direct feedback." },
  { value: "Focused", description: "Faster pacing with concise, direct correction." },
];

export default function TeacherModeScreen() {
  const { preferences, updatePreferences } = useAppState();

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader title="Teacher mode" eyebrow="Learning experience" onBack={() => router.back()} />
        <Text style={styles.label}>Correction style</Text>
        <SurfaceCard>
          {MODES.map((mode, index) => {
            const isSelected = preferences.teacherMode === mode.value;
            return (
              <Pressable
                key={mode.value}
                accessibilityRole="button"
                onPress={() => {
                  haptic.selection();
                  updatePreferences({ teacherMode: mode.value });
                }}
                style={({ pressed }) => [
                  styles.row,
                  index < MODES.length - 1 && styles.border,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.rowCopy}>
                  <Text style={styles.rowLabel}>{mode.value}</Text>
                  <Text style={styles.rowDescription}>{mode.description}</Text>
                </View>
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
            Teacher mode shapes the tone of written feedback during Phase 1. Live spoken coaching
            arrives in a later phase.
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
  row: { minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, gap: 10 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Brand.border },
  rowCopy: { flex: 1, gap: 2 },
  rowLabel: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "600" },
  rowDescription: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
  pressed: { opacity: 0.65 },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  noteText: { flex: 1, color: Brand.sage, fontSize: 12, lineHeight: 18 },
});
