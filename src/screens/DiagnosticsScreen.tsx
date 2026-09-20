import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { clearDebugEvents, exportDebugBundle, readDebugEvents } from '../debug/debugStore';
import { useTheme } from '../theme';
import { getReleaseTier, releaseBlockingReasons } from '../legal/legalConfig';

export const DiagnosticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [revision, setRevision] = useState(0);
  const events = useMemo(() => readDebugEvents(), [revision]);
  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) counts[event.type] = (counts[event.type] || 0) + 1;
    return counts;
  }, [events]);

  const downloadBundle = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const blob = new Blob([JSON.stringify(exportDebugBundle(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `inner-compass-debug-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const blockers = releaseBlockingReasons();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.eyebrow, { color: theme.accentPrimary }]}>LOCAL DIAGNOSTICS</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Debug & Release Data Hub</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        This console reads only local, privacy-safe diagnostic events from this browser. It never stores raw reflection text and sends no telemetry to an administrator.
      </Text>

      <View style={styles.metrics}>
        <Metric label="Events" value={String(events.length)} />
        <Metric label="Safety routes" value={String(byType.safety_route || 0)} />
        <Metric label="Clarifications" value={String(byType.clarification || 0)} />
        <Metric label="Runtime errors" value={String(byType.runtime_error || 0)} />
        <Metric label="Release tier" value={getReleaseTier()} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Public-release blockers</Text>
        {blockers.length ? blockers.map((item) => (
          <Text key={item} style={[styles.rowText, { color: theme.textSecondary }]}>• {item}</Text>
        )) : (
          <Text style={[styles.rowText, { color: theme.textSecondary }]}>No configuration blockers reported.</Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Recent events</Text>
        {events.slice().reverse().slice(0, 80).map((event) => (
          <View key={event.id} style={[styles.eventRow, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.eventType, { color: theme.accentPrimary }]}>{event.type}</Text>
            <Text style={[styles.eventTime, { color: theme.textMuted }]}>{new Date(event.at).toLocaleString()}</Text>
            <Text style={[styles.eventPayload, { color: theme.textSecondary }]}>{JSON.stringify(event.payload)}</Text>
          </View>
        ))}
        {!events.length && <Text style={[styles.rowText, { color: theme.textMuted }]}>No local diagnostics yet.</Text>}
      </View>

      <View style={styles.actions}>
        <Pressable accessibilityLabel="Export local diagnostics" style={[styles.button, { backgroundColor: theme.accentPrimary }]} onPress={downloadBundle}>
          <Text style={[styles.buttonText, { color: theme.accentText }]}>Export debug bundle</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Clear local diagnostics"
          style={[styles.button, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder, borderWidth: 1 }]}
          onPress={() => { clearDebugEvents(); setRevision((value) => value + 1); }}
        >
          <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Clear diagnostics</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.metric, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.metricLabel, { color: theme.textMuted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 70, maxWidth: 1000, width: '100%', alignSelf: 'center' },
  eyebrow: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8, textAlign: 'center', marginTop: 8 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, textAlign: 'center', maxWidth: 720, alignSelf: 'center', marginTop: 8, marginBottom: 18 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  metric: { flexGrow: 1, minWidth: 150, borderWidth: 1, borderRadius: 12, padding: 13 },
  metricLabel: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  metricValue: { fontSize: 18, fontWeight: '800', marginTop: 5 },
  card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  rowText: { fontSize: 12, lineHeight: 19 },
  eventRow: { borderBottomWidth: 1, paddingVertical: 9, gap: 2 },
  eventType: { fontSize: 11, fontWeight: '900' },
  eventTime: { fontSize: 9 },
  eventPayload: { fontSize: 10, lineHeight: 15 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  button: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11 },
  buttonText: { fontSize: 12, fontWeight: '800' },
});
