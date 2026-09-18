import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
      >
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.crisisBorder }]}>
          <Text style={[styles.badgeText, { color: theme.crisisText }]}>DEDICATED SAFETY & CRISIS ROUTING</Text>
        </View>
        <Text style={[styles.title, { color: theme.crisisText }]}>24/7 Immediate Human Lifelines</Text>
        <Text style={[styles.subtitle, { color: theme.crisisText }]}>
          Free, confidential, and staffed around the clock by compassionate human counselors.
        </Text>

        {reason && (
          <View style={[styles.reasonBox, { backgroundColor: theme.card, borderColor: theme.crisisBorder }]}>
            <Text style={[styles.reasonLabel, { color: theme.crisisText }]}>UPSTREAM SAFETY ROUTING NOTICE:</Text>
            <Text style={[styles.reasonText, { color: theme.textPrimary }]}>{reason}</Text>
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
          Philosophical contemplation is a valuable companion for living, but when acute crisis, relationship violence, suicidal despair, or medical withdrawal occurs, immediate human support and clinical care come first. You do not have to navigate unbearable moments alone.
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
                <TouchableOpacity
                  style={[styles.callButton, { backgroundColor: theme.crisisAccent }]}
                  onPress={() => handleCall(res.tel)}
                >
                  <Text style={styles.callButtonText}>Call Now</Text>
                </TouchableOpacity>
              )}

              {res.sms && (
                <TouchableOpacity
                  style={[styles.smsButton, { backgroundColor: theme.accentPrimary }]}
                  onPress={() => handleSms(res.sms)}
                >
                  <Text style={[styles.smsButtonText, { color: theme.accentText }]}>Text Support</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.webButton, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                onPress={() => handleWeb(res.url)}
              >
                <Text style={[styles.webButtonText, { color: theme.textPrimary }]}>Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {onDismiss && (
        <TouchableOpacity
          style={[styles.dismissButton, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
          onPress={onDismiss}
        >
          <Text style={[styles.dismissButtonText, { color: theme.textPrimary }]}>Return to Safe Reflection</Text>
        </TouchableOpacity>
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
