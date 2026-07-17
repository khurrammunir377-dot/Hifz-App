import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { useAppState } from "@/state/app-state";

export default function SessionPreparationScreen() {
  const { learningPlan, preferences } = useAppState();
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader title="Session ready" eyebrow="Review your lesson" onBack={() => router.back()} />
        <SurfaceCard tone="emerald" style={styles.summary}>
          <View style={styles.summaryIcon}><MaterialIcons name="auto-stories" size={26} color={Brand.emerald} /></View>
          <Text style={styles.surah}>{learningPlan.currentSurah}</Text>
          <Text style={styles.range}>Ayahs {learningPlan.startAyah}–{learningPlan.endAyah}</Text>
          <View style={styles.metaRow}><Text style={styles.meta}>Juz {learningPlan.currentJuz}</Text><View style={styles.metaDot} /><Text style={styles.meta}>{preferences.teacherMode} teacher</Text></View>
        </SurfaceCard>
        <SurfaceCard>
          <Text style={styles.checkTitle}>Before you begin</Text>
          <PrepRow icon="mic-none" title="Find a quiet place" detail="Future listening works best with clear, close audio." />
          <PrepRow icon="volume-up" title="Check playback" detail={`Playback is set to ${preferences.playbackSpeed}×.`} />
          <PrepRow icon="favorite-border" title="Set your intention" detail="Keep the session focused and stop when you need rest." last />
        </SurfaceCard>
        <SurfaceCard tone="gold"><EmptyState icon="graphic-eq" title="Live teacher arrives in the AI phase" description="Microphone recording, verified word alignment, correction, and Tajweed analysis are intentionally not simulated in this UI phase." /></SurfaceCard>
        <PrimaryButton label="Return to lesson setup" variant="secondary" onPress={() => router.back()} />
      </ScrollView>
    </ScreenContainer>
  );
}

function PrepRow({ icon, title, detail, last = false }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; detail: string; last?: boolean }) {
  return <View style={[styles.prepRow, !last && styles.prepBorder]}><View style={styles.prepIcon}><MaterialIcons name={icon} size={20} color={Brand.emerald} /></View><View style={styles.prepCopy}><Text style={styles.prepTitle}>{title}</Text><Text style={styles.prepDetail}>{detail}</Text></View></View>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 22, gap: 18 },
  summary: { alignItems: "center", paddingVertical: 28 },
  summaryIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  surah: { color: Brand.surface, fontSize: 27, lineHeight: 33, fontWeight: "800" },
  range: { color: "#D7E8E2", fontSize: 15, lineHeight: 21, fontWeight: "700" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  meta: { color: "#D7E8E2", fontSize: 12, lineHeight: 16, fontWeight: "600" },
  metaDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Brand.gold },
  checkTitle: { color: Brand.ink, fontSize: 18, lineHeight: 23, fontWeight: "800", marginBottom: 4 },
  prepRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 13 },
  prepBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Brand.border },
  prepIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: Brand.emeraldSoft, alignItems: "center", justifyContent: "center" },
  prepCopy: { flex: 1, gap: 1 },
  prepTitle: { color: Brand.ink, fontSize: 14, lineHeight: 19, fontWeight: "700" },
  prepDetail: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
});
