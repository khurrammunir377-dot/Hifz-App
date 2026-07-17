import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SectionHeader } from "@/components/ui/section-header";
import { SettingsRow } from "@/components/ui/settings-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { useAppState } from "@/state/app-state";

export default function ProfileScreen() {
  const { profile, learningPlan } = useAppState();
  const initial = profile.name.trim().charAt(0).toUpperCase() || "S";
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <AppHeader title="Student profile" eyebrow="Your learning" actionIcon="edit" onAction={() => router.push("/edit-profile" as never)} />
    <SurfaceCard style={styles.identity}><View style={styles.avatar}><Text style={styles.avatarText}>{initial}</Text></View><View style={styles.identityCopy}><Text style={styles.name}>{profile.name}</Text><Text style={styles.email}>{profile.email}</Text><View style={styles.badge}><Text style={styles.badgeText}>{profile.ageGroup} learner</Text></View></View></SurfaceCard>
    <SectionHeader title="Learning goal" subtitle="Your current memorization direction" />
    <SurfaceCard tone="emerald" style={styles.goal}><View style={styles.goalCopy}><Text style={styles.goalLabel}>Primary goal</Text><Text style={styles.goalText}>{profile.goal}</Text><Text style={styles.goalMeta}>{learningPlan.dailyTarget} per active lesson · Juz {learningPlan.currentJuz}</Text></View><MaterialIcons name="flag" size={30} color={Brand.gold} /></SurfaceCard>
    <SectionHeader title="Plan progress" subtitle="Progress within the active starter plan" />
    <SurfaceCard style={styles.plan}><ProgressRing value={learningPlan.progress} size={94} /><View style={styles.planCopy}><Text style={styles.planTitle}>{learningPlan.currentSurah}</Text><Text style={styles.planText}>Current lesson: Ayahs {learningPlan.startAyah}–{learningPlan.endAyah}</Text><Text style={styles.planText}>{learningPlan.revisionDue} revision items due</Text></View></SurfaceCard>
    <SectionHeader title="Profile details" />
    <SurfaceCard><SettingsRow icon="person-outline" label="Age group" value={profile.ageGroup} /><SettingsRow icon="track-changes" label="Learning pace" value="Steady daily" /><SettingsRow icon="insights" label="Progress history" value="View" onPress={() => router.push("/(tabs)/progress")} isLast /></SurfaceCard>
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32, gap: 18 },
  identity: { flexDirection: "row", alignItems: "center", gap: 15 },
  avatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: Brand.goldSoft, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E8D39E" },
  avatarText: { color: Brand.emerald, fontSize: 30, lineHeight: 36, fontWeight: "800" },
  identityCopy: { flex: 1, gap: 2 },
  name: { color: Brand.ink, fontSize: 22, lineHeight: 28, fontWeight: "800" },
  email: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
  badge: { alignSelf: "flex-start", backgroundColor: Brand.emeraldSoft, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, marginTop: 5 },
  badgeText: { color: Brand.emerald, fontSize: 10, lineHeight: 14, fontWeight: "800" },
  goal: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  goalCopy: { flex: 1, gap: 4 },
  goalLabel: { color: "#CEE2DA", fontSize: 11, lineHeight: 15, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  goalText: { color: Brand.surface, fontSize: 18, lineHeight: 24, fontWeight: "800" },
  goalMeta: { color: "#CEE2DA", fontSize: 12, lineHeight: 17 },
  plan: { flexDirection: "row", alignItems: "center", gap: 18 },
  planCopy: { flex: 1, gap: 3 },
  planTitle: { color: Brand.ink, fontSize: 18, lineHeight: 23, fontWeight: "800" },
  planText: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
});
