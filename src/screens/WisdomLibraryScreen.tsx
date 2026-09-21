import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../theme';
import { searchWisdomArchive } from '../data/wisdomArchive';
import { WisdomPassage } from '../types';

interface WisdomLibraryScreenProps {
  initialCategoryId?: number | null;
  initialRecordId?: string | null;
  onSelectCategoryId?: (categoryId: number) => void;
  onOpenSuggestedReads?: (categoryId: number) => void;
}

const openExternalUrl = async (url: string) => {
  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  if (await Linking.canOpenURL(url)) {
    await Linking.openURL(url);
  }
};

const PassageCard: React.FC<{ passage: WisdomPassage }> = ({ passage }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.passageCard, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
      <Text style={[styles.passageLabel, { color: theme.textMuted }]}>
        {passage.displayMode === 'APPROVED_PASSAGE' ? 'SOURCE PASSAGE' : 'SOURCE PASSAGE SUMMARY'}
      </Text>
      <Text style={[styles.passageSummary, { color: theme.textPrimary }]}>{passage.summary}</Text>
      <Text style={[styles.passageSource, { color: theme.textSecondary }]}>
        {passage.author} · {passage.work}
        {passage.section ? ` · ${passage.section}` : ''}
      </Text>
      {passage.sourceUrl && (
        <Pressable onPress={() => openExternalUrl(passage.sourceUrl!)} accessibilityRole="link">
          <Text style={[styles.sourceLink, { color: theme.accentPrimary }]}>View source ↗</Text>
        </Pressable>
      )}
    </View>
  );
};

