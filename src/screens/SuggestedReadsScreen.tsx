import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import { useTheme } from '../theme';
import { READING_PATHWAYS, READING_RECORDS } from '../data/readingDirectory';
import { WISDOM_LIBRARY_RECORDS } from '../data/wisdomLibrary';
import { getCategoryById } from '../knowledgeBase/kbLoader';

interface SuggestedReadsScreenProps {
  initialCategoryId?: number | null;
  initialWisdomRecordId?: string | null;
  onSelectCategoryId?: (categoryId: number) => void;
  onOpenWisdomRecord?: (recordId: string) => void;
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

const humanizeLabel = (value: string) =>
  value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const COVER_MARKS: Record<string, string> = {
  Stoicism: 'Σ',
  'Early Buddhist / Theravada canonical literature': '☸',
  'Zen Buddhism': '◯',
  'Hindu philosophical traditions': 'ॐ',
  'Upanishadic / Vedantic source tradition': 'ॐ',
  'Yoga philosophy': 'ॐ',
  'Classical Daoism': '道',
  Confucianism: '仁',
  'Jaina philosophy': 'अ',
  Epicureanism: 'Ε',
};

export const SuggestedReadsScreen: React.FC<SuggestedReadsScreenProps> = ({
  initialCategoryId = null,
  initialWisdomRecordId = null,
  onSelectCategoryId,
  onOpenWisdomRecord,
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [tradition, setTradition] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [region, setRegion] = useState('ALL');
  const [recordType, setRecordType] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [openAccessOnly, setOpenAccessOnly] = useState(false);
  const [pathway, setPathway] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [traditionMenuOpen, setTraditionMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  const [failedCovers, setFailedCovers] = useState<Record<string, boolean>>({});
  const [linkedCategoryId, setLinkedCategoryId] = useState<number | null>(initialCategoryId);
  const [linkedWisdomRecordId, setLinkedWisdomRecordId] = useState<string | null>(initialWisdomRecordId);

  useEffect(() => {
    setLinkedCategoryId(initialCategoryId);
    setLinkedWisdomRecordId(initialWisdomRecordId);
  }, [initialCategoryId, initialWisdomRecordId]);

  const traditions = useMemo(
    () => Array.from(new Set(READING_RECORDS.map((record) => record.tradition))).sort(),
    []
  );
  const branches = useMemo(
    () => Array.from(new Set(READING_RECORDS.flatMap((record) => record.branch_coverage))).sort(),
    []
  );
  const regions = useMemo(
    () => Array.from(new Set(READING_RECORDS.map((record) => record.region))).sort(),
    []
  );
  const recordTypes = useMemo(
    () => Array.from(new Set(READING_RECORDS.map((record) => record.record_type))).sort(),
    []
  );

  const selectedPathway = READING_PATHWAYS.find((p) => p.pathway_id === pathway);

  const resetDiscovery = () => {
    setTradition('ALL');
    setBranchFilter('ALL');
    setRegion('ALL');
    setRecordType('ALL');
    setDifficulty('ALL');
    setOpenAccessOnly(false);
    setPathway(null);
    setLinkedCategoryId(null);
    setLinkedWisdomRecordId(null);
  };

  useEffect(() => {
    setPage(1);
  }, [query, tradition, branchFilter, region, recordType, difficulty, openAccessOnly, pathway, linkedCategoryId, linkedWisdomRecordId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pathwayIds = selectedPathway ? new Set(selectedPathway.reading_ids) : null;

    return READING_RECORDS.filter((record) => {
      if (tradition !== 'ALL' && record.tradition !== tradition) return false;
      if (branchFilter !== 'ALL' && !record.branch_coverage.includes(branchFilter)) return false;
      if (region !== 'ALL' && record.region !== region) return false;
      if (recordType !== 'ALL' && record.record_type !== recordType) return false;
      if (difficulty !== 'ALL' && record.difficulty !== difficulty) return false;
      if (openAccessOnly && !record.public_domain_available && !record.open_access_url) return false;
      if (pathwayIds && !pathwayIds.has(record.reading_id)) return false;
      if (linkedCategoryId && !record.related_inner_compass_categories.includes(linkedCategoryId)) return false;
      if (linkedWisdomRecordId && !record.related_wisdom_record_ids.includes(linkedWisdomRecordId)) return false;
      if (!q) return true;
      return [
        record.title,
        record.author_or_attributed_author,
        record.tradition,
        record.school || '',
        record.lineage_or_branch || '',
        ...record.branch_coverage,
        record.region,
        record.why_read_it,
        ...record.primary_topics,
        ...record.metaphysical_topics,
        ...record.ethical_topics,
      ].join(' ').toLowerCase().includes(q);
    });
  }, [query, tradition, branchFilter, region, recordType, difficulty, openAccessOnly, selectedPathway, linkedCategoryId, linkedWisdomRecordId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>CURATED DIGITAL LIBRARY</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Suggested Reads</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Go deeper into the books, primary texts, scholarship, traditions, branches, history, and study context behind the Wisdom Archive.
        </Text>
      </View>

      {(linkedCategoryId || linkedWisdomRecordId) && (
        <View style={[styles.linkContext, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.linkContextText, { color: theme.textSecondary }]}>
            Showing reads connected to your current selection.
          </Text>
          <Pressable
            onPress={() => {
              setLinkedCategoryId(null);
              setLinkedWisdomRecordId(null);
            }}
          >
            <Text style={[styles.clearLink, { color: theme.accentPrimary }]}>Show all reads</Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.discoveryPanel, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.discoveryTitle, { color: theme.textPrimary }]}>What do you want to explore?</Text>
        <Text style={[styles.discoveryHint, { color: theme.textSecondary }]}>
          Start with a school of thought. You can narrow the list further only when you need to.
        </Text>

        <Text style={[styles.filterLabel, { color: theme.textMuted }]}>School of thought / tradition</Text>
        <View style={styles.dropdownWrap}>
          <Pressable
            onPress={() => {
              setTraditionMenuOpen((open) => !open);
              setBranchMenuOpen(false);
            }}
            accessibilityRole="button"
            accessibilityLabel="Choose a school of thought or tradition"
            accessibilityState={{ expanded: traditionMenuOpen }}
            style={[styles.dropdownButton, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
          >
            <Text numberOfLines={1} style={[styles.dropdownValue, { color: theme.textPrimary }]}>
              {tradition === 'ALL' ? 'Explore everything' : tradition}
            </Text>
            <Text style={[styles.dropdownChevron, { color: theme.textMuted }]}>{traditionMenuOpen ? '▲' : '▼'}</Text>
          </Pressable>
          {traditionMenuOpen && (
            <View style={[styles.dropdownMenu, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              {['ALL', ...traditions].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    setTradition(item);
                    setBranchFilter('ALL');
                    setTraditionMenuOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: tradition === item }}
                  style={[styles.dropdownOption, tradition === item && { backgroundColor: theme.badgeBg }]}
                >
                  <Text style={[styles.dropdownOptionText, { color: tradition === item ? theme.accentPrimary : theme.textPrimary }]}>
                    {item === 'ALL' ? 'Explore everything' : item}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {tradition !== 'ALL' && branches.some((item) => READING_RECORDS.some((record) => record.tradition === tradition && record.branch_coverage.includes(item))) && (
          <>
            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>School / branch</Text>
            <View style={styles.dropdownWrap}>
              <Pressable
                onPress={() => {
                  setBranchMenuOpen((open) => !open);
                  setTraditionMenuOpen(false);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Choose a school or branch within ${tradition}`}
                accessibilityState={{ expanded: branchMenuOpen }}
                style={[styles.dropdownButton, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
              >
                <Text numberOfLines={1} style={[styles.dropdownValue, { color: theme.textPrimary }]}>
                  {branchFilter === 'ALL' ? 'All branches' : branchFilter}
                </Text>
                <Text style={[styles.dropdownChevron, { color: theme.textMuted }]}>{branchMenuOpen ? '▲' : '▼'}</Text>
              </Pressable>
              {branchMenuOpen && (
                <View style={[styles.dropdownMenu, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                  {['ALL', ...branches.filter((item) => READING_RECORDS.some((record) => record.tradition === tradition && record.branch_coverage.includes(item)))].map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => {
                        setBranchFilter(item);
                        setBranchMenuOpen(false);
                      }}
                      accessibilityRole="button"
                      accessibilityState={{ selected: branchFilter === item }}
                      style={[styles.dropdownOption, branchFilter === item && { backgroundColor: theme.badgeBg }]}
                    >
                      <Text style={[styles.dropdownOptionText, { color: branchFilter === item ? theme.accentPrimary : theme.textPrimary }]}>
                        {item === 'ALL' ? 'All branches' : item}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search a title, author, idea, or topic…"
          placeholderTextColor={theme.textMuted}
          accessibilityLabel="Search Suggested Reads"
          style={[styles.search, { color: theme.textPrimary, backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
        />

        <View style={styles.discoveryActions}>
          <Pressable onPress={() => setShowMoreFilters((value) => !value)} accessibilityRole="button" accessibilityState={{ expanded: showMoreFilters }}>
            <Text style={[styles.actionText, { color: theme.accentPrimary }]}>{showMoreFilters ? 'Hide more filters' : 'More filters'}</Text>
          </Pressable>
          <Pressable onPress={resetDiscovery}>
            <Text style={[styles.actionText, { color: theme.accentPrimary }]}>Reset</Text>
          </Pressable>
        </View>

        {showMoreFilters && (
          <View style={[styles.advancedFilters, { borderTopColor: theme.cardBorder }]}>
            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Reading path</Text>
            <View style={styles.filters}>
              <Pressable onPress={() => setPathway(null)} style={[styles.chip, { backgroundColor: pathway === null ? theme.accentPrimary : theme.badgeBg, borderColor: pathway === null ? theme.accentPrimary : theme.badgeBorder }]}>
                <Text style={{ color: pathway === null ? theme.accentText : theme.badgeText, fontWeight: '700', fontSize: 11 }}>Any path</Text>
              </Pressable>
              {READING_PATHWAYS.map((item) => (
                <Pressable key={item.pathway_id} onPress={() => setPathway(item.pathway_id)} style={[styles.chip, { backgroundColor: pathway === item.pathway_id ? theme.accentPrimary : theme.badgeBg, borderColor: pathway === item.pathway_id ? theme.accentPrimary : theme.badgeBorder }]}>
                  <Text style={{ color: pathway === item.pathway_id ? theme.accentText : theme.badgeText, fontWeight: '700', fontSize: 11 }}>{item.title}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Region</Text>
            <View style={styles.filters}>
              {['ALL', ...regions].map((item) => (
                <Pressable key={item} onPress={() => setRegion(item)} style={[styles.chip, { backgroundColor: region === item ? theme.accentPrimary : theme.badgeBg, borderColor: region === item ? theme.accentPrimary : theme.badgeBorder }]}>
                  <Text style={{ color: region === item ? theme.accentText : theme.badgeText, fontWeight: '700', fontSize: 11 }}>{item === 'ALL' ? 'Any region' : item}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Book type</Text>
            <View style={styles.filters}>
              {['ALL', ...recordTypes].map((item) => (
                <Pressable key={item} onPress={() => setRecordType(item)} style={[styles.chip, { backgroundColor: recordType === item ? theme.accentPrimary : theme.badgeBg, borderColor: recordType === item ? theme.accentPrimary : theme.badgeBorder }]}>
                  <Text style={{ color: recordType === item ? theme.accentText : theme.badgeText, fontWeight: '700', fontSize: 11 }}>{item === 'ALL' ? 'Any book type' : humanizeLabel(item)}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.filterLabel, { color: theme.textMuted }]}>Reading level / access</Text>
            <View style={styles.filters}>
              {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'SPECIALIST'].map((item) => (
                <Pressable key={item} onPress={() => setDifficulty(item)} style={[styles.chip, { backgroundColor: difficulty === item ? theme.accentPrimary : theme.badgeBg, borderColor: difficulty === item ? theme.accentPrimary : theme.badgeBorder }]}>
                  <Text style={{ color: difficulty === item ? theme.accentText : theme.badgeText, fontWeight: '700', fontSize: 11 }}>{item === 'ALL' ? 'Any level' : humanizeLabel(item)}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setOpenAccessOnly((value) => !value)} accessibilityRole="button" accessibilityState={{ selected: openAccessOnly }} style={[styles.chip, { backgroundColor: openAccessOnly ? theme.accentPrimary : theme.badgeBg, borderColor: openAccessOnly ? theme.accentPrimary : theme.badgeBorder }]}>
                <Text style={{ color: openAccessOnly ? theme.accentText : theme.badgeText, fontWeight: '700', fontSize: 11 }}>Free / open access</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <Text style={[styles.count, { color: theme.textMuted }]}>{filtered.length} suggested reads</Text>

      <View style={styles.grid}>
        {paginated.map((record) => {
          const isExpanded = expandedId === record.reading_id;
          const coverFailed = Boolean(failedCovers[record.reading_id]);
          return (
            <View
              key={record.reading_id}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <View style={styles.cardLead}>
                {record.cover_image_url && !coverFailed ? (
                  <Image
                    source={{ uri: record.cover_image_url }}
                    accessibilityLabel={record.cover_image_alt}
                    style={styles.cover}
                    onError={() => setFailedCovers((current) => ({ ...current, [record.reading_id]: true }))}
                  />
                ) : (
                  <View style={[styles.cover, styles.fallbackCover, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                    <Text style={[styles.coverMark, { color: theme.accentPrimary }]}>
                      {COVER_MARKS[record.tradition] || '✦'}
                    </Text>
                    <Text numberOfLines={3} style={[styles.coverTitle, { color: theme.textPrimary }]}>{record.title}</Text>
                    <Text numberOfLines={2} style={[styles.coverAuthor, { color: theme.textMuted }]}>{record.author_or_attributed_author}</Text>
                  </View>
                )}

                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.miniBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                      <Text style={[styles.miniBadgeText, { color: theme.badgeText }]}>{humanizeLabel(record.record_type)}</Text>
                    </View>
                    <View style={[styles.miniBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                      <Text style={[styles.miniBadgeText, { color: theme.badgeText }]}>{humanizeLabel(record.difficulty)}</Text>
                    </View>
                  </View>

                  <Text style={[styles.bookTitle, { color: theme.textPrimary }]}>{record.title}</Text>
                  <Text style={[styles.author, { color: theme.textSecondary }]}>{record.author_or_attributed_author}</Text>
                  <Text style={[styles.tradition, { color: theme.accentPrimary }]}>{record.tradition}</Text>

                  <Text style={[styles.why, { color: theme.textSecondary }]} numberOfLines={isExpanded ? undefined : 3}>
                    {record.why_read_it}
                  </Text>

                  <View style={styles.actions}>
                    <Pressable onPress={() => setExpandedId(isExpanded ? null : record.reading_id)}>
                      <Text style={[styles.actionText, { color: theme.accentPrimary }]}>{isExpanded ? 'Less detail' : 'View details'}</Text>
                    </Pressable>
                    <Pressable onPress={() => openExternalUrl(record.resource_url)}>
                      <Text style={[styles.actionText, { color: theme.accentPrimary }]}>Open book ↗</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              {isExpanded && (
                <View style={[styles.detail, { borderTopColor: theme.cardBorder }]}>
                  <Detail label="Tradition / branch" value={[record.tradition, record.school, record.lineage_or_branch].filter(Boolean).join(' · ')} color={theme.textPrimary} muted={theme.textMuted} />
                  <Detail label="Schools / branches" value={record.branch_coverage.join(' · ')} color={theme.textSecondary} muted={theme.textMuted} />
                  <Detail label="Historical context" value={record.historical_context} color={theme.textSecondary} muted={theme.textMuted} />
                  <Detail label="Helpful context" value={record.what_it_is_not} color={theme.textSecondary} muted={theme.textMuted} />
                  {record.translation_notes && <Detail label="Translation / edition" value={record.translation_notes} color={theme.textSecondary} muted={theme.textMuted} />}
                  <Detail label="Reading notes" value={record.interpretive_cautions.join(' • ')} color={theme.textSecondary} muted={theme.textMuted} />
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Related reflection themes</Text>
                    <View style={styles.relatedLinksRow}>
                      {record.related_inner_compass_categories.map((id) => (
                        <Pressable
                          key={id}
                          disabled={!onSelectCategoryId}
                          onPress={() => onSelectCategoryId?.(id)}
                          accessibilityLabel={`Open reflection theme ${getCategoryById(id)?.category_name || ''}`}
                          style={[styles.relatedLink, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                        >
                          <Text style={[styles.relatedLinkText, { color: theme.accentPrimary }]}>
                            {getCategoryById(id)?.category_name || 'Related reflection'}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                  {record.related_wisdom_record_ids.length > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Related wisdom</Text>
                      <View style={styles.relatedLinksRow}>
                        {record.related_wisdom_record_ids.map((id) => {
                          const wisdomEntry = WISDOM_LIBRARY_RECORDS.find((item) => item.record_id === id);
                          const label = wisdomEntry?.work || 'Related wisdom';
                          return (
                            <Pressable
                              key={id}
                              disabled={!onOpenWisdomRecord}
                              onPress={() => onOpenWisdomRecord?.(id)}
                              accessibilityLabel={`Open wisdom: ${label}`}
                              style={[styles.relatedLink, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
                            >
                              <Text style={[styles.relatedLinkText, { color: theme.accentPrimary }]}>{label}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  )}
                  <Detail
                    label="Availability"
                    value={record.public_domain_available || record.open_access_url ? 'Public-domain or open-access option available' : 'Check publisher or library availability'}
                    color={theme.textSecondary}
                    muted={theme.textMuted}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {filtered.length > PAGE_SIZE && (
        <View style={styles.pagination}>
          <Pressable
            disabled={safePage === 1}
            onPress={() => setPage((value) => Math.max(1, value - 1))}
            accessibilityLabel="Previous page of suggested reads"
            style={[styles.pageButton, { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: safePage === 1 ? 0.45 : 1 }]}
          >
            <Text style={[styles.pageButtonText, { color: theme.textPrimary }]}>← Previous</Text>
          </Pressable>

          <View style={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((number) => number === 1 || number === totalPages || Math.abs(number - safePage) <= 1)
              .map((number, index, visible) => (
                <React.Fragment key={number}>
                  {index > 0 && number - visible[index - 1] > 1 && (
                    <Text style={[styles.pageEllipsis, { color: theme.textMuted }]}>…</Text>
                  )}
                  <Pressable
                    onPress={() => setPage(number)}
                    accessibilityLabel={`Page ${number} of suggested reads`}
                    accessibilityState={{ selected: safePage === number }}
                    style={[styles.pageNumber, { backgroundColor: safePage === number ? theme.accentPrimary : theme.card, borderColor: safePage === number ? theme.accentPrimary : theme.cardBorder }]}
                  >
                    <Text style={{ color: safePage === number ? theme.accentText : theme.textPrimary, fontWeight: '800', fontSize: 11 }}>{number}</Text>
                  </Pressable>
                </React.Fragment>
              ))}
          </View>

          <Pressable
            disabled={safePage === totalPages}
            onPress={() => setPage((value) => Math.min(totalPages, value + 1))}
            accessibilityLabel="Next page of suggested reads"
            style={[styles.pageButton, { backgroundColor: theme.card, borderColor: theme.cardBorder, opacity: safePage === totalPages ? 0.45 : 1 }]}
          >
            <Text style={[styles.pageButtonText, { color: theme.textPrimary }]}>Next →</Text>
          </Pressable>
        </View>
      )}
      <Text style={[styles.pageSummary, { color: theme.textMuted }]}>
        {filtered.length === 0 ? 'No matching reads' : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
      </Text>
    </ScrollView>
  );
};

const Detail = ({ label, value, color, muted }: { label: string; value: string; color: string; muted: string }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, { color: muted }]}>{label}</Text>
    <Text style={[styles.detailValue, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 70, maxWidth: 1050, width: '100%', alignSelf: 'center' },
  hero: { alignItems: 'center', marginBottom: 18, paddingTop: 8 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { fontSize: 30, fontWeight: '700', fontFamily: 'serif', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 21, maxWidth: 700, textAlign: 'center' },
  linkContext: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  linkContextText: { fontSize: 11, fontWeight: '600', flex: 1 },
  clearLink: { fontSize: 11, fontWeight: '800' },
  discoveryPanel: { borderWidth: 1, borderRadius: 17, padding: 16, marginBottom: 14 },
  discoveryTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  discoveryHint: { fontSize: 12, lineHeight: 18, marginBottom: 10 },
  discoveryActions: { flexDirection: 'row', gap: 18, marginTop: 8 },
  advancedFilters: { borderTopWidth: 1, marginTop: 12, paddingTop: 8 },
  schoolChip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  dropdownWrap: { position: 'relative', zIndex: 20, marginBottom: 8 },
  dropdownButton: { minHeight: 44, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  dropdownValue: { flex: 1, fontSize: 13, fontWeight: '700' },
  dropdownChevron: { fontSize: 10, fontWeight: '800' },
  dropdownMenu: { borderWidth: 1, borderRadius: 12, marginTop: 5, maxHeight: 290, overflow: 'auto' as any, ...Platform.select({ web: { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } as any, default: {} }) },
  dropdownOption: { paddingHorizontal: 13, paddingVertical: 11 },
  dropdownOptionText: { fontSize: 12, fontWeight: '700' },
  pathways: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingVertical: 4, marginBottom: 12 },
  pathwayCard: { width: 220, maxWidth: '100%', minHeight: 92, borderWidth: 1, borderRadius: 15, padding: 13 },
  pathwayTitle: { fontSize: 13, fontWeight: '800', marginBottom: 5 },
  pathwayDesc: { fontSize: 11, lineHeight: 16 },
  search: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 8 },
  filterLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 8, marginBottom: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, paddingVertical: 4 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 6 },
  count: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignItems: 'flex-start' },
  pagination: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 22 },
  pageNumbers: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pageButton: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  pageButtonText: { fontSize: 11, fontWeight: '800' },
  pageNumber: { minWidth: 34, borderWidth: 1, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 8, alignItems: 'center' },
  pageEllipsis: { fontSize: 13, paddingHorizontal: 2 },
  pageSummary: { fontSize: 10, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  card: { width: 500, maxWidth: '100%', borderWidth: 1, borderRadius: 17, padding: 15 },
  cardLead: { flexDirection: 'row', gap: 15 },
  cover: { width: 118, height: 168, borderRadius: 10 },
  fallbackCover: { borderWidth: 1, padding: 10, justifyContent: 'space-between', overflow: 'hidden' },
  coverMark: { fontSize: 35, fontWeight: '700', textAlign: 'center', marginTop: 10 },
  coverTitle: { fontSize: 13, fontWeight: '800', lineHeight: 17, textAlign: 'center' },
  coverAuthor: { fontSize: 9, lineHeight: 12, textAlign: 'center' },
  cardInfo: { flex: 1, minWidth: 0 },
  badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 7 },
  miniBadge: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  miniBadgeText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.4 },
  bookTitle: { fontSize: 19, fontWeight: '800', lineHeight: 23 },
  author: { fontSize: 12, marginTop: 3 },
  tradition: { fontSize: 11, fontWeight: '800', marginTop: 4 },
  why: { fontSize: 13, lineHeight: 19, marginTop: 9 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 12 },
  actionText: { fontSize: 11, fontWeight: '800' },
  detail: { borderTopWidth: 1, marginTop: 14, paddingTop: 12, gap: 10 },
  detailRow: { gap: 3 },
  detailLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '800' },
  detailValue: { fontSize: 12, lineHeight: 18 },
  relatedLinksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  relatedLink: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 },
  relatedLinkText: { fontSize: 10, fontWeight: '800' },
});
