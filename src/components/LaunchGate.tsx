import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme';

interface LaunchGateProps {
  onAccepted: () => void;
}

export const LAUNCH_ATTESTATION_KEY = 'inner_compass_launch_attestation_us_adult_v1';

export const LaunchGate: React.FC<LaunchGateProps> = ({ onAccepted }) => {
  const { theme } = useTheme();
  const [declined, setDeclined] = useState(false);

  const accept = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(
          LAUNCH_ATTESTATION_KEY,
          JSON.stringify({
            version: 1,
            adult: true,
            us: true,
            acceptedAt: Date.now(),
          })
        );
      }
    } catch {
      // The gate still works even if local storage is unavailable.
    }
    onAccepted();
  };

  if (declined) {
    return (
      <View style={[styles.center, { backgroundColor: theme.canvas }]}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>This release is not available to you.</Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            The current Inner Compass release is limited to adults age 18 or older who are located in the United States.
          </Text>
          <Text style={[styles.body, { color: theme.textSecondary }]}>
            Inner Compass is a general-wellness reflection tool, not medical care, therapy, diagnosis, or an emergency service.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: theme.cardBorder },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => setDeclined(false)}
          >
            <Text style={[styles.secondaryText, { color: theme.textPrimary }]}>Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.center, { backgroundColor: theme.canvas }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.eyebrow, { color: theme.accentPrimary }]}>INNER COMPASS · INITIAL U.S. RELEASE</Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Before you continue</Text>

        <Text style={[styles.body, { color: theme.textSecondary }]}>
          Inner Compass is a general-wellness and guided-reflection product. It does not diagnose, treat, cure, mitigate, or prevent any medical or mental-health condition.
        </Text>

        <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>Privacy by design</Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Your reflection text is processed locally on this device by deterministic rules. The production app does not send raw reflection text to an Inner Compass server or AI provider.
          </Text>
          <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
            Optional saved reflections store only category-level information locally in this browser. You can clear that local data from About & Privacy.
          </Text>
        </View>

        <Text style={[styles.body, { color: theme.textSecondary }]}>
          By continuing, you attest that you are at least 18 years old, are located in the United States, and agree to use Inner Compass only as an informational reflection tool.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: theme.accentPrimary },
            pressed && { opacity: 0.85 },
          ]}
          onPress={accept}
          accessibilityLabel="Confirm adult United States launch eligibility"
        >
          <Text style={[styles.primaryText, { color: theme.accentText }]}>
            I am 18+ and in the United States · Continue
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: theme.cardBorder },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => setDeclined(true)}
        >
          <Text style={[styles.secondaryText, { color: theme.textSecondary }]}>
            I do not meet these launch requirements
          </Text>
        </Pressable>

        <Text style={[styles.finePrint, { color: theme.textMuted }]}>
          This gate stores only a local eligibility attestation. It does not request your birthdate, exact age, or precise location.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 680,
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    gap: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
  },
  notice: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  finePrint: {
    fontSize: 11,
    lineHeight: 17,
  },
});
