import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../theme';
import { WellnessVolumeScreen } from './WellnessVolumeScreen';
import { WellnessVolumePicker } from '../components/WellnessVolumePicker';
import {
  WELLNESS_JOURNEY, WELLNESS_PRACTICES, WELLNESS_SOURCES, WELLNESS_TRADITIONS,
  WellnessDomain,
} from '../data/wellnessGuide';

type Page = 'overview' | 'traditions' | 'practices' | 'journey' | 'sources';
type Filter = 'All' | WellnessDomain;
const PAGES: { id: Page; title: string }[] = [
  { id: 'overview', title: 'Overview' },
  { id: 'traditions', title: 'Traditions' },
  { id: 'practices', title: 'Practices' },
  { id: 'journey', title: '21-Day Journey' },
  { id: 'sources', title: 'Sources' },
];
const FILTERS: Filter[] = ['All', 'Mind', 'Body', 'Soul', 'Integrated'];
const PROGRESS_KEY = 'inner_compass_wellness_journey_v1';

function readProgress(): number[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const value: unknown = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter(
      (n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < WELLNESS_JOURNEY.length
    )));
  } catch {
    return [];
  }
}

function openReference(sourceId: string) {
  const source = WELLNESS_SOURCES.find((entry) => entry.id === sourceId);
  if (source && source.url.startsWith('https://')) {
    void Linking.openURL(source.url);
  }
}

interface WellnessGuideScreenProps {
  onReturnToCompass: () => void;
}

