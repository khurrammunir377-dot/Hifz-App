import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/design";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, subtitle, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={({ pressed }) => pressed && styles.pressed}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 16 },
  copy: { flex: 1, gap: 3 },
  title: { color: Brand.ink, fontSize: 20, lineHeight: 25, fontWeight: "800", letterSpacing: -0.2 },
  subtitle: { color: Brand.sage, fontSize: 13, lineHeight: 18 },
  action: { color: Brand.emerald, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  pressed: { opacity: 0.6 },
});
