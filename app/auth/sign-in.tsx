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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { signIn } = useAppState();
  const emailValid = /^\S+@\S+\.\S+$/.test(email);
  const passwordValid = password.length >= 6;
  const submit = () => {
    setSubmitted(true);
    if (!emailValid || !passwordValid) {
      haptic.error();
      return;
    }
    signIn({ email });
    haptic.success();
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <AppHeader title="Welcome back" eyebrow="Student sign in" onBack={() => router.back()} />
          <View style={styles.intro}><Text style={styles.body}>Sign in to continue your memorization plan and revision schedule.</Text></View>
          <View style={styles.form}>
            <FormField label="Email address" icon="mail-outline" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next" placeholder="you@example.com" error={submitted && !emailValid ? "Enter a valid email address." : undefined} />
            <FormField label="Password" icon="lock-outline" value={password} onChangeText={setPassword} secureTextEntry returnKeyType="done" onSubmitEditing={submit} placeholder="At least 6 characters" error={submitted && !passwordValid ? "Password must contain at least 6 characters." : undefined} />
            <Pressable onPress={() => {}} style={({ pressed }) => pressed && styles.pressed}><Text style={styles.forgot}>Password recovery will be connected in the account phase.</Text></Pressable>
          </View>
          <View style={styles.actions}>
            <PrimaryButton label="Sign in" icon="arrow-forward" onPress={submit} />
            <Pressable onPress={() => router.replace("/auth/register" as never)} style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
              <Text style={styles.linkText}>New to Hifz? <Text style={styles.linkStrong}>Create an account</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 24, gap: 24 },
  intro: { maxWidth: 380 },
  body: { color: Brand.sage, fontSize: 15, lineHeight: 22 },
  form: { gap: 18 },
  forgot: { color: Brand.sage, fontSize: 12, lineHeight: 17, textAlign: "right" },
  actions: { marginTop: "auto", gap: 14 },
  link: { minHeight: 40, alignItems: "center", justifyContent: "center" },
  linkText: { color: Brand.sage, fontSize: 14, lineHeight: 20 },
  linkStrong: { color: Brand.emerald, fontWeight: "800" },
  pressed: { opacity: 0.6 },
});
