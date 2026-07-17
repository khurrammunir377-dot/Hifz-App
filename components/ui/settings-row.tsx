import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Brand } from "@/constants/design";
import { haptic } from "@/lib/haptics";

type SettingsRowProps = {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value?: string;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  isLast?: boolean;
};

export function SettingsRow({ label, icon, value, onPress, switchValue, onSwitchChange, isLast = false }: SettingsRowProps) {
  const isSwitch = typeof switchValue === "boolean" && onSwitchChange;
  const handleSwitch = (next: boolean) => {
    haptic.medium();
    onSwitchChange?.(next);
  };
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.row, !isLast && styles.border, pressed && styles.pressed]}>
      <View style={styles.icon}><MaterialIcons name={icon} size={19} color={Brand.emerald} /></View>
      <Text style={styles.label}>{label}</Text>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={handleSwitch} trackColor={{ false: "#CBD5D1", true: "#7BB8A4" }} thumbColor={switchValue ? Brand.emerald : Brand.surface} />
      ) : (
        <View style={styles.trailing}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {onPress ? <MaterialIcons name="chevron-right" size={22} color={Brand.sage} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 58, flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 12 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Brand.border },
  icon: { width: 34, height: 34, borderRadius: 11, backgroundColor: Brand.emeraldSoft, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, color: Brand.ink, fontSize: 15, lineHeight: 20, fontWeight: "600" },
  trailing: { flexDirection: "row", alignItems: "center", gap: 4 },
  value: { color: Brand.sage, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: 0.65 },
});
