import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SelectionRow } from "@/components/ui/selection-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Brand, Radius } from "@/constants/design";
import { SURAHS } from "@/constants/quran-catalog";
import { formatAyahTarget, normalizeAyahRange } from "@/domain/learning-plan";
import { haptic } from "@/lib/haptics";
import { useAppState } from "@/state/app-state";

type PickerMode = "juz" | "surah" | null;

export default function LearnScreen() {
  const { learningPlan, updateLearningPlan } = useAppState();
  const [picker, setPicker] = useState<PickerMode>(null);
  const [search, setSearch] = useState("");
  const selectedSurah = SURAHS.find((item) => item.number === learningPlan.surahNumber) ?? SURAHS[77];
  const filteredSurahs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return SURAHS;
    return SURAHS.filter((item) => item.name.toLowerCase().includes(query) || String(item.number) === query);
  }, [search]);
  const updateAyah = (field: "startAyah" | "endAyah", change: number) => {
    const nextValue = learningPlan[field] + change;
    const normalized = normalizeAyahRange(
      field === "startAyah" ? nextValue : learningPlan.startAyah,
      field === "endAyah" ? nextValue : learningPlan.endAyah,
      selectedSurah.ayahCount,
    );
    updateLearningPlan({ ...normalized, dailyTarget: formatAyahTarget(normalized.startAyah, normalized.endAyah) });
    haptic.selection();
  };
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader title="Choose your lesson" eyebrow="Quran memorization" />
        <Text style={styles.intro}>Set a focused range for today. You can adjust the plan again before the session begins.</Text>
        <View style={styles.steps}>
          <View style={styles.step}><Text style={styles.stepNumber}>1</Text><Text style={styles.stepText}>Location</Text></View>
          <View style={styles.stepLine} />
          <View style={styles.step}><Text style={styles.stepNumber}>2</Text><Text style={styles.stepText}>Ayahs</Text></View>
          <View style={styles.stepLine} />
          <View style={styles.step}><Text style={styles.stepNumber}>3</Text><Text style={styles.stepText}>Review</Text></View>
        </View>
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Select location</Text>
          <SelectionRow label="Juz" value={`Juz ${learningPlan.currentJuz}`} icon="auto-stories" onPress={() => setPicker("juz")} />
          <SelectionRow label="Surah" value={`${selectedSurah.number}. ${selectedSurah.name}`} icon="menu-book" helper={`${selectedSurah.ayahCount} Ayahs`} onPress={() => setPicker("surah")} />
        </View>
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Select Ayah range</Text>
          <SurfaceCard style={styles.rangeCard}>
            <AyahStepper label="Start Ayah" value={learningPlan.startAyah} onDecrease={() => updateAyah("startAyah", -1)} onIncrease={() => updateAyah("startAyah", 1)} />
            <View style={styles.rangeDivider} />
            <AyahStepper label="End Ayah" value={learningPlan.endAyah} onDecrease={() => updateAyah("endAyah", -1)} onIncrease={() => updateAyah("endAyah", 1)} />
          </SurfaceCard>
          <Text style={styles.rangeHint}>{learningPlan.endAyah - learningPlan.startAyah + 1} Ayahs selected · Surah limit: {selectedSurah.ayahCount}</Text>
        </View>
        <SurfaceCard tone="gold" style={styles.accuracyCard}>
          <MaterialIcons name="verified" size={23} color={Brand.gold} />
          <Text style={styles.accuracyText}>Verified Uthmani Quran text and live recitation analysis will be connected through governed services. This phase does not display or generate Quran verses.</Text>
        </SurfaceCard>
          <PrimaryButton label="Review session" icon="arrow-forward" onPress={() => router.push("/session-prep" as never)} />
      </ScrollView>

      <Modal animationType="slide" transparent visible={picker !== null} onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.scrim} onPress={() => setPicker(null)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}><Text style={styles.sheetTitle}>{picker === "juz" ? "Select Juz" : "Select Surah"}</Text><Pressable accessibilityLabel="Close selector" onPress={() => setPicker(null)} style={styles.close}><MaterialIcons name="close" size={21} color={Brand.ink} /></Pressable></View>
          {picker === "surah" ? <View style={styles.search}><MaterialIcons name="search" size={20} color={Brand.sage} /><TextInput value={search} onChangeText={setSearch} placeholder="Search by name or number" placeholderTextColor="#87958F" style={styles.searchInput} /></View> : null}
          {picker === "juz" ? (
            <FlatList data={Array.from({ length: 30 }, (_, index) => index + 1)} keyExtractor={(item) => String(item)} numColumns={5} contentContainerStyle={styles.juzGrid} renderItem={({ item }) => <Pressable onPress={() => { updateLearningPlan({ currentJuz: item }); setPicker(null); haptic.selection(); }} style={({ pressed }) => [styles.juzItem, item === learningPlan.currentJuz && styles.selectedJuz, pressed && styles.pressed]}><Text style={[styles.juzText, item === learningPlan.currentJuz && styles.selectedJuzText]}>{item}</Text></Pressable>} />
          ) : (
            <FlatList data={filteredSurahs} keyExtractor={(item) => String(item.number)} keyboardShouldPersistTaps="handled" renderItem={({ item }) => <Pressable onPress={() => { const endAyah = Math.min(5, item.ayahCount); updateLearningPlan({ surahNumber: item.number, currentSurah: item.name, startAyah: 1, endAyah, dailyTarget: formatAyahTarget(1, endAyah) }); setSearch(""); setPicker(null); haptic.selection(); }} style={({ pressed }) => [styles.surahRow, item.number === learningPlan.surahNumber && styles.selectedSurah, pressed && styles.pressed]}><View style={styles.surahNumber}><Text style={styles.surahNumberText}>{item.number}</Text></View><View style={styles.surahCopy}><Text style={styles.surahName}>{item.name}</Text><Text style={styles.surahMeta}>{item.ayahCount} Ayahs</Text></View>{item.number === learningPlan.surahNumber ? <MaterialIcons name="check-circle" size={21} color={Brand.emerald} /> : null}</Pressable>} />
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function AyahStepper({ label, value, onDecrease, onIncrease }: { label: string; value: number; onDecrease: () => void; onIncrease: () => void }) {
  return <View style={styles.stepper}><Text style={styles.stepperLabel}>{label}</Text><View style={styles.stepperControl}><Pressable accessibilityLabel={`Decrease ${label}`} onPress={onDecrease} style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}><MaterialIcons name="remove" size={20} color={Brand.emerald} /></Pressable><Text style={styles.stepperValue}>{value}</Text><Pressable accessibilityLabel={`Increase ${label}`} onPress={onIncrease} style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}><MaterialIcons name="add" size={20} color={Brand.emerald} /></Pressable></View></View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32, gap: 18 },
  intro: { color: Brand.sage, fontSize: 14, lineHeight: 21, marginTop: -8 },
  steps: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 6 },
  step: { alignItems: "center", gap: 4 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, textAlign: "center", textAlignVertical: "center", backgroundColor: Brand.emeraldSoft, color: Brand.emerald, fontSize: 12, lineHeight: 28, fontWeight: "800" },
  stepText: { color: Brand.sage, fontSize: 10, lineHeight: 14, fontWeight: "700" },
  stepLine: { width: 50, height: 2, backgroundColor: Brand.border, marginHorizontal: 8, marginBottom: 18 },
  group: { gap: 10 },
  groupTitle: { color: Brand.ink, fontSize: 17, lineHeight: 22, fontWeight: "800" },
  rangeCard: { flexDirection: "row", alignItems: "stretch", padding: 12 },
  stepper: { flex: 1, alignItems: "center", gap: 9 },
  stepperLabel: { color: Brand.sage, fontSize: 12, lineHeight: 16, fontWeight: "700" },
  stepperControl: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepperButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: Brand.emeraldSoft, alignItems: "center", justifyContent: "center" },
  stepperValue: { minWidth: 26, color: Brand.ink, fontSize: 22, lineHeight: 28, fontWeight: "800", textAlign: "center" },
  rangeDivider: { width: 1, backgroundColor: Brand.border, marginHorizontal: 6 },
  rangeHint: { color: Brand.sage, fontSize: 11, lineHeight: 16, textAlign: "center" },
  accuracyCard: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  accuracyText: { flex: 1, color: Brand.sage, fontSize: 12, lineHeight: 18 },
  scrim: { flex: 1, backgroundColor: "rgba(6, 25, 20, 0.48)" },
  sheet: { position: "absolute", left: 0, right: 0, bottom: 0, height: "76%", backgroundColor: Brand.ivory, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18 },
  sheetHandle: { alignSelf: "center", width: 42, height: 5, borderRadius: 3, backgroundColor: "#B9C6C1", marginBottom: 14 },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sheetTitle: { color: Brand.ink, fontSize: 22, lineHeight: 28, fontWeight: "800" },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Brand.border },
  search: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.medium, paddingHorizontal: 14, marginBottom: 10 },
  searchInput: { flex: 1, minHeight: 46, color: Brand.ink, fontSize: 15, lineHeight: 20 },
  juzGrid: { gap: 9, paddingTop: 6 },
  juzItem: { flex: 1, height: 50, margin: 4, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.border },
  selectedJuz: { backgroundColor: Brand.emerald, borderColor: Brand.emerald },
  juzText: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "700" },
  selectedJuzText: { color: Brand.surface },
  surahRow: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Brand.border },
  selectedSurah: { backgroundColor: Brand.emeraldSoft, borderRadius: 14 },
  surahNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Brand.border },
  surahNumberText: { color: Brand.emerald, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  surahCopy: { flex: 1 },
  surahName: { color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "700" },
  surahMeta: { color: Brand.sage, fontSize: 11, lineHeight: 15 },
  pressed: { opacity: 0.65 },
});
