import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface PrivacyScreenProps {
  savedCount: number;
  personalizationEnabled: boolean;
  onTogglePersonalization: () => void;
  onClearJournal: () => void;
  onClearPersonalization: () => void;
  onClearAllLocalData: () => void;
  onOpenLegal?: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({
  savedCount,
  personalizationEnabled,
  onTogglePersonalization,
  onClearJournal,
  onClearPersonalization,
  onClearAllLocalData,
  onOpenLegal,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>PRIVACY & LOCAL DATA</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Your reflection stays on this device</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Inner Compass processes your reflection on this device. Your original reflection text is not saved to your journal or sent to analytics, advertising, or AI services.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>What is stored locally</Text>
        <Text style={[styles.item, { color: theme.textSecondary }]}>• Saved reflection themes, summaries, and affirmations: {savedCount}</Text>
        <Text style={[styles.item, { color: theme.textSecondary }]}>• A count of reflection themes you explored, used only for optional personalization</Text>
        <Text style={[styles.item, { color: theme.textSecondary }]}>• Color preference and your adult/U.S. eligibility confirmation</Text>
        <Text style={[styles.item, { color: theme.textSecondary }]}>• Basic information about whether the app is working properly, stored on this device when needed</Text>
        <Text style={[styles.item, { color: theme.textSecondary }]}>• Your original reflection text is not saved</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Personalization</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Daily wisdom can use reflection themes you previously explored. It never uses or stores your original reflection text.
        </Text>
        <Pressable
          onPress={onTogglePersonalization}
          style={[styles.primaryButton, { backgroundColor: personalizationEnabled ? theme.accentPrimary : theme.badgeBg, borderColor: theme.badgeBorder }]}
          accessibilityRole="switch"
          accessibilityState={{ checked: personalizationEnabled }}
        >
          <Text style={{ color: personalizationEnabled ? theme.accentText : theme.badgeText, fontWeight: '800' }}>
            Personalization: {personalizationEnabled ? 'On' : 'Off'}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Clear local data</Text>
        <View style={styles.actions}>
          <Action label="Clear journal" onPress={onClearJournal} />
          <Action label="Clear personalization history" onPress={onClearPersonalization} />
          <Action label="Clear all Inner Compass local data" onPress={onClearAllLocalData} />
        </View>
      </View>

      <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>Beta availability</Text>
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          Inner Compass is research-informed reflective guidance, not therapy, diagnosis, medical care, legal advice, or emergency response. It is currently available to adults 18+ in the United States and supports English only.
        </Text>
        {onOpenLegal && (
          <Pressable
            onPress={onOpenLegal}
            accessibilityRole="link"
            accessibilityLabel="Review legal and safety notices"
            style={[styles.legalButton, { borderColor: theme.badgeBorder }]}
          >
            <Text style={[styles.actionText, { color: theme.accentPrimary }]}>Review legal & safety notices</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
};

const Action = ({ label, onPress }: { label: string; onPress: () => void }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
    >
      <Text style={[styles.actionText, { color: theme.textPrimary }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 70, maxWidth: 760, width: '100%', alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 20, paddingTop: 8 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 27, fontWeight: '700', fontFamily: 'serif', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 620 },
  card: { borderWidth: 1, borderRadius: 16, padding: 18, marginBottom: 13 },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 9 },
  body: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
  item: { fontSize: 13, lineHeight: 21 },
  primaryButton: { borderWidth: 1, borderRadius: 10, padding: 12, alignItems: 'center' },
  actions: { gap: 8 },
  actionButton: { borderWidth: 1, borderRadius: 10, padding: 12 },
  actionText: { fontSize: 12, fontWeight: '800' },
  notice: { borderWidth: 1, borderRadius: 14, padding: 15 },
  noticeTitle: { fontSize: 13, fontWeight: '800', marginBottom: 5 },
  noticeText: { fontSize: 12, lineHeight: 18 },
  legalButton: { marginTop: 10, borderTopWidth: 1, paddingTop: 10 },
});
