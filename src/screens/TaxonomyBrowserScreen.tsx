import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { getAllCategories } from '../knowledgeBase/kbLoader';
import { Category, ExistentialRoot } from '../types';
import { useTheme } from '../theme';

interface TaxonomyBrowserScreenProps {
  onSelectCategory: (category: Category) => void;
}

const ROOTS_FILTER: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All 25 Categories' },
  { key: 'Death', label: 'Death (Impermanence)' },
  { key: 'Freedom', label: 'Freedom (Agency)' },
  { key: 'Isolation', label: 'Isolation (Aloneness)' },
  { key: 'Meaninglessness', label: 'Meaninglessness (Purpose)' },
];

export const TaxonomyBrowserScreen: React.FC<TaxonomyBrowserScreenProps> = ({
  onSelectCategory,
}) => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [expandedCatId, setExpandedCatId] = useState<number | null>(null);

  const categories = getAllCategories();

  const filteredCategories = categories.filter((cat) => {
    if (selectedFilter === 'ALL') return true;
    return cat.existential_roots.includes(selectedFilter as ExistentialRoot);
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>CANONICAL TAXONOMY V1.0</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>The 25 Clinical Wisdom Categories</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Systematic mapping of human existential dilemmas across Eastern Philosophy, Jungian Shadow Work, and Evidence-Based Psychology.
        </Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {ROOTS_FILTER.map((rf) => {
          const isSelected = selectedFilter === rf.key;
          return (
            <TouchableOpacity
              key={rf.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? theme.accentPrimary : theme.card,
                  borderColor: isSelected ? theme.accentPrimary : theme.cardBorder,
                },
              ]}
              onPress={() => setSelectedFilter(rf.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isSelected ? theme.accentText : theme.textSecondary },
                ]}
              >
                {rf.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Categories List */}
      <View style={styles.categoriesList}>
        {filteredCategories.map((cat) => {
          const isExpanded = expandedCatId === cat.category_id;
          const isHardCeiling = cat.category_id === 10;
          const isEscalation = cat.category_id === 21 || cat.category_id === 24;

          return (
            <View
              key={cat.category_id}
              style={[
                styles.catCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                  shadowColor: theme.cardShadow,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpandedCatId(isExpanded ? null : cat.category_id)}
              >
                <View style={styles.catHeaderLeft}>
                  <View style={[styles.catNumberBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                    <Text style={[styles.catNumberText, { color: theme.textPrimary }]}>{cat.category_id}</Text>
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={[styles.catName, { color: theme.textPrimary }]}>{cat.category_name}</Text>
                    <View style={styles.rootsRow}>
                      {cat.existential_roots.map((r) => (
                        <Text key={r} style={[styles.rootTag, { color: theme.textMuted }]}>
                          {r}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.catHeaderRight}>
                  {isHardCeiling && (
                    <View style={[styles.hardCeilingTag, { backgroundColor: theme.crisisBg, borderColor: theme.crisisBorder }]}>
                      <Text style={[styles.hardCeilingTagText, { color: theme.crisisText }]}>HARD CEILING</Text>
                    </View>
                  )}
                  {isEscalation && (
                    <View style={[styles.escalationTag, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                      <Text style={[styles.escalationTagText, { color: theme.affirmationLabel }]}>ESCALATION CANDIDATE</Text>
                    </View>
                  )}
                  <Text style={[styles.expandIcon, { color: theme.textMuted }]}>{isExpanded ? '▲' : '▼'}</Text>
                </View>
              </TouchableOpacity>

              {/* Expanded Details */}
              {isExpanded && (
                <View style={[styles.cardBody, { borderTopColor: theme.cardBorder }]}>
                  {/* Synthesis Note */}
                  <View style={[styles.synthesisBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                    <Text style={[styles.synthesisLabel, { color: theme.textMuted }]}>SYNTHESIS NOTE:</Text>
                    <Text style={[styles.synthesisText, { color: theme.textPrimary }]}>"{cat.synthesis_note}"</Text>
                  </View>

                  {/* Safety Notes if any */}
                  {cat.safety_notes.length > 0 && (
                    <View style={[styles.safetyBox, { backgroundColor: theme.crisisBg, borderColor: theme.crisisBorder }]}>
                      <Text style={[styles.safetyLabel, { color: theme.crisisText }]}>SAFETY NOTES:</Text>
                      {cat.safety_notes.map((sn, idx) => (
                        <Text key={idx} style={[styles.safetyItem, { color: theme.crisisText }]}>
                          • {sn}
                        </Text>
                      ))}
                    </View>
                  )}

                  {/* 3 Pillars Summary */}
                  <View style={styles.pillarsSummary}>
                    <Text style={[styles.pillarsSummaryLabel, { color: theme.textMuted }]}>THE THREE PILLARS:</Text>
                    {cat.entries.map((e) => (
                      <View key={e.entry_id} style={styles.pillarSummaryItem}>
                        <Text style={[styles.pillarItemName, { color: theme.textPrimary }]}>
                          • <Text style={styles.boldText}>{e.source_author}</Text> ({e.tradition_or_school})
                        </Text>
                        <Text style={[styles.pillarItemWork, { color: theme.textMuted }]}>Text: {e.source_work}</Text>
                        <Text style={[styles.pillarItemTeaching, { color: theme.textSecondary }]} numberOfLines={2}>
                          {e.teaching}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Explore Guidance Button */}
                  <TouchableOpacity
                    style={[styles.exploreButton, { backgroundColor: theme.accentPrimary }]}
                    onPress={() => onSelectCategory(cat)}
                  >
                    <Text style={[styles.exploreButtonText, { color: theme.accentText }]}>Reflect on this Category →</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    fontFamily: 'serif',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 580,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 10,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesList: {
    gap: 12,
  },
  catCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  catHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  catNumberBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catNumberText: {
    fontSize: 13,
    fontWeight: '700',
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  rootsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  rootTag: {
    fontSize: 11,
  },
  catHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hardCeilingTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hardCeilingTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  escalationTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  escalationTagText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  expandIcon: {
    fontSize: 11,
    marginLeft: 4,
  },
  cardBody: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
  },
  synthesisBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  synthesisLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  synthesisText: {
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  safetyBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  safetyLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  safetyItem: {
    fontSize: 11,
    lineHeight: 16,
  },
  pillarsSummary: {
    gap: 10,
    marginBottom: 14,
  },
  pillarsSummaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  pillarSummaryItem: {
    paddingLeft: 6,
  },
  pillarItemName: {
    fontSize: 13,
  },
  boldText: {
    fontWeight: '700',
  },
  pillarItemWork: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  pillarItemTeaching: {
    fontSize: 12,
    lineHeight: 17,
  },
  exploreButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  exploreButtonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
