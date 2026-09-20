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
import { WISDOM_LIBRARY_RECORDS, WISDOM_TRADITIONS } from '../data/wisdomLibrary';
import { READING_RECORDS } from '../data/readingDirectory';

interface WisdomLibraryScreenProps {
  initialCategoryId?: number | null;
  initialRecordId?: string | null;
  onSelectCategoryId?: (categoryId: number) => void;
  onOpenSuggestedReads?: (recordId: string) => void;
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

export const WisdomLibraryScreen: React.FC<WisdomLibraryScreenProps> = ({
  initialCategoryId = null,
  initialRecordId = null,
  onSelectCategoryId,
  onOpenSuggestedReads,
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [tradition, setTradition] = useState('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [linkedCategoryId, setLinkedCategoryId] = useState<number | null>(initialCategoryId);
  const [linkedRecordId, setLinkedRecordId] = useState<string | null>(initialRecordId);

  useEffect(() => {
    setLinkedCategoryId(initialCategoryId);
    setLinkedRecordId(initialRecordId);
  }, [initialCategoryId, initialRecordId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WISDOM_LIBRARY_RECORDS.filter((record) => {
      if (tradition !== 'ALL' && record.tradition !== tradition) return false;
      if (verifiedOnly && record.record_type !== 'VERIFIED_DIRECT_QUOTE') return false;
      if (linkedCategoryId && !record.category_ids.includes(linkedCategoryId)) return false;
      if (linkedRecordId && record.record_id !== linkedRecordId) return false;
      if (!q) return true;
      const haystack = [
        record.author_or_attributed_figure,
        record.work,
        record.tradition,
        record.school_or_lineage || '',
        record.display_summary,
        ...(record.philosophical_themes || []),
        ...(record.retrieval_keywords || []),
        ...(record.category_ids || []).map(String),
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query, tradition, verifiedOnly, linkedCategoryId, linkedRecordId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>SOURCE-LINKED WISDOM LIBRARY</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Wisdom Library</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Browse source-linked teachings across traditions. Safety routing remains active throughout the experience.
        </Text>
      </View>

      <View style={[styles.notice, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.noticeTitle, { color: theme.textPrimary }]}>Quote-display rights gate</Text>
        <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
          Some source passages are listed without reproducing the full quotation text. Teaching summaries and source details remain available.
        </Text>
      </View>

      {(linkedCategoryId || linkedRecordId) && (
        <View style={[styles.linkContext, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.linkContextText, { color: theme.textSecondary }]}>
            Showing wisdom linked to {linkedRecordId ? linkedRecordId : `Category #${linkedCategoryId}`}.
          </Text>
          <Pressable
            onPress={() => {
              setLinkedCategoryId(null);
              setLinkedRecordId(null);
            }}
          >
            <Text style={[styles.clearLink, { color: theme.accentPrimary }]}>Show all wisdom</Text>
          </Pressable>
        </View>
      )}

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search author, work, tradition, theme, or category…"
        placeholderTextColor={theme.textMuted}
        accessibilityLabel="Search Wisdom Library"
        style={[
          styles.search,
          {
            color: theme.textPrimary,
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
          },
        ]}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <Pressable
          onPress={() => setTradition('ALL')}
          style={[
            styles.chip,
            {
              backgroundColor: tradition === 'ALL' ? theme.accentPrimary : theme.badgeBg,
              borderColor: tradition === 'ALL' ? theme.accentPrimary : theme.badgeBorder,
            },
          ]}
        >
          <Text style={{ color: tradition === 'ALL' ? theme.accentText : theme.badgeText, fontWeight: '700' }}>All traditions</Text>
        </Pressable>
        {WISDOM_TRADITIONS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setTradition(item)}
            style={[
              styles.chip,
              {
                backgroundColor: tradition === item ? theme.accentPrimary : theme.badgeBg,
                borderColor: tradition === item ? theme.accentPrimary : theme.badgeBorder,
              },
            ]}
          >
            <Text style={{ color: tradition === item ? theme.accentText : theme.badgeText, fontWeight: '700' }}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        onPress={() => setVerifiedOnly((v) => !v)}
        style={[styles.toggle, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: verifiedOnly }}
      >
        <Text style={[styles.toggleText, { color: theme.textPrimary }]}>
          {verifiedOnly ? '✓ ' : '○ '}Source-passage records only
        </Text>
      </Pressable>

      <Text style={[styles.resultCount, { color: theme.textMuted }]}>{filtered.length} records</Text>

      <View style={styles.list}>
        {filtered.map((record) => (
          <View
            key={record.record_id}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                shadowColor: theme.cardShadow,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: record.record_type === 'VERIFIED_DIRECT_QUOTE' ? theme.affirmationBg : theme.badgeBg,
                    borderColor: record.record_type === 'VERIFIED_DIRECT_QUOTE' ? theme.affirmationBorder : theme.badgeBorder,
                  },
                ]}
              >
                <Text style={[styles.typeText, { color: theme.textPrimary }]}>
                  {record.record_type === 'VERIFIED_DIRECT_QUOTE'
                    ? 'SOURCE PASSAGE'
                    : 'SOURCE PARAPHRASE'}
                </Text>
              </View>
              <Text style={[styles.confidence, { color: theme.textMuted }]}>
                Fit {Math.round(record.category_fit_score)}%
              </Text>
            </View>

            <Text style={[styles.work, { color: theme.textPrimary }]}>{record.work}</Text>
            <Text style={[styles.author, { color: theme.textSecondary }]}>
              {record.author_or_attributed_figure}
            </Text>
            <Text style={[styles.tradition, { color: theme.accentPrimary }]}>{record.tradition}</Text>

            <Text style={[styles.summary, { color: theme.textSecondary }]}>{record.display_summary}</Text>

            {record.direct_quote_available && !record.direct_quote_text_display_enabled && (
              <View style={[styles.lockedBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Text style={[styles.lockedText, { color: theme.textMuted }]}>
                  Exact quotation intentionally withheld pending product-display rights approval.
                </Text>
              </View>
            )}

            <View style={styles.tags}>
              {record.category_ids.map((id) => (
                <Pressable
                  key={id}
                  disabled={!onSelectCategoryId}
                  onPress={() => onSelectCategoryId?.(id)}
                  style={[styles.categoryTag, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                >
                  <Text style={[styles.categoryTagText, { color: theme.badgeText }]}>Category #{id}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.meta, { color: theme.textMuted }]}>
              {record.translator ? `Translator: ${record.translator} · ` : ''}
              {record.edition || 'Edition recorded in research corpus'}
            </Text>

            <View style={styles.linkActions}>
              {record.source_urls[0] && (
                <Pressable onPress={() => openExternalUrl(record.source_urls[0])} style={styles.sourceLink}>
                  <Text style={[styles.sourceLinkText, { color: theme.accentPrimary }]}>Open source record ↗</Text>
                </Pressable>
              )}
              {onOpenSuggestedReads &&
                READING_RECORDS.some((reading) => reading.related_wisdom_record_ids.includes(record.record_id)) && (
                  <Pressable
                    onPress={() => onOpenSuggestedReads(record.record_id)}
                    accessibilityLabel={`Suggested reads for ${record.record_id}`}
                    style={styles.sourceLink}
                  >
                    <Text style={[styles.sourceLinkText, { color: theme.accentPrimary }]}>Suggested Reads →</Text>
                  </Pressable>
                )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 70, maxWidth: 900, width: '100%', alignSelf: 'center' },
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
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 10 },
  filters: { gap: 8, paddingVertical: 4, paddingRight: 20 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 7 },
  toggle: { borderWidth: 1, borderRadius: 10, padding: 11, marginTop: 10 },
  toggleText: { fontSize: 12, fontWeight: '700' },
  resultCount: { fontSize: 11, fontWeight: '700', marginVertical: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  list: { gap: 12 },
  card: { borderWidth: 1, borderRadius: 16, padding: 17, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 6 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  typeBadge: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 4 },
  typeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  confidence: { fontSize: 10, fontWeight: '700' },
  work: { fontSize: 19, fontWeight: '800', marginTop: 12 },
  author: { fontSize: 13, marginTop: 3 },
  tradition: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  summary: { fontSize: 14, lineHeight: 21, marginTop: 12 },
  lockedBox: { borderWidth: 1, borderRadius: 9, padding: 10, marginTop: 10 },
  lockedText: { fontSize: 11, lineHeight: 16 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  categoryTag: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4 },
  categoryTagText: { fontSize: 10, fontWeight: '700' },
  meta: { fontSize: 10, marginTop: 10, lineHeight: 15 },
  linkActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 6 },
  sourceLink: { alignSelf: 'flex-start', marginTop: 4, paddingVertical: 4 },
  sourceLinkText: { fontSize: 12, fontWeight: '800' },
});
