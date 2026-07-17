import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <MaterialIcons size={25} name="home" color={color} />,
        }}
      />
      <Tabs.Screen name="learn" options={{ title: "Learn", tabBarIcon: ({ color }) => <MaterialIcons size={25} name="menu-book" color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: "Progress", tabBarIcon: ({ color }) => <MaterialIcons size={25} name="insights" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <MaterialIcons size={25} name="person" color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color }) => <MaterialIcons size={25} name="settings" color={color} /> }} />
    </Tabs>
  );
}
