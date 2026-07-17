import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { BrandMark } from "@/components/ui/brand-mark";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand } from "@/constants/design";

export default function WelcomeScreen() {
  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View style={styles.container}>
        <BrandMark size={62} showName />
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Begin with intention</Text>
          <Text style={styles.title}>Your memorization journey, organized.</Text>
          <Text style={styles.body}>Create a student profile to set targets, manage revision, and prepare for guided recitation feedback.</Text>
        </View>
        <SurfaceCard tone="gold" style={styles.trustCard}>
          <View style={styles.trustIcon}><MaterialIcons name="verified-user" size={22} color={Brand.emerald} /></View>
          <View style={styles.trustCopy}>
            <Text style={styles.trustTitle}>Quran accuracy comes first</Text>
            <Text style={styles.trustText}>Verified Uthmani content and AI listening are reserved for governed service integrations in later phases.</Text>
          </View>
        </SurfaceCard>
        <View style={styles.actions}>
          <PrimaryButton label="Create student account" icon="arrow-forward" onPress={() => router.push("/auth/register" as never)} />
          <PrimaryButton label="I already have an account" variant="secondary" onPress={() => router.push("/auth/sign-in" as never)} />
          <Text style={styles.legal}>By continuing, you agree to the future Terms of Service and Privacy Policy. Phase 1 stores preview preferences locally.</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 20, gap: 24 },
  hero: { flex: 1, justifyContent: "center", gap: 11 },
  eyebrow: { color: Brand.emerald, fontSize: 13, lineHeight: 18, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.9 },
  title: { color: Brand.ink, fontSize: 36, lineHeight: 43, fontWeight: "800", letterSpacing: -1 },
  body: { color: Brand.sage, fontSize: 16, lineHeight: 24, maxWidth: 390 },
  trustCard: { flexDirection: "row", gap: 12 },
  trustIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center" },
  trustCopy: { flex: 1, gap: 3 },
  trustTitle: { color: Brand.ink, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  trustText: { color: Brand.sage, fontSize: 12, lineHeight: 17 },
  actions: { gap: 12 },
  legal: { color: Brand.sage, fontSize: 11, lineHeight: 16, textAlign: "center", paddingHorizontal: 8 },
});
