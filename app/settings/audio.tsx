import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { SettingsRow } from "@/components/ui/settings-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { haptic } from "@/lib/haptics";
import { useAppState } from "@/state/app-state";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5] as const;

export default function AudioScreen() {
  const { preferences, updatePreferences } = useAppState();

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader title="Audio settings" eyebrow="Learning experience" onBack={() => router.back()} />
        <Text style={styles.label}>Playback speed</Text>
        <SurfaceCard style={styles.speedRow}>
          {SPEEDS.map((speed) => {
            const isSelected = preferences.playbackSpeed === speed;
            return (
              <Pressable
                key={speed}
                accessibilityRole="button"
                onPress={() => {
                  haptic.selection();
                  updatePreferences({ playbackSpeed: speed });
                }}
                style={({ pressed }) => [
                  styles.speedChip,
                  isSelected && styles.speedChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.speedChipText, isSelected && styles.speedChipTextSelected]}>
                  {speed}×
                </Text>
              </Pressable>
            );
          })}
        </SurfaceCard>
        <Text style={styles.label}>Playback</Text>
        <SurfaceCard>
          <SettingsRow
            icon="replay"
            label="Auto-replay Ayah after mistake"
            switchValue={preferences.autoReplay}
            onSwitchChange={(autoReplay) => updatePreferences({ autoReplay })}
            isLast
          />
        </SurfaceCard>
        <Text style={styles.label}>Reciter</Text>
        <SurfaceCard>
          <View style={styles.reciterRow}>
            <MaterialIcons name="record-voice-over" size={19} color={Brand.emerald} />
            <Text style={styles.reciterText}>{preferences.reciter}</Text>
          </View>
        </SurfaceCard>
        <SurfaceCard tone="gold" style={styles.note}>
          <MaterialIcons name="info-outline" size={22} color={Brand.gold} />
          <Text style={styles.noteText}>
            Reciter selection opens up once verified audio sources are connected in a later phase.
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
  speedRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  speedChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.ivory,
  },
  speedChipSelected: { backgroundColor: Brand.emerald, borderColor: Brand.emerald },
  speedChipText: { color: Brand.ink, fontSize: 14, fontWeight: "700" },
  speedChipTextSelected: { color: Brand.surface },
  pressed: { opacity: 0.65 },
  reciterRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 40 },
  reciterText: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "600" },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  noteText: { flex: 1, color: Brand.sage, fontSize: 12, lineHeight: 18 },
});
