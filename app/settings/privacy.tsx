import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { SettingsRow } from "@/components/ui/settings-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { useAppState } from "@/state/app-state";

export default function PrivacyScreen() {
  const { preferences, updatePreferences } = useAppState();
  return <ScreenContainer edges={["top", "bottom", "left", "right"]}><ScrollView contentContainerStyle={styles.content}><AppHeader title="Privacy" eyebrow="Your recitation data" onBack={() => router.back()} /><SurfaceCard tone="emerald" style={styles.hero}><MaterialIcons name="shield" size={30} color={Brand.gold} /><View style={styles.heroCopy}><Text style={styles.heroTitle}>Private by default</Text><Text style={styles.heroText}>Phase 1 keeps profile and preference data on this device. No recitation audio is recorded or uploaded.</Text></View></SurfaceCard><Text style={styles.label}>Future audio controls</Text><SurfaceCard><SettingsRow icon="save-alt" label="Save recitation recordings" switchValue={preferences.saveRecitations} onSwitchChange={(saveRecitations) => updatePreferences({ saveRecitations })} /><SettingsRow icon="analytics" label="Use de-identified data to improve accuracy" switchValue={preferences.improvementAnalytics} onSwitchChange={(improvementAnalytics) => updatePreferences({ improvementAnalytics })} isLast /></SurfaceCard><SurfaceCard tone="gold" style={styles.note}><MaterialIcons name="info-outline" size={22} color={Brand.gold} /><Text style={styles.noteText}>These controls prepare the product model only. They do not activate recording, analytics, or network transfer in Phase 1.</Text></SurfaceCard><Text style={styles.label}>Planned safeguards</Text><SurfaceCard><Safeguard text="Explicit microphone permission at session start" /><Safeguard text="Encryption in transit and at rest" /><Safeguard text="Configurable retention and deletion" /><Safeguard text="Separate parental consent for child accounts" last /></SurfaceCard></ScrollView></ScreenContainer>;
}

function Safeguard({ text, last = false }: { text: string; last?: boolean }) { return <View style={[styles.guard, !last && styles.guardBorder]}><MaterialIcons name="check-circle" size={19} color={Brand.success} /><Text style={styles.guardText}>{text}</Text></View>; }

const styles = StyleSheet.create({ content: { padding: 22, gap: 16 }, hero: { flexDirection: "row", alignItems: "flex-start", gap: 12 }, heroCopy: { flex: 1, gap: 3 }, heroTitle: { color: Brand.surface, fontSize: 17, lineHeight: 22, fontWeight: "800" }, heroText: { color: "#D5E7E0", fontSize: 12, lineHeight: 18 }, label: { color: Brand.sage, fontSize: 11, lineHeight: 15, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }, note: { flexDirection: "row", alignItems: "flex-start", gap: 10 }, noteText: { flex: 1, color: Brand.sage, fontSize: 12, lineHeight: 18 }, guard: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: 10 }, guardBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Brand.border }, guardText: { flex: 1, color: Brand.ink, fontSize: 13, lineHeight: 18, fontWeight: "600" } });