/** A self-contained series-ready library within the existing Inner Compass eligibility gate. */
export const WellnessGuideScreen: React.FC<WellnessGuideScreenProps> = ({ onReturnToCompass }) => {
  const { theme } = useTheme();
  const [page, setPage] = useState<Page>('overview');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [completed, setCompleted] = useState<number[]>(readProgress);
  const [volume, setVolume] = useState(1);

  // Switching books always opens that book from the beginning.
  const selectVolume = (nextVolume: number) => {
    setPage('overview');
    setVolume(nextVolume);
  };

  const filteredTraditions = useMemo(() => {
    const term = search.trim().toLowerCase();
    return WELLNESS_TRADITIONS.filter((entry) => !term ||
      [entry.name, entry.region, entry.principle, entry.description, entry.domain]
        .join(' ').toLowerCase().includes(term));
  }, [search]);

  const filteredPractices = useMemo(
    () => WELLNESS_PRACTICES.filter((entry) => filter === 'All' || entry.domain === filter),
    [filter]
  );

  const go = (next: Page) => {
    setPage(next);
  };

  const toggleDay = (day: number) => {
    const next = completed.includes(day)
      ? completed.filter((value) => value !== day)
      : [...completed, day].sort((a, b) => a - b);
    setCompleted(next);
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch {
      // Optional local-only progress. Never transmit progress off-device.
    }
  };

  const resetDays = () => {
    setCompleted([]);
    try { localStorage.removeItem(PROGRESS_KEY); } catch {
      // Clearing local progress should work even when storage is unavailable.
    }
  };

  const cardStyle = { backgroundColor: theme.card, borderColor: theme.cardBorder };
  const primary = { color: theme.textPrimary };
  const secondary = { color: theme.textSecondary };
  const eyebrow = { color: theme.accentPrimary };
  const sourceLink = (id: string) => (
    <Pressable
      onPress={() => openReference(id)}
      accessibilityRole="link"
      accessibilityLabel={'Open source ' + id}
      style={styles.sourceAction}
    >
      <Text style={[styles.sourceActionText, eyebrow]}>View source {id} ↗</Text>
    </Pressable>
  );

  if (volume !== 1) {
    return (
      <WellnessVolumeScreen
        key={volume}
        volumeId={volume as 2 | 3 | 4 | 5 | 6}
        onSelectVolume={selectVolume}
        onReturnToCompass={onReturnToCompass}
      />
    );
  }

  return (
    <ScrollView key={page} contentContainerStyle={styles.container}>
      <View style={styles.breadcrumb}>
        <Pressable onPress={onReturnToCompass} accessibilityRole="button" accessibilityLabel="Back to Inner Compass home"
          style={[styles.backButton, cardStyle]}>
          <Text style={[styles.backText, eyebrow]}>← Back to Inner Compass</Text>
        </Pressable>
        <Text style={[styles.breadcrumbText, secondary]}>WELLNESS LIBRARY / VOLUME {String(volume).padStart(2, '0')}</Text>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.heroKicker, eyebrow]}>THE WHOLE LIFE FIELD GUIDE  ·  VOLUME I</Text>
        <Text style={[styles.heroTitle, primary]}>Mind. Body. Soul.</Text>
        <Text style={[styles.heroText, secondary]}>
          A source-grounded library of philosophical traditions, accessible wellness practices, and ways to reflect on meaning.
          This is the first volume in a multi-volume collection.
        </Text>
        <View style={styles.heroStats}>
          <Text style={[styles.heroStat, primary]}>12 traditions</Text>
          <Text style={[styles.heroStat, primary]}>18 practices</Text>
          <Text style={[styles.heroStat, primary]}>24 sources</Text>
        </View>
      </View>

      <Text style={[styles.smallLabel, eyebrow]}>THE SIX-VOLUME COLLECTION</Text>
      <WellnessVolumePicker selectedVolume={volume} onSelectVolume={selectVolume} />

      <View style={styles.nav} accessibilityLabel="Health and wellness volume pages">
        {PAGES.map((item) => {
          const active = page === item.id;
          return (
            <Pressable key={item.id} onPress={() => go(item.id)}
              accessibilityRole="button" accessibilityLabel={'Wellness page: ' + item.title}
              accessibilityState={{ selected: active }}
              style={[styles.navButton, {
                backgroundColor: active ? theme.accentPrimary : theme.card,
                borderColor: active ? theme.accentPrimary : theme.cardBorder,
              }]}>
              <Text style={[styles.navText, { color: active ? theme.accentText : theme.textPrimary }]}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {page === 'overview' && (
        <View>
          <Text style={[styles.pageTitle, primary]}>A guide to whole-person wellness</Text>
          <Text style={[styles.lead, secondary]}>
            Mind, body and soul are useful perspectives, not separate clinical diagnoses.
            Soul can mean values, purpose, connection, wonder or the sacred according to your own beliefs.
            You do not need to belong to a religious tradition to read or participate.
          </Text>
          <View style={styles.overviewGrid}>
            {[
              ['MIND', 'Notice more clearly', 'Attention, emotion, perspective and decisions.'],
              ['BODY', 'Support what carries you', 'Rest, movement, food, physical needs and limits.'],
              ['SOUL', 'Live with meaning', 'Ethics, purpose, relationships, belonging and reverence.'],
            ].map(([label, title, detail]) => (
              <View key={label} style={[styles.pillar, cardStyle]}>
                <Text style={[styles.kicker, eyebrow]}>{label}</Text>
                <Text style={[styles.cardTitle, primary]}>{title}</Text>
                <Text style={[styles.cardText, secondary]}>{detail}</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.sectionTitle, primary]}>Three layers, clearly distinguished</Text>
          {[
            ['01 · Traditions', 'What a philosophy or faith community teaches, expressed in its own context.'],
            ['02 · Research', 'What empirical studies or public-health guidance say, including uncertainty.'],
            ['03 · Application', 'Small, optional practices you can adapt without making wellness a performance test.'],
          ].map(([title, detail]) => (
            <View key={title} style={[styles.card, cardStyle]}>
              <Text style={[styles.cardTitle, primary]}>{title}</Text>
              <Text style={[styles.cardText, secondary]}>{detail}</Text>
            </View>
          ))}
          <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={[styles.noticeTitle, primary]}>Choose what helps; leave what does not.</Text>
            <Text style={[styles.cardText, secondary]}>
              This is reflective education, not therapy, a diagnosis, medical treatment or a replacement for qualified support.
              Stillness and contemplation do not help everyone. Stop practices that feel painful or distressing;
              avoid forced breathing, fasting, extreme exercise or miracle-cure claims.
            </Text>
          </View>
          <Pressable onPress={() => go('traditions')} accessibilityRole="button"
            accessibilityLabel="Explore wellness traditions" style={[styles.primaryButton, { backgroundColor: theme.accentPrimary }]}>
            <Text style={[styles.primaryButtonText, { color: theme.accentText }]}>Explore traditions →</Text>
          </Pressable>
        </View>
      )}

      {page === 'traditions' && (
        <View>
          <Text style={[styles.pageTitle, primary]}>Wisdom traditions</Text>
          <Text style={[styles.lead, secondary]}>Explore distinct worldviews without assuming they are interchangeable. Sources explain each tradition in its own setting.</Text>
          <TextInput value={search} onChangeText={setSearch}
            placeholder="Search traditions, themes, regions…" placeholderTextColor={theme.textMuted}
            accessibilityLabel="Search wellness traditions"
            style={[styles.search, { backgroundColor: theme.inputBg, color: theme.textPrimary, borderColor: theme.inputBorder }]} />
          <Text style={[styles.smallLabel, secondary]}>{filteredTraditions.length} of {WELLNESS_TRADITIONS.length} traditions</Text>
          {filteredTraditions.map((entry) => (
            <View key={entry.name} style={[styles.card, cardStyle]}>
              <Text style={[styles.kicker, eyebrow]}>{entry.region} · {entry.domain}</Text>
              <Text style={[styles.cardTitle, primary]}>{entry.name}</Text>
              <Text style={[styles.emphasis, primary]}>{entry.principle}</Text>
              <Text style={[styles.cardText, secondary]}>{entry.description}</Text>
              <Text style={[styles.prompt, secondary]}>Reflect: {entry.reflection}</Text>
              {sourceLink(entry.source)}
            </View>
          ))}
        </View>
      )}

      {page === 'practices' && (
        <View>
          <Text style={[styles.pageTitle, primary]}>Practice library</Text>
          <Text style={[styles.lead, secondary]}>
            Gentle activities you may adapt or skip. A traditional rationale is not proof of a clinical effect.
            Always respect your physical limits and personal circumstances.
          </Text>
          <View style={styles.filters}>
            {FILTERS.map((entry) => (
              <Pressable key={entry} onPress={() => setFilter(entry)}
                accessibilityRole="button" accessibilityLabel={'Filter ' + entry + ' wellness practices'}
                accessibilityState={{ selected: filter === entry }}
                style={[styles.filter, { backgroundColor: filter === entry ? theme.accentPrimary : theme.card,
                  borderColor: filter === entry ? theme.accentPrimary : theme.cardBorder }]}>
                <Text style={[styles.filterText, { color: filter === entry ? theme.accentText : theme.textPrimary }]}>{entry}</Text>
              </Pressable>
            ))}
          </View>
          {filteredPractices.map((entry) => (
            <View key={entry.title} style={[styles.card, cardStyle]}>
              <Text style={[styles.kicker, eyebrow]}>{entry.domain.toUpperCase()} · {entry.time}</Text>
              <Text style={[styles.cardTitle, primary]}>{entry.title}</Text>
              <Text style={[styles.cardText, secondary]}>{entry.description}</Text>
              <Text style={[styles.prompt, secondary]}>Evidence context: {entry.evidenceNote}</Text>
              {sourceLink(entry.source)}
            </View>
          ))}
        </View>
      )}

      {page === 'journey' && (
        <View>
          <Text style={[styles.pageTitle, primary]}>Your 21-day journey</Text>
          <Text style={[styles.lead, secondary]}>
            A flexible reading and practice route. Checkmarks are optional and stay on this device.
            There is no deadline, streak or penalty for taking breaks.
          </Text>
          <View style={[styles.progressCard, cardStyle]}>
            <Text style={[styles.cardTitle, primary]}>{completed.length} of {WELLNESS_JOURNEY.length} explored</Text>
            <View style={[styles.progressTrack, { backgroundColor: theme.badgeBg }]}>
              <View style={[styles.progressFill, { backgroundColor: theme.accentPrimary,
                width: (100 * completed.length / WELLNESS_JOURNEY.length) + '%' }]} />
            </View>
            <Pressable onPress={resetDays} accessibilityRole="button" accessibilityLabel="Reset wellness journey checkmarks">
              <Text style={[styles.reset, eyebrow]}>Reset my checkmarks</Text>
            </Pressable>
          </View>
          {WELLNESS_JOURNEY.map((prompt, index) => (
            <React.Fragment key={index}>
              {index % 7 === 0 && (
                <Text style={[styles.sectionTitle, primary]}>
                  {index === 0 ? 'Week 1 · Notice' : index === 7 ? 'Week 2 · Practice' : 'Week 3 · Integrate'}
                </Text>
              )}
              <Pressable onPress={() => toggleDay(index)} accessibilityRole="checkbox"
                accessibilityLabel={'Day ' + (index + 1) + ': ' + prompt}
                accessibilityState={{ checked: completed.includes(index) }}
                style={[styles.day, cardStyle]}>
                <Text style={[styles.dayCheck, eyebrow]}>{completed.includes(index) ? '☑' : '☐'}</Text>
                <Text style={[styles.dayText, { color: completed.includes(index) ? theme.textMuted : theme.textPrimary }]}>
                  {String(index + 1).padStart(2, '0')} · {prompt}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      )}

      {page === 'sources' && (
        <View>
          <Text style={[styles.pageTitle, primary]}>Sources & further reading</Text>
          <Text style={[styles.lead, secondary]}>
            Tradition references describe historical and religious teachings; research references examine measurable outcomes.
            Neither category alone verifies the other. Third-party links open external sites.
          </Text>
          {(['Tradition', 'Research'] as const).map((kind) => (
            <View key={kind}>
              <Text style={[styles.sectionTitle, primary]}>{kind === 'Tradition' ? 'Philosophy and traditions' : 'Health research and guidance'}</Text>
              {WELLNESS_SOURCES.filter((entry) => entry.kind === kind).map((entry) => (
                <Pressable key={entry.id} onPress={() => openReference(entry.id)}
                  accessibilityRole="link" accessibilityLabel={'Open external source ' + entry.title}
                  style={[styles.sourceCard, cardStyle]}>
                  <Text style={[styles.kicker, eyebrow]}>{entry.id} · {entry.publisher}</Text>
                  <Text style={[styles.emphasis, primary]}>{entry.title} ↗</Text>
                </Pressable>
              ))}
            </View>
          ))}
          <Text style={[styles.smallLabel, secondary]}>
            Edition 1 · October 22, 2026. Curated references, not a systematic review.
            The full source links are part of this public guide, independent of any private repository.
          </Text>
        </View>
      )}

      <View style={[styles.bottomNav, { borderTopColor: theme.cardBorder }]}>
        <Pressable onPress={onReturnToCompass} accessibilityRole="button" accessibilityLabel="Return to Inner Compass"
          style={[styles.backButton, cardStyle]}>
          <Text style={[styles.backText, eyebrow]}>← Inner Compass home</Text>
        </Pressable>
        <Pressable onPress={() => go('overview')} accessibilityRole="button"
          accessibilityLabel="Return to wellness volume overview" style={[styles.backButton, cardStyle]}>
          <Text style={[styles.backText, primary]}>Volume I overview ↑</Text>
        </Pressable>
      </View>
      <Text style={[styles.footer, secondary]}>
        Inner Compass Beta · Educational content · Not medical advice · No clinical claims ·
        Personal reading and checkmarks remain browser-local.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 970, alignSelf: 'center', padding: 19, paddingBottom: 65 },
  breadcrumb: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  breadcrumbText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  backButton: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 13, paddingVertical: 10 },
  backText: { fontSize: 12, fontWeight: '800' },
  hero: { padding: 25, borderWidth: 1, borderRadius: 18, marginBottom: 16 },
  heroKicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1 },
  heroTitle: { fontFamily: 'serif', fontSize: 34, fontWeight: '600', marginVertical: 10 },
  heroText: { fontSize: 14, lineHeight: 23, maxWidth: 630 },
  heroStats: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', marginTop: 20 },
  heroStat: { fontSize: 11, fontWeight: '800' },
  nav: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 24 },
  navButton: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 13, paddingVertical: 10 },
  navText: { fontSize: 11, fontWeight: '800' },
  pageTitle: { fontFamily: 'serif', fontWeight: '600', fontSize: 28, marginBottom: 10 },
  lead: { fontSize: 14, lineHeight: 23, marginBottom: 18 },
  overviewGrid: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginBottom: 16 },
  pillar: { flexBasis: 200, flexGrow: 1, borderWidth: 1, borderRadius: 13, padding: 17 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7, marginBottom: 8 },
  card: { borderWidth: 1, padding: 18, borderRadius: 13, marginBottom: 12 },
  cardTitle: { fontFamily: 'serif', fontSize: 21, fontWeight: '600', marginBottom: 6 },
  cardText: { fontSize: 13, lineHeight: 21 },
  emphasis: { fontWeight: '700', fontSize: 14, marginBottom: 7 },
  prompt: { fontSize: 12, lineHeight: 20, marginTop: 13, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#83908c45' },
  sectionTitle: { fontFamily: 'serif', fontSize: 22, fontWeight: '600', marginTop: 23, marginBottom: 13 },
  notice: { borderWidth: 1, borderRadius: 13, padding: 19, marginVertical: 14 },
  noticeTitle: { fontWeight: '800', fontSize: 15, marginBottom: 7 },
  primaryButton: { alignSelf: 'flex-start', paddingVertical: 13, paddingHorizontal: 19, borderRadius: 11, marginTop: 10 },
  primaryButtonText: { fontWeight: '800' },
  search: { borderWidth: 1, borderRadius: 11, fontSize: 14, paddingHorizontal: 15, paddingVertical: 11, marginBottom: 9 },
  smallLabel: { fontSize: 11, marginBottom: 16, lineHeight: 18 },
  sourceAction: { alignSelf: 'flex-start', marginTop: 13, minHeight: 26, justifyContent: 'center' },
  sourceActionText: { fontWeight: '800', fontSize: 12 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 17 },
  filter: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, borderRadius: 21 },
  filterText: { fontSize: 12, fontWeight: '700' },
  progressCard: { padding: 18, borderWidth: 1, borderRadius: 13, marginBottom: 16 },
  progressTrack: { height: 9, borderRadius: 10, overflow: 'hidden', marginTop: 10 },
  progressFill: { height: '100%', borderRadius: 10 },
  reset: { fontSize: 12, fontWeight: '700', marginTop: 13 },
  day: { flexDirection: 'row', alignItems: 'center', gap: 13, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 13, borderRadius: 10, marginBottom: 7 },
  dayCheck: { fontSize: 20, width: 27 },
  dayText: { fontSize: 13, flexShrink: 1, lineHeight: 20 },
  sourceCard: { padding: 15, borderWidth: 1, borderRadius: 11, marginBottom: 10 },
  bottomNav: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, borderTopWidth: 1, marginTop: 34, paddingTop: 20 },
  footer: { fontSize: 11, marginTop: 20, lineHeight: 18 },
});
