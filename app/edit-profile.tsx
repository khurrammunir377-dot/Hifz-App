import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { FormField } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Brand, Radius } from "@/constants/design";
import { haptic } from "@/lib/haptics";
import { type StudentProfile, useAppState } from "@/state/app-state";

const ageGroups: StudentProfile["ageGroup"][] = ["Child", "Teen", "Adult"];

export default function EditProfileScreen() {
  const { profile, updateProfile } = useAppState();
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.goal);
  const [ageGroup, setAgeGroup] = useState(profile.ageGroup);
  const save = () => {
    if (name.trim().length < 2 || goal.trim().length < 5) { haptic.error(); return; }
    updateProfile({ name: name.trim(), goal: goal.trim(), ageGroup });
    haptic.success();
    router.back();
  };
  return <ScreenContainer edges={["top", "bottom", "left", "right"]}><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><AppHeader title="Edit profile" eyebrow="Student information" onBack={() => router.back()} /><FormField label="Student name" value={name} onChangeText={setName} icon="person-outline" /><View style={styles.group}><Text style={styles.label}>Age group</Text><View style={styles.segment}>{ageGroups.map((item) => <Pressable key={item} onPress={() => setAgeGroup(item)} style={({ pressed }) => [styles.segmentItem, ageGroup === item && styles.segmentActive, pressed && styles.pressed]}><Text style={[styles.segmentText, ageGroup === item && styles.segmentTextActive]}>{item}</Text></Pressable>)}</View></View><FormField label="Learning goal" value={goal} onChangeText={setGoal} icon="flag" multiline numberOfLines={3} style={styles.goalInput} helper="Describe the pace or outcome you want to work toward." /><View style={styles.actions}><PrimaryButton label="Save changes" icon="check" onPress={save} /><PrimaryButton label="Cancel" variant="ghost" onPress={() => router.back()} /></View></ScrollView></KeyboardAvoidingView></ScreenContainer>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 22, gap: 22 },
  group: { gap: 8 },
  label: { color: Brand.ink, fontSize: 14, lineHeight: 18, fontWeight: "700" },
  segment: { flexDirection: "row", backgroundColor: Brand.surface, borderRadius: Radius.medium, borderWidth: 1, borderColor: Brand.border, padding: 4 },
  segmentItem: { flex: 1, minHeight: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  segmentActive: { backgroundColor: Brand.emerald },
  segmentText: { color: Brand.sage, fontSize: 13, lineHeight: 18, fontWeight: "700" },
  segmentTextActive: { color: Brand.surface },
  goalInput: { minHeight: 82, textAlignVertical: "top", paddingTop: 12 },
  actions: { marginTop: "auto", gap: 10 },
  pressed: { opacity: 0.65 },
});
