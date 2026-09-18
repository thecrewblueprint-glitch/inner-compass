import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/Screen";
import { theme } from "@/src/design/theme";
import { generateGuidance } from "@/src/lib/api/guidance";
import {
  clearSession,
  setPendingText,
  setResponse
} from "@/src/lib/session";

export default function HomeScreen() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const trimmed = text.trim();
    if (trimmed.length < 3 || busy) return;

    setBusy(true);
    setError(null);
    clearSession();

    try {
      const response = await generateGuidance(trimmed);
      setPendingText(trimmed);
      setResponse(response);

      if (response.kind === "needs_clarification") {
        router.push("/clarify");
      } else if (response.kind === "wisdom") {
        router.push("/guidance");
      } else if (
        response.kind === "support" ||
        response.kind === "safety_redirect"
      ) {
        router.push("/support");
      } else {
        setError(response.message);
      }
    } catch {
      setError("Inner Compass could not connect securely. Try again when your connection is stable.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>PRIVATE · EPHEMERAL</Text>
        <Text style={styles.title}>What’s weighing on you?</Text>
        <Text style={styles.subtitle}>
          Describe one situation. Inner Compass will match it to a curated
          perspective and show the sources it used.
        </Text>
      </View>

      <TextInput
        accessibilityLabel="Describe what is weighing on you"
        multiline
        maxLength={4000}
        value={text}
        onChangeText={setText}
        placeholder="Write what you’re dealing with..."
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        textAlignVertical="top"
      />

      <Text style={styles.privacy}>
        Your reflection is used for the active request only. The MVP does not
        save a reflection history.
      </Text>

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={busy || text.trim().length < 3}
        onPress={submit}
        style={({ pressed }) => [
          styles.primary,
          (busy || text.trim().length < 3) && styles.disabled,
          pressed && styles.pressed
        ]}
      >
        {busy ? (
          <ActivityIndicator color={theme.colors.accentText} />
        ) : (
          <Text style={styles.primaryText}>Find perspective</Text>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setResponse({
            kind: "support",
            message: "You can open support resources at any time.",
            resource_tier: "support"
          });
          router.push("/support");
        }}
        style={styles.secondary}
      >
        <Text style={styles.secondaryText}>Open support resources</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  eyebrow: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.2
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700"
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  input: {
    minHeight: 190,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: 17,
    lineHeight: 25
  },
  privacy: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },
  error: {
    color: theme.colors.danger,
    fontSize: 14,
    lineHeight: 20
  },
  primary: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md
  },
  primaryText: {
    color: theme.colors.accentText,
    fontWeight: "800",
    fontSize: 16
  },
  secondary: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md
  },
  secondaryText: {
    color: theme.colors.text,
    fontWeight: "700"
  },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 }
});
