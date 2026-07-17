import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { forwardRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { Brand, Radius } from "@/constants/design";

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  helper?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField(
  { label, error, helper, icon, secureTextEntry, style, ...props },
  ref,
) {
  const [isVisible, setIsVisible] = useState(false);
  const isSecure = Boolean(secureTextEntry);
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error && styles.fieldError]}>
        {icon ? <MaterialIcons name={icon} size={19} color={Brand.sage} /> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#8A9A94"
          secureTextEntry={isSecure && !isVisible}
          style={[styles.input, style]}
          {...props}
        />
        {isSecure ? (
          <Pressable accessibilityLabel={isVisible ? "Hide password" : "Show password"} onPress={() => setIsVisible((current) => !current)}>
            <MaterialIcons name={isVisible ? "visibility-off" : "visibility"} size={20} color={Brand.sage} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  group: { gap: 7 },
  label: { color: Brand.ink, fontSize: 14, lineHeight: 18, fontWeight: "700" },
  field: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1, borderColor: Brand.border, borderRadius: Radius.medium, backgroundColor: Brand.surface, paddingHorizontal: 15 },
  fieldError: { borderColor: Brand.error },
  input: { flex: 1, minHeight: 50, color: Brand.ink, fontSize: 16, lineHeight: 21 },
  helper: { color: Brand.sage, fontSize: 12, lineHeight: 16 },
  error: { color: Brand.error, fontSize: 12, lineHeight: 16, fontWeight: "600" },
});
