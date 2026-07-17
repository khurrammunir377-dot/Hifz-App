import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { MetricCard } from "@/components/ui/metric-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionHeader } from "@/components/ui/section-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { formatDashboardDate, useCurrentTime } from "@/hooks/use-current-time";
import { useAppState } from "@/state/app-state";

export default function HomeScreen() {
  const { profile, learningPlan, preferences } = useAppState();
  const now = useCurrentTime();
  const date = formatDashboardDate(now, preferences.language === "English" ? "en" : "en");
  const firstName = profile.name.trim().split(" ")[0] || "Student";

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.greeting}>
            <Text style={styles.eyebrow}>{date.day} · {date.time}</Text>
            <Text style={styles.title}>Assalamu alaikum, {firstName}</Text>
            <Text style={styles.date}>{date.date}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text></View>
        </View>

        <SurfaceCard tone="emerald" style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <View style={styles.targetBadge}>
              <MaterialIcons name="today" size={18} color={Brand.emerald} />
              <Text style={styles.targetBadgeText}>Today&apos;s target</Text>
            </View>
            <Text style={styles.targetMeta}>Juz {learningPlan.currentJuz}</Text>
          </View>
          <Text style={styles.targetTitle}>{learningPlan.currentSurah}</Text>
          <Text style={styles.targetRange}>{learningPlan.dailyTarget}</Text>
          <View style={styles.targetAction}>
            <PrimaryButton label="Start memorizing" icon="mic" onPress={() => router.push("/(tabs)/learn")} />
          </View>
        </SurfaceCard>

        <View style={styles.section}>
          <SectionHeader title="Your learning" subtitle="A quick view of your active plan" />
        </View>
        <View style={styles.metrics}>
          <MetricCard icon="auto-stories" label="Current Juz" value={`${learningPlan.currentJuz}`} />
          <MetricCard icon="menu-book" label="Current Surah" value={learningPlan.currentSurah} tone="gold" />
          <MetricCard icon="history" label="Revision due" value={`${learningPlan.revisionDue} items`} tone="warning" />
          <MetricCard icon="local-fire-department" label="Learning streak" value={`${learningPlan.streak} days`} tone="gold" />
        </View>

        <SurfaceCard onPress={() => router.push("/(tabs)/progress")} style={styles.progressCard}>
          <View style={styles.progressCopy}>
            <Text style={styles.progressEyebrow}>Memorization plan</Text>
            <Text style={styles.progressTitle}>Keep your steady pace</Text>
            <Text style={styles.progressBody}>Your current plan is {learningPlan.progress}% complete. Review due items before adding a larger range.</Text>
            <View style={styles.viewRow}>
              <Text style={styles.viewText}>View progress</Text>
              <MaterialIcons name="arrow-forward" size={18} color={Brand.emerald} />
            </View>
          </View>
          <ProgressRing value={learningPlan.progress} size={96} />
        </SurfaceCard>

        <SurfaceCard tone="gold" style={styles.revisionCard}>
          <View style={styles.revisionIcon}><MaterialIcons name="tips-and-updates" size={24} color={Brand.gold} /></View>
          <View style={styles.revisionCopy}>
            <Text style={styles.revisionTitle}>Revision first</Text>
            <Text style={styles.revisionText}>{learningPlan.revisionDue} revision items are due. A balanced session protects previous memorization.</Text>
          </View>
        </SurfaceCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 30, gap: 18 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  greeting: { flex: 1, gap: 2 },
  eyebrow: { color: Brand.emerald, fontSize: 12, lineHeight: 17, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  title: { color: Brand.ink, fontSize: 25, lineHeight: 31, fontWeight: "800", letterSpacing: -0.5 },
  date: { color: Brand.sage, fontSize: 13, lineHeight: 18 },
  avatar: { width: 48, height: 48, borderRadius: 18, backgroundColor: Brand.goldSoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EAD7A5" },
  avatarText: { color: Brand.emerald, fontSize: 20, lineHeight: 24, fontWeight: "800" },
  targetCard: { padding: 20, gap: 7 },
  targetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  targetBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Brand.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  targetBadgeText: { color: Brand.emerald, fontSize: 11, lineHeight: 15, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  targetMeta: { color: "#D7E8E2", fontSize: 13, lineHeight: 18, fontWeight: "700" },
  targetTitle: { color: Brand.surface, fontSize: 30, lineHeight: 36, fontWeight: "800", marginTop: 8 },
  targetRange: { color: "#D7E8E2", fontSize: 15, lineHeight: 21, fontWeight: "600" },
  targetAction: { marginTop: 12 },
  section: { marginTop: 4 },
  metrics: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  progressCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  progressCopy: { flex: 1, gap: 4 },
  progressEyebrow: { color: Brand.emerald, fontSize: 11, lineHeight: 15, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  progressTitle: { color: Brand.ink, fontSize: 18, lineHeight: 23, fontWeight: "800" },
  progressBody: { color: Brand.sage, fontSize: 12, lineHeight: 18 },
  viewRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  viewText: { color: Brand.emerald, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  revisionCard: { flexDirection: "row", alignItems: "center", gap: 12 },
  revisionIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center" },
  revisionCopy: { flex: 1, gap: 2 },
  revisionTitle: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  revisionText: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
});
