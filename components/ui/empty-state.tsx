import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/design";

type EmptyStateProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><MaterialIcons name={icon} size={26} color={Brand.emerald} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 28, paddingHorizontal: 20, gap: 8 },
  icon: { width: 52, height: 52, borderRadius: 18, backgroundColor: Brand.emeraldSoft, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  title: { color: Brand.ink, fontSize: 17, lineHeight: 22, fontWeight: "800", textAlign: "center" },
  description: { color: Brand.sage, fontSize: 13, lineHeight: 19, textAlign: "center", maxWidth: 290 },
});
