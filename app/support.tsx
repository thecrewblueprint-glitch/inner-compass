import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/src/components/Screen";
import { theme } from "@/src/design/theme";
import { supportResources } from "@/src/data/supportResources";
import { clearSession, getResponse } from "@/src/lib/session";

export default function SupportScreen() {
  const router = useRouter();
  const response = getResponse();
  const message =
    response &&
    (response.kind === "support" || response.kind === "safety_redirect")
      ? response.message
      : "These resources are available whenever you want human support.";

  return (
    <Screen>
      <Text style={styles.eyebrow}>HUMAN SUPPORT</Text>
      <Text style={styles.title}>You do not have to handle everything through an app.</Text>
      <Text style={styles.body}>{message}</Text>

      {supportResources.map((resource) => (
        <View key={resource.name} style={styles.card}>
          <Text style={styles.name}>{resource.name}</Text>
          <Text style={styles.contact}>{resource.contact}</Text>
          <Text style={styles.description}>{resource.description}</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(resource.url)}
          >
            <Text style={styles.link}>Open resource</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.offline}>
        Resource names and contact information are bundled with the app so this
        screen remains readable without a network connection.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          clearSession();
          router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>Return home</Text>
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
    lineHeight: 35
  },
  body: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: 6
  },
  name: {
    color: theme.colors.text,
    fontWeight: "800",
    fontSize: 17
  },
  contact: {
    color: theme.colors.accent,
    fontWeight: "700"
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  link: {
    color: theme.colors.accent,
    fontWeight: "800",
    paddingVertical: 4
  },
  offline: {
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
