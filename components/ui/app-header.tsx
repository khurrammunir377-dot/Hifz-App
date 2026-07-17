import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/design";

type AppHeaderProps = {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  actionIcon?: keyof typeof MaterialIcons.glyphMap;
  onAction?: () => void;
};

export function AppHeader({ title, eyebrow, onBack, actionIcon, onAction }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color={Brand.ink} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
      </View>
      {actionIcon && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <MaterialIcons name={actionIcon} size={22} color={Brand.ink} />
        </Pressable>
      ) : <View style={onBack ? styles.iconSpacer : undefined} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 10 },
  copy: { flex: 1 },
  eyebrow: { color: Brand.emerald, fontSize: 12, lineHeight: 16, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
  title: { color: Brand.ink, fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.6 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Brand.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Brand.border },
  iconSpacer: { width: 44 },
  pressed: { opacity: 0.65 },
});
