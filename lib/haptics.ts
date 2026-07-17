import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const nativeOnly = (action: () => Promise<void>) => {
  if (Platform.OS !== "web") {
    void action();
  }
};

export const haptic = {
  light: () => nativeOnly(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  medium: () => nativeOnly(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  selection: () => nativeOnly(() => Haptics.selectionAsync()),
  success: () => nativeOnly(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => nativeOnly(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
