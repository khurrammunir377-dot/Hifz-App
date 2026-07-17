import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { BrandMark } from "@/components/ui/brand-mark";
import { Brand } from "@/constants/design";
import { useAppState } from "@/state/app-state";

export default function LaunchScreen() {
  const { hydrated, onboardingComplete, signedIn } = useAppState();

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      if (!onboardingComplete) router.replace("/onboarding");
      else if (!signedIn) router.replace("/auth/welcome" as never);
      else router.replace("/(tabs)");
    }, 700);
    return () => clearTimeout(timer);
  }, [hydrated, onboardingComplete, signedIn]);

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-primary">
      <View style={styles.container}>
        <BrandMark size={118} />
        <View style={styles.copy}>
          <Text style={styles.title}>Hifz</Text>
          <Text style={styles.subtitle}>Learn steadily. Revise wisely.</Text>
        </View>
        <Text style={styles.note}>Quran Memorization Teacher</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Brand.emerald, padding: 28 },
  copy: { alignItems: "center", marginTop: 22, gap: 5 },
  title: { color: Brand.surface, fontSize: 46, lineHeight: 54, fontWeight: "800", letterSpacing: -1.2 },
  subtitle: { color: "#DCECE6", fontSize: 16, lineHeight: 22, fontWeight: "600", textAlign: "center" },
  note: { position: "absolute", bottom: 32, color: "#BFD8CF", fontSize: 12, lineHeight: 17, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" },
});
