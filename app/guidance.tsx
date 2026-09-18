import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/Screen";
import { PillarCard } from "@/src/components/PillarCard";
import { theme } from "@/src/design/theme";
import { clearSession, getWisdom } from "@/src/lib/session";

export default function GuidanceScreen() {
  const router = useRouter();
  const wisdom = getWisdom();

  if (!wisdom) {
    return (
      <Screen>
        <Text style={styles.title}>No active perspective</Text>
        <Pressable style={styles.button} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>Return home</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.eyebrow}>CATEGORY {wisdom.category_id}</Text>
      <Text style={styles.title}>{wisdom.category_name}</Text>
      <Text style={styles.reflection}>{wisdom.reflection}</Text>

      <View style={styles.divider} />

      {wisdom.blocks.map((block) => (
        <PillarCard key={block.entry_id} block={block} />
      ))}

      <View style={styles.affirmation}>
        <Text style={styles.affirmationLabel}>CLOSING REFLECTION</Text>
        <Text style={styles.affirmationText}>{wisdom.affirmation}</Text>
      </View>

      <Text style={styles.boundary}>
        Inner Compass offers sourced reflection, not diagnosis or treatment.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          clearSession();
          router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>Start a new reflection</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1
  },
  title: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 28,
    lineHeight: 34
  },
  reflection: {
    color: theme.colors.textMuted,
    fontSize: 17,
    lineHeight: 26
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm
  },
  affirmation: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm
  },
  affirmationLabel: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 0.8
  },
  affirmationText: {
    color: theme.colors.text,
    fontSize: 17,
    lineHeight: 25
  },
  boundary: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },
  button: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: "700"
  }
});
