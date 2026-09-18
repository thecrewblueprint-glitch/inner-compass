import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/Screen";
import { theme } from "@/src/design/theme";
import { generateGuidance } from "@/src/lib/api/guidance";
import {
  getClarification,
  getPendingText,
  setResponse
} from "@/src/lib/session";

export default function ClarifyScreen() {
  const router = useRouter();
  const clarification = getClarification();
  const pendingText = getPendingText();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!clarification || !pendingText) {
    return (
      <Screen>
        <Text style={styles.title}>Nothing to clarify</Text>
        <Pressable style={styles.choice} onPress={() => router.replace("/")}>
          <Text style={styles.choiceText}>Return home</Text>
        </Pressable>
      </Screen>
    );
  }

  async function choose(categoryId: number) {
    if (busyId !== null) return;

    setBusyId(categoryId);
    setError(null);

    try {
      const response = await generateGuidance(pendingText!, categoryId);
      setResponse(response);

      if (response.kind === "wisdom") {
        router.replace("/guidance");
      } else if (
        response.kind === "support" ||
        response.kind === "safety_redirect"
      ) {
        router.replace("/support");
      } else if (response.kind === "error") {
        setError(response.message);
      } else {
        setError("That choice still needs clarification. Return home and rephrase the situation.");
      }
    } catch {
      setError("The secure request could not complete.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Screen>
      <Text style={styles.eyebrow}>YOU DECIDE THE FIT</Text>
      <Text style={styles.title}>Which is closest?</Text>
      <Text style={styles.body}>
        Your description overlaps more than one category. Choose the one that
        best matches what you meant.
      </Text>

      {clarification.choices.map((choice) => (
        <Pressable
          key={choice.category_id}
          accessibilityRole="button"
          disabled={busyId !== null}
          onPress={() => choose(choice.category_id)}
          style={({ pressed }) => [
            styles.choice,
            pressed && { opacity: 0.8 }
          ]}
        >
          {busyId === choice.category_id ? (
            <ActivityIndicator color={theme.colors.accent} />
          ) : (
            <>
              <Text style={styles.choiceId}>CATEGORY {choice.category_id}</Text>
              <Text style={styles.choiceText}>{choice.category_name}</Text>
            </>
          )}
        </Pressable>
      ))}

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
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
    fontSize: 30
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing.sm
  },
  choice: {
    minHeight: 76,
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 4
  },
  choiceId: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.8
  },
  choiceText: {
    color: theme.colors.text,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 22
  },
  error: {
    color: theme.colors.danger,
    fontSize: 14
  }
});
