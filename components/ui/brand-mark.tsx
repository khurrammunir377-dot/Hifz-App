import { Image, StyleSheet, Text, View } from "react-native";

import { Brand, Radius } from "@/constants/design";

type BrandMarkProps = {
  size?: number;
  showName?: boolean;
  inverse?: boolean;
};

export function BrandMark({ size = 64, showName = false, inverse = false }: BrandMarkProps) {
  return (
    <View style={styles.row}>
      <Image
        accessibilityLabel="Hifz logo"
        source={require("@/assets/images/icon.png")}
        style={[styles.image, { width: size, height: size, borderRadius: Math.max(Radius.medium, size * 0.22) }]}
      />
      {showName ? (
        <View style={styles.copy}>
          <Text style={[styles.name, inverse && styles.inverse]}>Hifz</Text>
          <Text style={[styles.subtitle, inverse && styles.inverseMuted]}>Quran Teacher</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  image: { backgroundColor: Brand.emerald, resizeMode: "cover" },
  copy: { gap: 1 },
  name: { color: Brand.ink, fontSize: 24, lineHeight: 29, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { color: Brand.sage, fontSize: 12, lineHeight: 16, fontWeight: "600", letterSpacing: 0.6, textTransform: "uppercase" },
  inverse: { color: Brand.surface },
  inverseMuted: { color: "#D6E7E1" },
});
