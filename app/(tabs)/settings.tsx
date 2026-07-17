import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { SettingsRow } from "@/components/ui/settings-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";
import { useAppState } from "@/state/app-state";

export default function SettingsScreen() {
  const { preferences, signOut } = useAppState();
  const confirmSignOut = () => Alert.alert("Sign out?", "Your Phase 1 profile remains stored on this device.", [{ text: "Cancel", style: "cancel" }, { text: "Sign out", style: "destructive", onPress: () => { signOut(); router.replace("/auth/welcome" as never); } }]);
  return <ScreenContainer><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <AppHeader title="Settings" eyebrow="Preferences" />
    <View style={styles.intro}><Text style={styles.introText}>Personalize how Hifz supports your learning. AI and microphone controls remain transparent and opt-in.</Text></View>
    <Text style={styles.groupLabel}>Learning experience</Text>
    <SurfaceCard><SettingsRow icon="language" label="Language" value={preferences.language} onPress={() => router.push("/settings/language" as never)} /><SettingsRow icon="record-voice-over" label="Teacher mode" value={preferences.teacherMode} onPress={() => router.push("/settings/teacher-mode" as never)} /><SettingsRow icon="volume-up" label="Audio settings" value={`${preferences.playbackSpeed}×`} onPress={() => router.push("/settings/audio" as never)} isLast /></SurfaceCard>
    <Text style={styles.groupLabel}>Trust and privacy</Text>
    <SurfaceCard><SettingsRow icon="shield" label="Privacy" value={preferences.saveRecitations ? "Custom" : "Private"} onPress={() => router.push("/settings/privacy" as never)} /><SettingsRow icon="info-outline" label="About Hifz" value="Phase 1" onPress={() => Alert.alert("Hifz Quran Teacher", "Professional UI foundation for guided Quran memorization. Verified Quran and AI listening services are planned for later governed phases.")} isLast /></SurfaceCard>
    <SurfaceCard tone="gold" style={styles.safety}><MaterialIcons name="verified-user" size={22} color={Brand.gold} /><View style={styles.safetyCopy}><Text style={styles.safetyTitle}>Designed for Quran accuracy</Text><Text style={styles.safetyText}>Generative AI will not be used as a Quran text source. Verified content, evidence, and confidence controls are architectural requirements.</Text></View></SurfaceCard>
    <SurfaceCard onPress={confirmSignOut} style={styles.signOut}><MaterialIcons name="logout" size={20} color={Brand.error} /><Text style={styles.signOutText}>Sign out</Text></SurfaceCard>
    <Text style={styles.version}>Hifz Quran Teacher · Phase 1 UI</Text>
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 34, gap: 16 },
  intro: { marginTop: -7 },
  introText: { color: Brand.sage, fontSize: 14, lineHeight: 21 },
  groupLabel: { color: Brand.sage, fontSize: 11, lineHeight: 15, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3, marginLeft: 3 },
  safety: { flexDirection: "row", alignItems: "flex-start", gap: 11 },
  safetyCopy: { flex: 1, gap: 2 },
  safetyTitle: { color: Brand.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  safetyText: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
  signOut: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14 },
  signOutText: { color: Brand.error, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  version: { color: Brand.sage, fontSize: 11, lineHeight: 16, textAlign: "center" },
});
