import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import type { GuidanceBlock } from "@/src/types/guidance";
import { theme } from "@/src/design/theme";

const labels = {
  eastern_philosophy: "Eastern philosophy",
  shadow_work: "Shadow work",
  psychology_methodology: "Psychology methodology"
} as const;

export function PillarCard({ block }: { block: GuidanceBlock }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.pillar}>{labels[block.pillar]}</Text>
        {block.confidence === "extrapolated" ? (
          <Text style={styles.badge}>EXTRAPOLATED</Text>
        ) : null}
      </View>

      <Text style={styles.message}>{block.message}</Text>

      {block.practice ? (
        <View style={styles.practiceBox}>
          <Text style={styles.kicker}>PRACTICE</Text>
          <Text style={styles.secondary}>{block.practice}</Text>
        </View>
      ) : null}

      {block.quote ? (
        <Text style={styles.quote}>“{block.quote}”</Text>
      ) : null}

      <Text style={styles.source}>
        {block.source_author} · {block.source_work}
      </Text>

      {block.confidence_note ? (
        <Text style={styles.note}>{block.confidence_note}</Text>
      ) : null}

      {block.citation_urls.map((url, index) => (
        <Pressable
          key={url}
          accessibilityRole="link"
          onPress={() => Linking.openURL(url)}
        >
          <Text style={styles.link}>Source {index + 1}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    alignItems: "center"
  },
  pillar: {
    color: theme.colors.accent,
    fontWeight: "700",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.7
  },
  badge: {
    color: theme.colors.danger,
    fontSize: 10,
    fontWeight: "800"
  },
  message: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24
  },
  practiceBox: {
    backgroundColor: theme.colors.surfaceRaised,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    gap: 4
  },
  kicker: {
    color: theme.colors.accent,
    fontWeight: "800",
    fontSize: 11
  },
  secondary: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  quote: {
    color: theme.colors.text,
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 22
  },
  source: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },
  note: {
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18
  },
  link: {
    color: theme.colors.accent,
    fontWeight: "700",
    paddingVertical: 4
  }
});
