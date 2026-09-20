import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Category, GuidanceResult, KBEntry } from '../types';
import { useTheme } from '../theme';

interface GuidanceScreenProps {
  result: GuidanceResult;
  onBack: () => void;
  onOpenPractice: (category: Category, entry: KBEntry) => void;
  onSaveReflection: (category: Category, affirmation: string) => void;
  isSaved: boolean;
  onOpenCrisis: () => void;
  onOpenWisdom: (categoryId: number) => void;
  onOpenReads: (categoryId: number) => void;
}

const PILLAR_LABELS: Record<string, { title: string; color: string; bg: string; border: string; darkColor: string; darkBg: string; darkBorder: string }> = {
  eastern_philosophy: {
    title: 'PILLAR I: EASTERN PHILOSOPHY & METAPHYSICS',
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#FCD34D',
    darkColor: '#FCD34D',
    darkBg: '#3B290C',
    darkBorder: '#614412',
  },
  shadow_work: {
    title: 'PILLAR II: JUNGIAN DEPTH PSYCHOLOGY & SHADOW WORK',
    color: '#7C3AED',
    bg: '#F3E8FF',
    border: '#D8B4FE',
    darkColor: '#D8B4FE',
    darkBg: '#321657',
    darkBorder: '#5624A2',
  },
  psychology_methodology: {
    title: 'PILLAR III: EVIDENCE-BASED PSYCHOLOGY METHODOLOGY',
    color: '#0D9488',
    bg: '#CCFBF1',
    border: '#5EEAD4',
    darkColor: '#5EEAD4',
    darkBg: '#0D383D',
    darkBorder: '#1A616A',
  },
};

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  result,
  onBack,
  onOpenPractice,
  onSaveReflection,
  isSaved,
  onOpenCrisis,
  onOpenWisdom,
  onOpenReads,
}) => {
  const { theme } = useTheme();
  const { category, safety, affirmation, synthesis } = result;
  const isSubstanceHardCeiling = safety?.status === 'SUBSTANCE_HARD_CEILING' || category.category_id === 10;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar Navigation */}
      <View style={styles.navBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            pressed && { opacity: 0.8 },
          ]}
          onPress={onBack}
        >
          <Text style={[styles.backButtonText, { color: theme.textPrimary }]}>← Back to Input</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
            isSaved && { backgroundColor: theme.accentPrimary, borderColor: theme.accentPrimary },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => onSaveReflection(category, affirmation)}
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: isSaved ? theme.accentText : theme.textPrimary },
            ]}
          >
            {isSaved ? '✓ Saved in Journal' : 'Bookmark Reflection'}
          </Text>
        </Pressable>
      </View>

      {/* Category Header Card */}
      <View
        style={[
          styles.categoryCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
        {...({ 'data-testid': 'guidance-category-card' } as any)}
      >
        <View style={styles.categoryBadgeRow}>
          <View
            style={[styles.catIdBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
            {...({ 'data-testid': 'category-badge' } as any)}
          >
            <Text style={[styles.catIdBadgeText, { color: theme.badgeText }]}>REFLECTION THEME</Text>
          </View>
          <View style={styles.rootsContainer}>
            {category.existential_roots.map((root) => (
              <View
                key={root}
                style={[styles.rootBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
              >
                <Text style={[styles.rootBadgeText, { color: theme.textSecondary }]}>{root}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text
          style={[styles.categoryTitle, { color: theme.textPrimary }]}
          {...({ 'data-testid': 'guidance-category-title' } as any)}
        >
          {category.category_name}
        </Text>

        <View style={[styles.groundedTag, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.groundedTagText, { color: theme.textMuted }]}>RESEARCH-INFORMED REFLECTION</Text>
        </View>
      </View>

      {/* Category 10 Substance Hard Ceiling Banner */}
      {isSubstanceHardCeiling && (
        <View
          style={[
            styles.hardCeilingCard,
            { backgroundColor: theme.crisisBg, borderColor: theme.crisisBorder },
          ]}
          {...({ 'data-testid': 'substance-hard-ceiling-banner' } as any)}
        >
          <Text style={[styles.hardCeilingTitle, { color: theme.crisisText }]}>⚠️ IMPORTANT SAFETY NOTE</Text>
          <Text style={[styles.hardCeilingText, { color: theme.crisisText }]}>
            Some substance-related situations can require medical or crisis support. Reflection content is not a substitute for professional care or immediate human help.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.lifelinesLink, pressed && { opacity: 0.75 }]}
            onPress={onOpenCrisis}
          >
            <Text style={[styles.lifelinesLinkText, { color: theme.crisisAccent }]}>Connect with SAMHSA & Crisis Lifelines →</Text>
          </Pressable>
        </View>
      )}

      {/* Grounded Affirmation Card */}
      <View
        style={[
          styles.affirmationCard,
          {
            backgroundColor: theme.affirmationBg,
            borderColor: theme.affirmationBorder,
            borderLeftWidth: 4,
            borderLeftColor: theme.accentPrimary,
          },
        ]}
        {...({ 'data-testid': 'grounded-affirmation-card' } as any)}
      >
        <Text style={[styles.affirmationLabel, { color: theme.affirmationLabel }]}>REFLECTION</Text>
        <Text
          style={[styles.affirmationText, { color: theme.affirmationText }]}
          {...({ 'data-testid': 'grounded-affirmation-text' } as any)}
        >
          {affirmation}
        </Text>
      </View>

      {/* Grounded Synthesis Note */}
      <View
        style={[
          styles.synthesisCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
        {...({ 'data-testid': 'grounded-synthesis-card' } as any)}
      >
        <Text style={[styles.synthesisLabel, { color: theme.textMuted }]}>HOW THESE IDEAS CONNECT</Text>
        <Text
          style={[styles.synthesisText, { color: theme.textPrimary }]}
          {...({ 'data-testid': 'grounded-synthesis-text' } as any)}
        >
          {synthesis}
        </Text>
      </View>

      <View style={styles.relatedNav}>
        <Pressable
          onPress={() => onOpenWisdom(category.category_id)}
          accessibilityLabel={`Open wisdom for category ${category.category_id}`}
          style={[styles.relatedNavButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.relatedNavText, { color: theme.accentPrimary }]}>Browse Wisdom Library →</Text>
        </Pressable>
        <Pressable
          onPress={() => onOpenReads(category.category_id)}
          accessibilityLabel={`Open suggested reads for category ${category.category_id}`}
          style={[styles.relatedNavButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.relatedNavText, { color: theme.accentPrimary }]}>Suggested Reads →</Text>
        </Pressable>
      </View>

      {/* Three Pillars Breakdown */}
      <View style={styles.pillarsContainer}>
        <Text style={[styles.pillarsHeader, { color: theme.textMuted }]}>THREE PERSPECTIVES</Text>

        {category.entries.map((entry) => {
          const rawMeta = PILLAR_LABELS[entry.pillar];
          const isDark = theme.variant === 'dark';
          const meta = rawMeta
            ? {
                title: rawMeta.title,
                color: isDark ? rawMeta.darkColor : rawMeta.color,
                bg: isDark ? rawMeta.darkBg : rawMeta.bg,
                border: isDark ? rawMeta.darkBorder : rawMeta.border,
              }
            : {
                title: entry.pillar.toUpperCase(),
                color: theme.textPrimary,
                bg: theme.badgeBg,
                border: theme.badgeBorder,
              };

          return (
            <View
              key={entry.entry_id}
              style={[
                styles.pillarCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                      },
              ]}
            >
              {/* Pillar Header */}
              <View style={[styles.pillarBadge, { backgroundColor: meta.bg, borderColor: meta.border }]}>
                <Text style={[styles.pillarBadgeText, { color: meta.color }]}>{meta.title}</Text>
              </View>

              {/* Author and Work */}
              <View style={styles.authorRow}>
                <Text style={[styles.authorName, { color: theme.textPrimary }]}>{entry.source_author}</Text>
                <Text style={[styles.traditionText, { color: theme.textSecondary }]}>({entry.tradition_or_school})</Text>
              </View>
              <Text style={[styles.sourceWork, { color: theme.textMuted }]}>Text: {entry.source_work}</Text>

              {/* Product-display rights gate: direct quotation text remains disabled. */}
              {entry.verified_quote && (
                <View style={[styles.quoteBox, { backgroundColor: theme.quoteBg, borderColor: theme.quoteBorder }]}>
                  <Text style={[styles.quoteText, { color: theme.quoteText }]}>
                    Source passage identified. Teaching summaries and source details are available without reproducing the full passage here.
                  </Text>
                  <Text style={[styles.quoteAttribution, { color: theme.textMuted }]}>
                    Source: {entry.source_author} · {entry.source_work}
                  </Text>
                </View>
              )}

              {/* Teaching description */}
              <Text style={[styles.teachingLabel, { color: theme.textSecondary }]}>Teaching:</Text>
              <Text style={[styles.teachingText, { color: theme.textPrimary }]}>{entry.teaching}</Text>

              {/* Concrete Practice (if present) */}
              {entry.practice_or_technique && (
                <View
                  style={[
                    styles.practiceSection,
                    {
                      backgroundColor: theme.practiceBg,
                      borderColor: theme.practiceBorder,
                    },
                  ]}
                >
                  <Text style={[styles.practiceLabel, { color: theme.textSecondary }]}>Practice:</Text>
                  <Text style={[styles.practiceText, { color: theme.textPrimary }]}>{entry.practice_or_technique}</Text>

                  <Pressable
                    style={({ pressed }) => [
                      styles.practiceButton,
                      { backgroundColor: theme.accentPrimary },
                      pressed && { opacity: 0.85 },
                    ]}
                    onPress={() => onOpenPractice(category, entry)}
                  >
                    <Text style={[styles.practiceButtonText, { color: theme.accentText }]}>
                      Try This Practice →
                    </Text>
                  </Pressable>
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryCard: {
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    marginBottom: 18,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  catIdBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catIdBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rootsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  rootBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  rootBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'serif',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  groundedTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  groundedTagText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hardCeilingCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  hardCeilingTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  hardCeilingText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  lifelinesLink: {
    alignSelf: 'flex-start',
  },
  lifelinesLinkText: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  affirmationCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    marginBottom: 18,
  },
  affirmationLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
    fontFamily: 'serif',
  },
  synthesisCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  synthesisLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  synthesisText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  relatedNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  relatedNavButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  relatedNavText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pillarsContainer: {
    gap: 16,
  },
  pillarsHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  pillarCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  pillarBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  pillarBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 2,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  traditionText: {
    fontSize: 13,
  },
  sourceWork: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  quoteBox: {
    borderLeftWidth: 3,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  quoteLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quoteAttribution: {
    fontSize: 11,
    marginTop: 5,
    fontStyle: 'italic',
  },
  teachingLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  teachingText: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  practiceSection: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    marginTop: 4,
  },
  practiceLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  practiceText: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  practiceButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  practiceButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
