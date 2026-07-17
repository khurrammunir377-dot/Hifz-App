import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Brand } from "@/constants/design";

type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function ProgressRing({ value, size = 104, strokeWidth = 10, label = "complete" }: ProgressRingProps) {
  const boundedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (boundedValue / 100) * circumference;
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: boundedValue }} style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={Brand.border} strokeWidth={strokeWidth} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={Brand.emerald}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.copy}>
        <Text style={styles.value}>{Math.round(boundedValue)}%</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  svg: { position: "absolute" },
  copy: { alignItems: "center" },
  value: { color: Brand.ink, fontSize: 22, lineHeight: 26, fontWeight: "800" },
  label: { color: Brand.sage, fontSize: 10, lineHeight: 14, fontWeight: "600" },
});
