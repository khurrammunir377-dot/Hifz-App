import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Brand, Radius } from "@/constants/design";
import { haptic } from "@/lib/haptics";
import { useAppState } from "@/state/app-state";

const pages = [
  {
    icon: "menu-book" as const,
    title: "A clear path to memorization",
    body: "Set a focused Ayah range, follow a daily target, and build your Hifz with consistent sessions.",
  },
  {
    icon: "autorenew" as const,
    title: "Revision at the right time",
    body: "See what is due today, protect older memorization, and make steady revision part of your routine.",
  },
  {
    icon: "graphic-eq" as const,
    title: "Prepared for guided listening",
    body: "Future phases will add verified recitation alignment and Tajweed feedback with Quran accuracy safeguards.",
  },
];

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const { completeOnboarding } = useAppState();
  const { height } = useWindowDimensions();
  const current = pages[page];

  const finish = () => {
    completeOnboarding();
    router.replace("/auth/welcome" as never);
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View style={[styles.container, height < 700 && styles.compact]}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>Hifz</Text>
          <Pressable onPress={finish} style={({ pressed }) => pressed && styles.pressed}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.artwork}>
            <View style={styles.outerRing}>
              <View style={styles.innerRing}><MaterialIcons name={current.icon} size={58} color={Brand.emerald} /></View>
            </View>
            <View style={styles.star}><MaterialIcons name="auto-awesome" size={20} color={Brand.gold} /></View>
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>Step {page + 1} of {pages.length}</Text>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.body}>{current.body}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {pages.map((item, index) => <View key={item.title} style={[styles.dot, page === index && styles.activeDot]} />)}
          </View>
          <PrimaryButton
            label={page === pages.length - 1 ? "Get started" : "Continue"}
            icon="arrow-forward"
            onPress={() => {
              if (page === pages.length - 1) finish();
              else {
                haptic.selection();
                setPage((value) => value + 1);
              }
            }}
          />
          {page > 0 ? (
            <Pressable onPress={() => setPage((value) => value - 1)} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : <View style={styles.back} />}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 16, justifyContent: "space-between" },
  compact: { paddingVertical: 8 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { color: Brand.emerald, fontSize: 22, lineHeight: 28, fontWeight: "800" },
  skip: { color: Brand.sage, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  content: { flex: 1, justifyContent: "center", gap: 32 },
  artwork: { alignSelf: "center", width: 220, height: 220, alignItems: "center", justifyContent: "center" },
  outerRing: { width: 206, height: 206, borderRadius: 103, backgroundColor: Brand.goldSoft, alignItems: "center", justifyContent: "center" },
  innerRing: { width: 156, height: 156, borderRadius: 78, backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.border, alignItems: "center", justifyContent: "center" },
  star: { position: "absolute", right: 12, top: 26, width: 44, height: 44, borderRadius: 22, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Brand.border },
  copy: { alignItems: "center", gap: 10 },
  eyebrow: { color: Brand.emerald, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { color: Brand.ink, fontSize: 31, lineHeight: 38, fontWeight: "800", textAlign: "center", letterSpacing: -0.7, maxWidth: 340 },
  body: { color: Brand.sage, fontSize: 15, lineHeight: 23, textAlign: "center", maxWidth: 340 },
  footer: { gap: 12 },
  dots: { height: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
  dot: { width: 7, height: 7, borderRadius: Radius.pill, backgroundColor: "#C8D4D0" },
  activeDot: { width: 24, backgroundColor: Brand.emerald },
  back: { height: 32, alignItems: "center", justifyContent: "center" },
  backText: { color: Brand.sage, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  pressed: { opacity: 0.6 },
});
