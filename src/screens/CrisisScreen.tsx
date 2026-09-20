import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { EMERGENCY_RESOURCES } from '../safety/safetyRouter';
import { useTheme } from '../theme';

interface CrisisScreenProps {
  reason?: string;
  safetyNotes?: string[];
  onDismiss?: () => void;
}

export const CrisisScreen: React.FC<CrisisScreenProps> = ({
  reason,
  safetyNotes,
  onDismiss,
}) => {
  const { theme } = useTheme();

  const handleCall = (tel?: string) => {
    if (tel) Linking.openURL(tel);
  };

  const handleSms = (sms?: string) => {
    if (sms) Linking.openURL(sms);
  };

  const handleWeb = (url: string) => {
    Linking.openURL(url);
  };

  const resources = Object.values(EMERGENCY_RESOURCES);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Redirection Alert Banner */}
      <View
        style={[
          styles.alertCard,
          { backgroundColor: theme.crisisBg, borderColor: theme.crisisBorder },
        ]}
        {...({ 'data-testid': 'crisis-alert-banner' } as any)}
      >
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.crisisBorder }]}>
          <Text style={[styles.badgeText, { color: theme.crisisText }]}>OUTSIDE ORDINARY REFLECTION SCOPE</Text>
        </View>
        <Text
          style={[styles.title, { color: theme.crisisText }]}
          {...({ 'data-testid': 'crisis-title' } as any)}
        >
          24/7 Immediate Human Lifelines
        </Text>
        <Text style={[styles.subtitle, { color: theme.crisisText }]}>
          Free, confidential, and staffed around the clock by compassionate human counselors.
        </Text>

        {reason && (
          <View
            style={[styles.reasonBox, { backgroundColor: theme.card, borderColor: theme.crisisBorder }]}
            {...({ 'data-testid': 'crisis-reason-box' } as any)}
          >
            <Text style={[styles.reasonLabel, { color: theme.crisisText }]}>SCOPE NOTICE:</Text>
            <Text
              style={[styles.reasonText, { color: theme.textPrimary }]}
              {...({ 'data-testid': 'crisis-reason-text' } as any)}
            >
              {reason}
            </Text>
          </View>
        )}

        {safetyNotes && safetyNotes.length > 0 && (
          <View style={styles.safetyNotesBox}>
            {safetyNotes.map((note, i) => (
              <Text key={i} style={[styles.safetyNoteItem, { color: theme.crisisText }]}>
                • {note}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Rationale description */}
      <View style={[styles.rationaleBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.rationaleText, { color: theme.textSecondary }]}>
          Inner Compass is a reflection tool, not an emergency or treatment service. When a situation falls outside its scope, qualified human support and appropriate professional care take priority over philosophical guidance.
        </Text>
      </View>

      {/* Emergency Resources Directory */}
      <View style={styles.resourcesList}>
        {resources.map((res, idx) => (
          <View
            key={idx}
            style={[
              styles.resourceCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                shadowColor: theme.cardShadow,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.resName, { color: theme.textPrimary }]}>{res.name}</Text>
              <View style={[styles.resBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Text style={[styles.resBadgeText, { color: theme.badgeText }]}>{res.badge}</Text>
              </View>
            </View>

            <Text style={[styles.resContact, { color: theme.crisisAccent }]}>{res.contact}</Text>
            <Text style={[styles.resDesc, { color: theme.textSecondary }]}>{res.description}</Text>

            <View style={styles.actionRow}>
              {res.tel && (
                <Pressable
                  style={({ pressed }) => [
                    styles.callButton,
                    { backgroundColor: theme.crisisAccent },
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={() => handleCall(res.tel)}
                >
                  <Text style={styles.callButtonText}>Call Now</Text>
                </Pressable>
              )}

              {res.sms && (
                <Pressable
                  style={({ pressed }) => [
                    styles.smsButton,
                    { backgroundColor: theme.accentPrimary },
                    pressed && { opacity: 0.85 },
                  ]}
                  onPress={() => handleSms(res.sms)}
                >
                  <Text style={[styles.smsButtonText, { color: theme.accentText }]}>Text Support</Text>
                </Pressable>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.webButton,
                  { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => handleWeb(res.url)}
              >
                <Text style={[styles.webButtonText, { color: theme.textPrimary }]}>Website</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {onDismiss && (
        <Pressable
          style={({ pressed }) => [
            styles.dismissButton,
            { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
            pressed && { opacity: 0.8 },
          ]}
          onPress={onDismiss}
        >
          <Text style={[styles.dismissButtonText, { color: theme.textPrimary }]}>Return to Reflection</Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  alertCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'serif',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  reasonBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#C84255',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 14,
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 18,
  },
  safetyNotesBox: {
    marginTop: 12,
  },
  safetyNoteItem: {
    fontSize: 12,
    lineHeight: 18,
  },
  rationaleBox: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    marginBottom: 22,
  },
  rationaleText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  resourcesList: {
    gap: 14,
    marginBottom: 24,
  },
  resourceCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resName: {
    fontSize: 16,
    fontWeight: '700',
  },
  resBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  resContact: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  resDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  smsButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  smsButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  webButton: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
  },
  webButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dismissButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderRadius: 10,
  },
  dismissButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
