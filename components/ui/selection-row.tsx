import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Radius } from "@/constants/design";

type SelectionRowProps = {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  helper?: string;
};

export function SelectionRow({ label, value, icon, onPress, helper }: SelectionRowProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.icon}><MaterialIcons name={icon} size={20} color={Brand.emerald} /></View>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text numberOfLines={1} style={styles.value}>{value}</Text>
        {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      </View>
      <MaterialIcons name="chevron-right" size={24} color={Brand.sage} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 72, flexDirection: "row", alignItems: "center", gap: 12, padding: 14, backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.medium },
  icon: { width: 42, height: 42, borderRadius: 14, backgroundColor: Brand.emeraldSoft, alignItems: "center", justifyContent: "center" },
  copy: { flex: 1, gap: 1 },
  label: { color: Brand.sage, fontSize: 12, lineHeight: 16, fontWeight: "600" },
  value: { color: Brand.ink, fontSize: 16, lineHeight: 21, fontWeight: "700" },
  helper: { color: Brand.sage, fontSize: 11, lineHeight: 15 },
  pressed: { opacity: 0.72 },
});
