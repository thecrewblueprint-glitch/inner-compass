import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { LAUNCH_ATTESTATION_KEY } from '../components/LaunchGate';

interface LegalScreenProps {
  onResetLaunchGate?: () => void;
}

const LOCAL_KEYS = [
  'inner_compass_saved_reflections_v1',
  'inner_compass_category_interactions_v1',
  LAUNCH_ATTESTATION_KEY,
];

export const LegalScreen: React.FC<LegalScreenProps> = ({ onResetLaunchGate }) => {
  const { theme } = useTheme();
  const [cleared, setCleared] = useState(false);

  const clearLocalData = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('inner_compass_') || LOCAL_KEYS.includes(key))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
      }
      setCleared(true);
      onResetLaunchGate?.();
    } catch {
      setCleared(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.eyebrow, { color: theme.accentPrimary }]}>ABOUT · PRIVACY · TERMS</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Inner Compass</Text>
      <Text style={[styles.lede, { color: theme.textSecondary }]}>
        Guided reflection and sourced wisdom. General wellness only.
      </Text>

      <Section title="What this product is" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Inner Compass helps you organize a problem into a reflection theme and explore sourced philosophical and non-clinical educational material. Its category match is a navigation aid, not a diagnosis or clinical assessment.
        </Text>
      </Section>

      <Section title="What this product is not" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Inner Compass is not medical care, psychotherapy, diagnosis, treatment, clinical decision support, or an emergency service. It does not provide medical or mental-health treatment recommendations.
        </Text>
      </Section>

      <Section title="Privacy" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Production reflection processing is local to this device. Raw reflection text is not intentionally sent to an Inner Compass server, AI provider, advertising platform, or analytics provider.
        </Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          If you bookmark a reflection, the app stores only category-level information and generated canonical text in this browser's local storage. Raw reflection text is not saved in the journal.
        </Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          The web-hosting provider may receive ordinary request metadata needed to deliver this static site, such as an IP address, timestamp, browser headers, and requested asset paths. Reflection text is not placed in those requests by the production app.
        </Text>
      </Section>

      <Section title="Age and launch scope" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          This initial release is for adults age 18 or older located in the United States. The app stores only a local eligibility attestation; it does not request a birthdate or precise location.
        </Text>
      </Section>

      <Section title="Sources and quotations" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Inner Compass distinguishes direct quotations, source-linked teaching summaries, and original Inner Compass reflections. Direct quotation display is disabled unless the exact translation and edition pass a separate product-rights review.
        </Text>
      </Section>

      <Section title="Accounts, analytics, and advertising" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          The initial release has no user accounts, no cloud journal sync, no behavioral advertising, no ad pixels, and no third-party analytics or session replay.
        </Text>
      </Section>

      <Section title="Terms of use" theme={theme}>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Use Inner Compass for personal informational reflection only. Do not rely on it as professional medical, mental-health, legal, financial, or emergency advice. You remain responsible for your decisions and for seeking qualified professional help when appropriate.
        </Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Content may include historical, philosophical, religious, and psychological viewpoints that can disagree with one another. Inclusion is for reflection and education, not endorsement of any belief system.
        </Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Final operator identity, privacy contact, governing-law language, warranty terms, and formal dispute provisions remain pre-launch legal-review items and must be completed before public release.
        </Text>
      </Section>

      <View style={[styles.dangerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Local data control</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Clear saved categories, local personalization metadata, and the launch attestation from this browser.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            { borderColor: theme.crisisBorder },
            pressed && { opacity: 0.8 },
          ]}
          onPress={clearLocalData}
          accessibilityLabel="Clear all Inner Compass local data"
        >
          <Text style={[styles.clearButtonText, { color: theme.crisisText }]}>
            {cleared ? 'Local data cleared' : 'Clear All Local Data'}
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.finePrint, { color: theme.textMuted }]}>
        Compliance documentation is maintained in the project repository under docs/legal/. Final public-launch legal documents require qualified-counsel review.
      </Text>
    </ScrollView>
  );
};

const Section: React.FC<{ title: string; theme: any; children: React.ReactNode }> = ({
  title,
  theme,
  children,
}) => (
  <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 64,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
    gap: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  lede: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  section: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
  },
  dangerCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  clearButton: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
  finePrint: {
    fontSize: 11,
    lineHeight: 17,
  },
});
