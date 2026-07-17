import { Pressable, StyleSheet, View, type ViewProps } from "react-native";

import { Brand, Radius } from "@/constants/design";

type SurfaceCardProps = ViewProps & {
  onPress?: () => void;
  tone?: "default" | "emerald" | "gold";
};

export function SurfaceCard({ children, onPress, tone = "default", style, ...props }: SurfaceCardProps) {
  const cardStyle = [styles.base, styles[tone], style];
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle} {...props}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { backgroundColor: Brand.surface, borderColor: Brand.border, borderWidth: 1, borderRadius: Radius.large, padding: 18 },
  default: {},
  emerald: { backgroundColor: Brand.emerald, borderColor: Brand.emerald },
  gold: { backgroundColor: Brand.goldSoft, borderColor: "#EAD7A5" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
