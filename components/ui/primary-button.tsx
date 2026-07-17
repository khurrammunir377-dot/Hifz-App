import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radius } from "@/constants/design";
import { haptic } from "@/lib/haptics";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = "primary",
  disabled = false,
  loading = false,
  accessibilityHint,
}: PrimaryButtonProps) {
  const handlePress = () => {
    haptic.light();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? Brand.surface : Brand.emerald} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.label, variant === "primary" ? styles.primaryLabel : styles.secondaryLabel]}>{label}</Text>
          {icon ? <MaterialIcons name={icon} size={20} color={variant === "primary" ? Brand.surface : Brand.emerald} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: Radius.medium, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, borderWidth: 1 },
  primary: { backgroundColor: Brand.emerald, borderColor: Brand.emerald },
  secondary: { backgroundColor: Brand.surface, borderColor: Brand.emerald },
  ghost: { backgroundColor: "transparent", borderColor: "transparent" },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  label: { fontSize: 16, lineHeight: 20, fontWeight: "700" },
  primaryLabel: { color: Brand.surface },
  secondaryLabel: { color: Brand.emerald },
});
