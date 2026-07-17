import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

import { Brand, Radius } from "@/constants/design";

type MetricCardProps = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  tone?: "emerald" | "gold" | "warning";
};

const toneMap = {
  emerald: { background: Brand.emeraldSoft, icon: Brand.emerald },
  gold: { background: Brand.goldSoft, icon: Brand.gold },
  warning: { background: "#FAECDB", icon: Brand.warning },
};

export function MetricCard({ label, value, icon, tone = "emerald" }: MetricCardProps) {
  const colors = toneMap[tone];
  return (
    <View style={styles.card}>
      <View style={[styles.icon, { backgroundColor: colors.background }]}>
        <MaterialIcons name={icon} size={20} color={colors.icon} />
      </View>
      <Text numberOfLines={1} style={styles.value}>{value}</Text>
      <Text numberOfLines={2} style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 142, backgroundColor: Brand.surface, borderColor: Brand.border, borderWidth: 1, borderRadius: Radius.medium, padding: 14, gap: 7 },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  value: { color: Brand.ink, fontSize: 20, lineHeight: 25, fontWeight: "800", letterSpacing: -0.4 },
  label: { color: Brand.sage, fontSize: 12, lineHeight: 16, fontWeight: "600" },
});