export const WisdomLibraryScreen: React.FC<WisdomLibraryScreenProps> = ({
  initialCategoryId = null,
  initialRecordId = null,
  onSelectCategoryId,
  onOpenSuggestedReads,
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [linkedCategoryId, setLinkedCategoryId] = useState<number | null>(initialCategoryId);
  const [linkedRecordId, setLinkedRecordId] = useState<string | null>(initialRecordId);
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(
    initialCategoryId
  );

  useEffect(() => {
    setLinkedCategoryId(initialCategoryId);
    setLinkedRecordId(initialRecordId);
    if (initialCategoryId) setExpandedCategoryId(initialCategoryId);
  }, [initialCategoryId, initialRecordId]);

  const filtered = useMemo(
    () => searchWisdomArchive(query, linkedCategoryId, linkedRecordId),
    [query, linkedCategoryId, linkedRecordId]
  );

  const clearContext = () => {
    setLinkedCategoryId(null);
    setLinkedRecordId(null);
    setExpandedCategoryId(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>SEARCHABLE REFLECTION ARCHIVE</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Wisdom Archive</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Search reflection themes for source passages, positive affirmations, and practical guidance.
        </Text>
      </View>

      <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>Wisdom stays concise</Text>
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          This archive is organized around the same 25 reflection themes used by Inner Compass. Books, schools, historical context, and deeper study belong in Suggested Reads.
        </Text>
      </View>

      {(linkedCategoryId || linkedRecordId) && (
        <View style={[styles.linkContext, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.linkContextText, { color: theme.textSecondary }]}>
            Showing wisdom connected to your current selection.
          </Text>
          <Pressable onPress={clearContext}>
            <Text style={[styles.clearLink, { color: theme.accentPrimary }]}>Search the full archive</Text>
          </Pressable>
        </View>
      )}

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search loneliness, anger, purpose, grief, authors, or ideas…"
        placeholderTextColor={theme.textMuted}
        accessibilityLabel="Search Wisdom Archive"
        style={[
          styles.search,
          {
            color: theme.textPrimary,
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
          },
        ]}
      />

      <Text style={[styles.resultCount, { color: theme.textMuted }]}>
        {filtered.length} reflection {filtered.length === 1 ? 'theme' : 'themes'}
      </Text>

      <View style={styles.list}>
        {filtered.map((entry) => {
          const expanded = expandedCategoryId === entry.categoryId;
          const passages = expanded ? entry.passages : entry.passages.slice(0, 1);
          const guidancePoints = expanded ? entry.guidancePoints : entry.guidancePoints.slice(0, 1);

          return (
            <View
              key={entry.categoryId}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              {...({ 'data-testid': `wisdom-category-${entry.categoryId}` } as any)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeading}>
                  <Text style={[styles.categoryEyebrow, { color: theme.textMuted }]}>
                    REFLECTION THEME {entry.categoryId}
                  </Text>
                  <Text style={[styles.categoryTitle, { color: theme.textPrimary }]}>
                    {entry.categoryName}
                  </Text>
                </View>
                <View style={styles.roots}>
                  {entry.existentialRoots.map((root) => (
                    <View
                      key={root}
                      style={[styles.rootTag, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                    >
                      <Text style={[styles.rootTagText, { color: theme.badgeText }]}>{root}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={[
                  styles.affirmationBox,
                  { backgroundColor: theme.affirmationBg, borderColor: theme.affirmationBorder },
                ]}
              >
                <Text style={[styles.sectionLabel, { color: theme.affirmationLabel }]}>POSITIVE AFFIRMATION</Text>
                <Text style={[styles.affirmationText, { color: theme.affirmationText }]}>
                  {entry.affirmation}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>GUIDANCE</Text>
                <Text style={[styles.guidanceSummary, { color: theme.textPrimary }]}>
                  {entry.guidanceSummary}
                </Text>

                {guidancePoints.map((point) => (
                  <View key={point.id} style={styles.guidancePoint}>
                    <Text style={[styles.guidanceLens, { color: theme.accentPrimary }]}>{point.lens}</Text>
                    <Text style={[styles.guidanceText, { color: theme.textSecondary }]}>{point.teaching}</Text>
                    {expanded && point.practice && (
                      <Text style={[styles.practiceText, { color: theme.textPrimary }]}>
                        Practice: {point.practice}
                      </Text>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>PASSAGES & SOURCE NOTES</Text>
                <View style={styles.passages}>
                  {passages.map((passage) => (
                    <PassageCard key={passage.recordId} passage={passage} />
                  ))}
                </View>
              </View>

              <View style={styles.actions}>
                <Pressable
                  onPress={() => setExpandedCategoryId(expanded ? null : entry.categoryId)}
                  style={[styles.actionButton, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                  accessibilityLabel={expanded ? `Collapse wisdom for category ${entry.categoryId}` : `Expand wisdom for category ${entry.categoryId}`}
                >
                  <Text style={[styles.actionText, { color: theme.textPrimary }]}>
                    {expanded ? 'Show less' : 'Show full entry'}
                  </Text>
                </Pressable>

                {onSelectCategoryId && (
                  <Pressable
                    onPress={() => onSelectCategoryId(entry.categoryId)}
                    accessibilityLabel={`Open reflection guidance for ${entry.categoryName}`}
                    style={[styles.actionButton, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                  >
                    <Text style={[styles.actionText, { color: theme.accentPrimary }]}>Open as reflection →</Text>
                  </Pressable>
                )}

                {onOpenSuggestedReads && (
                  <Pressable
                    onPress={() => onOpenSuggestedReads(entry.categoryId)}
                    accessibilityLabel={`Suggested reads related to ${entry.categoryName}`}
                    style={[styles.actionButton, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                  >
                    <Text style={[styles.actionText, { color: theme.accentPrimary }]}>Suggested Reads →</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No matching wisdom theme</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Try a broader word such as loneliness, anger, grief, purpose, identity, or uncertainty.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 70, maxWidth: 920, width: '100%', alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 18, paddingTop: 8 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 30, fontWeight: '700', fontFamily: 'serif', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 21, maxWidth: 680, textAlign: 'center' },
  notice: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 14 },
  noticeTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  noticeText: { fontSize: 12, lineHeight: 18 },
  linkContext: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  linkContextText: { fontSize: 11, fontWeight: '600', flex: 1 },
  clearLink: { fontSize: 11, fontWeight: '800' },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  resultCount: { fontSize: 11, fontWeight: '800', marginVertical: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { gap: 14 },
  card: { borderWidth: 1, borderRadius: 16, padding: 17 },
  cardHeader: { gap: 10, marginBottom: 14 },
  cardHeading: { gap: 4 },
  categoryEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 0.7 },
  categoryTitle: { fontSize: 20, lineHeight: 25, fontWeight: '800' },
  roots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rootTag: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4 },
  rootTagText: { fontSize: 9, fontWeight: '800' },
  affirmationBox: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 14 },
  section: { gap: 8, marginTop: 4, marginBottom: 14 },
  sectionLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  affirmationText: { fontSize: 16, lineHeight: 24, fontFamily: 'serif', fontStyle: 'italic' },
  guidanceSummary: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
  guidancePoint: { gap: 4, paddingTop: 4 },
  guidanceLens: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.4 },
  guidanceText: { fontSize: 13, lineHeight: 20 },
  practiceText: { fontSize: 12, lineHeight: 19, fontStyle: 'italic' },
  passages: { gap: 8 },
  passageCard: { borderWidth: 1, borderRadius: 12, padding: 12 },
  passageLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6, marginBottom: 5 },
  passageSummary: { fontSize: 13, lineHeight: 20 },
  passageSource: { fontSize: 10, lineHeight: 15, marginTop: 7, fontStyle: 'italic' },
  sourceLink: { fontSize: 11, fontWeight: '800', marginTop: 7 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8 },
  actionText: { fontSize: 11, fontWeight: '800' },
  emptyState: { borderWidth: 1, borderRadius: 14, padding: 22, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  emptyText: { fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
