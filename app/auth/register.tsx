import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { AppHeader } from "@/components/ui/app-header";
import { FormField } from "@/components/ui/form-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Brand } from "@/constants/design";
import { haptic } from "@/lib/haptics";
import { useAppState } from "@/state/app-state";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { signIn } = useAppState();
  const nameValid = name.trim().length >= 2;
  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const passwordValid = password.length >= 8;
  const submit = () => {
    setSubmitted(true);
    if (!nameValid || !emailValid || !passwordValid) {
      haptic.error();
      return;
    }
    signIn({ name: name.trim(), email });
    haptic.success();
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <AppHeader title="Create your profile" eyebrow="Student account" onBack={() => router.back()} />
          <Text style={styles.body}>Set up the student profile used for goals, progress, and future personalized teaching.</Text>
          <View style={styles.form}>
            <FormField label="Student name" icon="person-outline" value={name} onChangeText={setName} autoCapitalize="words" placeholder="How should we address you?" error={submitted && !nameValid ? "Enter at least 2 characters." : undefined} />
            <FormField label="Email address" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" error={submitted && !emailValid ? "Enter a valid email address." : undefined} />
            <FormField label="Create password" icon="lock-outline" value={password} onChangeText={setPassword} secureTextEntry returnKeyType="done" onSubmitEditing={submit} placeholder="At least 8 characters" error={submitted && !passwordValid ? "Use at least 8 characters." : undefined} helper="Production authentication and account recovery will be connected to the secure identity service." />
          </View>
          <View style={styles.actions}>
            <PrimaryButton label="Create account" icon="arrow-forward" onPress={submit} />
            <Pressable onPress={() => router.replace("/auth/sign-in" as never)} style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
              <Text style={styles.linkText}>Already registered? <Text style={styles.linkStrong}>Sign in</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, gap: 22 },
  body: { color: Brand.sage, fontSize: 15, lineHeight: 22, maxWidth: 380 },
  form: { gap: 17 },
  actions: { marginTop: "auto", gap: 12 },
  link: { minHeight: 40, alignItems: "center", justifyContent: "center" },
  linkText: { color: Brand.sage, fontSize: 14, lineHeight: 20 },
  linkStrong: { color: Brand.emerald, fontWeight: "800" },
  pressed: { opacity: 0.6 },
});
