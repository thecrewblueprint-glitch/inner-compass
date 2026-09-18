import type { PropsWithChildren } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle
} from "react-native";
import { theme } from "@/src/design/theme";

type Props = PropsWithChildren<{
  contentStyle?: ViewStyle;
  scroll?: boolean;
}>;

export function Screen({ children, contentStyle, scroll = true }: Props) {
  if (!scroll) {
    return <View style={[styles.base, styles.content, contentStyle]}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.base}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: 48,
    gap: theme.spacing.md
  }
});
