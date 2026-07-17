import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { EmptyState } from "@/components/ui/empty-state";
import { MetricCard } from "@/components/ui/metric-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { useAppState } from "@/state/app-state";

export default function ProgressScreen() {
  const { learningPlan } = useAppState();
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <AppHeader title="Progress" eyebrow="Your learning" />
    <SurfaceCard style={styles.overview}><View style={styles.overviewCopy}><Text style={styles.overviewEyebrow}>Active plan</Text><Text style={styles.overviewTitle}>{learningPlan.currentSurah}</Text><Text style={styles.overviewText}>Ayahs {learningPlan.startAyah}–{learningPlan.endAyah} · Juz {learningPlan.currentJuz}</Text></View><ProgressRing value={learningPlan.progress} size={106} /></SurfaceCard>
    <View style={styles.metrics}><MetricCard icon="local-fire-department" label="Current streak" value={`${learningPlan.streak} days`} tone="gold" /><MetricCard icon="history" label="Revision due" value={`${learningPlan.revisionDue} items`} tone="warning" /></View>
    <SectionHeader title="Weekly consistency" subtitle="Complete sessions to build your activity record" />
    <SurfaceCard><View style={styles.week}><Day label="M" /><Day label="T" /><Day label="W" /><Day label="T" /><Day label="F" /><Day label="S" /><Day label="S" /></View><Text style={styles.weekNote}>No session activity has been recorded in this Phase 1 profile.</Text></SurfaceCard>
    <SectionHeader title="Revision health" subtitle="Due work is visible before weak-area AI is connected" />
    <SurfaceCard tone="gold" style={styles.revision}><View style={styles.revisionIcon}><MaterialIcons name="history-edu" size={24} color={Brand.gold} /></View><View style={styles.revisionCopy}><Text style={styles.revisionTitle}>{learningPlan.revisionDue} items need revision</Text><Text style={styles.revisionText}>Open Learn to set a focused range. Scheduled spaced repetition will be added with the learning engine.</Text></View></SurfaceCard>
    <SectionHeader title="Progress history" subtitle="Completed attempts will appear here" />
    <SurfaceCard><EmptyState icon="timeline" title="No completed sessions yet" description="History will show memorization attempts, revision outcomes, and evidence-based weak areas after real sessions are recorded." /></SurfaceCard>
  </ScrollView></ScreenContainer>;
}

function Day({ label }: { label: string }) { return <View style={styles.day}><Text style={styles.dayLabel}>{label}</Text><View style={styles.dayDot} /></View>; }

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32, gap: 18 },
  overview: { flexDirection: "row", alignItems: "center", gap: 14 },
  overviewCopy: { flex: 1, gap: 3 },
  overviewEyebrow: { color: Brand.emerald, fontSize: 11, lineHeight: 15, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  overviewTitle: { color: Brand.ink, fontSize: 24, lineHeight: 30, fontWeight: "800" },
  overviewText: { color: Brand.sage, fontSize: 13, lineHeight: 18 },
  metrics: { flexDirection: "row", gap: 10 },
  week: { flexDirection: "row", justifyContent: "space-between" },
  day: { alignItems: "center", gap: 8 },
  dayLabel: { color: Brand.sage, fontSize: 11, lineHeight: 15, fontWeight: "700" },
  dayDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: Brand.border, backgroundColor: Brand.ivory },
  weekNote: { color: Brand.sage, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 12 },
  revision: { flexDirection: "row", alignItems: "center", gap: 12 },
  revisionIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center" },
  revisionCopy: { flex: 1, gap: 2 },
  revisionTitle: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  revisionText: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
});
