import React from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Category, GuidanceResult, WisdomPassage } from '../types';
import { useTheme } from '../theme';

interface GuidanceScreenProps {
  result: GuidanceResult;
  onBack: () => void;
  onSaveReflection: (category: Category, affirmation: string) => void;
  isSaved: boolean;
  onOpenCrisis: () => void;
  onOpenWisdom: (categoryId: number) => void;
  onOpenReads: (categoryId: number) => void;
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
      <Text style={[styles.passageText, { color: theme.textPrimary }]}>{passage.summary}</Text>
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

export const GuidanceScreen: React.FC<GuidanceScreenProps> = ({
  result,
  onBack,
  onSaveReflection,
  isSaved,
  onOpenCrisis,
  onOpenWisdom,
  onOpenReads,
}) => {
  const { theme } = useTheme();
  const { category, safety, affirmation, wisdom } = result;
  const isSubstanceHardCeiling =
    safety?.status === 'SUBSTANCE_HARD_CEILING' || category.category_id === 10;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navBar}>
        <Pressable
          style={[styles.navButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          onPress={onBack}
        >
          <Text style={[styles.navButtonText, { color: theme.textPrimary }]}>← Back to Input</Text>
        </Pressable>

        <Pressable
          style={[
            styles.navButton,
            {
              backgroundColor: isSaved ? theme.accentPrimary : theme.card,
              borderColor: isSaved ? theme.accentPrimary : theme.cardBorder,
            },
          ]}
          onPress={() => onSaveReflection(category, affirmation)}
        >
          <Text style={[styles.navButtonText, { color: isSaved ? theme.accentText : theme.textPrimary }]}>
            {isSaved ? '✓ Saved in Journal' : 'Bookmark Reflection'}
          </Text>
        </Pressable>
      </View>

      <View
        style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        {...({ 'data-testid': 'guidance-category-card' } as any)}
      >
        <View style={styles.categoryTop}>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>REFLECTION THEME</Text>
          </View>
          <View style={styles.roots}>
            {wisdom.existentialRoots.map((root) => (
              <View
                key={root}
                style={[styles.rootTag, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}
              >
                <Text style={[styles.rootTagText, { color: theme.textSecondary }]}>{root}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text
          style={[styles.categoryTitle, { color: theme.textPrimary }]}
          {...({ 'data-testid': 'guidance-category-title' } as any)}
        >
          {wisdom.categoryName}
        </Text>
        <Text style={[styles.categoryMeta, { color: theme.textMuted }]}>RESEARCH-INFORMED REFLECTION</Text>
      </View>

      {isSubstanceHardCeiling && (
        <View style={[styles.safetyCard, { backgroundColor: theme.crisisBg, borderColor: theme.crisisBorder }]}>
          <Text style={[styles.safetyTitle, { color: theme.crisisText }]}>IMPORTANT SAFETY NOTE</Text>
          <Text style={[styles.safetyText, { color: theme.crisisText }]}>
            Some substance-related situations can require medical or crisis support. Reflection content is not a substitute for professional care or immediate human help.
          </Text>
          <Pressable onPress={onOpenCrisis}>
            <Text style={[styles.safetyLink, { color: theme.crisisAccent }]}>Connect with support resources →</Text>
          </Pressable>
        </View>
      )}

      <View
        style={[
          styles.affirmationCard,
          { backgroundColor: theme.affirmationBg, borderColor: theme.affirmationBorder },
        ]}
        {...({ 'data-testid': 'grounded-affirmation-card' } as any)}
      >
        <Text style={[styles.sectionLabel, { color: theme.affirmationLabel }]}>POSITIVE AFFIRMATION</Text>
        <Text
          style={[styles.affirmationText, { color: theme.affirmationText }]}
          accessibilityLabel="Reflection affirmation"
          {...({ 'data-testid': 'grounded-affirmation-text' } as any)}
        >
          {wisdom.affirmation}
        </Text>
      </View>

      <View
        style={[styles.guidanceCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        {...({ 'data-testid': 'grounded-synthesis-card' } as any)}
      >
        <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>GUIDANCE</Text>
        <Text
          style={[styles.guidanceSummary, { color: theme.textPrimary }]}
          {...({ 'data-testid': 'grounded-synthesis-text' } as any)}
        >
          {wisdom.guidanceSummary}
        </Text>

        <View style={styles.guidancePoints}>
          {wisdom.guidancePoints.map((point) => (
            <View key={point.id} style={styles.guidancePoint}>
              <Text style={[styles.guidanceLens, { color: theme.accentPrimary }]}>{point.lens}</Text>
              <Text style={[styles.guidanceText, { color: theme.textSecondary }]}>{point.teaching}</Text>
              {point.practice && (
                <Text style={[styles.practiceText, { color: theme.textPrimary }]}>
                  Practice: {point.practice}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.passagesSection}>
        <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>PASSAGES & SOURCE NOTES</Text>
        {wisdom.passages.map((passage) => (
          <PassageCard key={passage.recordId} passage={passage} />
        ))}
      </View>

      <View style={styles.relatedNav}>
        <Pressable
          onPress={() => onOpenWisdom(category.category_id)}
          accessibilityLabel={`Open wisdom for category ${category.category_id}`}
          style={[styles.relatedNavButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.relatedNavText, { color: theme.accentPrimary }]}>Search Wisdom Archive →</Text>
        </Pressable>
        <Pressable
          onPress={() => onOpenReads(category.category_id)}
          accessibilityLabel={`Open suggested reads for category ${category.category_id}`}
          style={[styles.relatedNavButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        >
          <Text style={[styles.relatedNavText, { color: theme.accentPrimary }]}>Go deeper in Suggested Reads →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  navBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  navButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  navButtonText: { fontSize: 11, fontWeight: '800' },
  categoryCard: { borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 16 },
  categoryTop: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, marginBottom: 10 },
  badge: { borderWidth: 1, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  roots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rootTag: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4 },
  rootTagText: { fontSize: 10, fontWeight: '700' },
  categoryTitle: { fontSize: 25, lineHeight: 31, fontWeight: '700', fontFamily: 'serif', marginBottom: 8 },
  categoryMeta: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  safetyCard: { borderWidth: 1, borderRadius: 14, padding: 15, marginBottom: 16 },
  safetyTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5, marginBottom: 5 },
  safetyText: { fontSize: 13, lineHeight: 19, marginBottom: 8 },
  safetyLink: { fontSize: 12, fontWeight: '800' },
  affirmationCard: { borderWidth: 1, borderRadius: 16, padding: 20, marginBottom: 16 },
  sectionLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7, marginBottom: 7 },
  affirmationText: { fontSize: 18, lineHeight: 27, fontFamily: 'serif', fontStyle: 'italic' },
  guidanceCard: { borderWidth: 1, borderRadius: 16, padding: 18, marginBottom: 16 },
  guidanceSummary: { fontSize: 14, lineHeight: 22, fontWeight: '600' },
  guidancePoints: { gap: 12, marginTop: 14 },
  guidancePoint: { gap: 4 },
  guidanceLens: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.4 },
  guidanceText: { fontSize: 13, lineHeight: 20 },
  practiceText: { fontSize: 12, lineHeight: 19, fontStyle: 'italic' },
  passagesSection: { gap: 8, marginBottom: 18 },
  sectionHeading: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7, marginBottom: 2 },
  passageCard: { borderWidth: 1, borderRadius: 12, padding: 12 },
  passageLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.6, marginBottom: 5 },
  passageText: { fontSize: 13, lineHeight: 20 },
  passageSource: { fontSize: 10, lineHeight: 15, marginTop: 7, fontStyle: 'italic' },
  sourceLink: { fontSize: 11, fontWeight: '800', marginTop: 7 },
  relatedNav: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relatedNavButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  relatedNavText: { fontSize: 11, fontWeight: '800' },
});
