import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Category, PillarType } from '../types';
import { useTheme } from '../theme';
import {
  DailyAffirmationItem,
  getDailyAffirmationItem,
} from '../services/dailyAffirmationService';

interface DailyAffirmationWidgetProps {
  onSelectCategory?: (category: Category) => void;
  onUseAsPrompt?: (promptText: string) => void;
  lastInteractionTimestamp?: number;
}

const PILLAR_STYLES: Record<
  PillarType,
  { label: string; lightBg: string; lightColor: string; lightBorder: string; darkBg: string; darkColor: string; darkBorder: string }
> = {
  eastern_philosophy: {
    label: 'EASTERN PHILOSOPHY',
    lightBg: '#FEF3C7',
    lightColor: '#B45309',
    lightBorder: '#FCD34D',
    darkBg: '#3B290C',
    darkColor: '#FCD34D',
    darkBorder: '#614412',
  },
  shadow_work: {
    label: 'JUNGIAN SHADOW WORK',
    lightBg: '#F3E8FF',
    lightColor: '#7C3AED',
    lightBorder: '#D8B4FE',
    darkBg: '#321657',
    darkColor: '#D8B4FE',
    darkBorder: '#5624A2',
  },
  psychology_methodology: {
    label: 'PSYCHOLOGY METHODOLOGY',
    lightBg: '#CCFBF1',
    lightColor: '#0D9488',
    lightBorder: '#5EEAD4',
    darkBg: '#0D383D',
    darkColor: '#5EEAD4',
    darkBorder: '#1A616A',
  },
};

export const DailyAffirmationWidget: React.FC<DailyAffirmationWidgetProps> = ({
  onSelectCategory,
  onUseAsPrompt,
  lastInteractionTimestamp,
}) => {
  const { theme } = useTheme();
  const [shuffleOffset, setShuffleOffset] = useState(0);
  const [item, setItem] = useState<DailyAffirmationItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load affirmation item whenever shuffleOffset or lastInteractionTimestamp changes
  useEffect(() => {
    const currentItem = getDailyAffirmationItem(shuffleOffset);
    setItem(currentItem);
  }, [shuffleOffset, lastInteractionTimestamp]);

  if (!item) return null;

  const isDark = theme.variant === 'dark';
  const pillarMeta = PILLAR_STYLES[item.pillar] || {
    label: item.pillarLabel.toUpperCase(),
    lightBg: theme.badgeBg,
    lightColor: theme.badgeText,
    lightBorder: theme.badgeBorder,
    darkBg: theme.badgeBg,
    darkColor: theme.badgeText,
    darkBorder: theme.badgeBorder,
  };

  const pillarBg = isDark ? pillarMeta.darkBg : pillarMeta.lightBg;
  const pillarColor = isDark ? pillarMeta.darkColor : pillarMeta.lightColor;
  const pillarBorder = isDark ? pillarMeta.darkBorder : pillarMeta.lightBorder;

  // Format today's date
  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleShuffle = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setShuffleOffset((prev) => prev + 1);
      setIsRefreshing(false);
    }, 120);
  };

  const handleCopy = () => {
    try {
      const sourceBlock = item.isVerifiedQuote
        ? `"${item.quoteText}"\n— ${item.author}, ${item.sourceWork}`
        : `Teaching summary (not a direct quote):\n${item.quoteText}\nSource context: ${item.author}, ${item.sourceWork}`;
      const textToCopy = `${sourceBlock}\n\nToday's Canonical Reflection:\n${item.dailyAffirmation}`;
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handlePromptClick = () => {
    if (onUseAsPrompt) {
      onUseAsPrompt(`Reflecting on ${item.category.category_name}: ${item.dailyAffirmation}`);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          shadowColor: theme.cardShadow,
          borderLeftColor: theme.accentPrimary,
        },
      ]}
      {...({ 'data-testid': 'daily-affirmation-widget' } as any)}
    >
      {/* Top Banner Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.dateBadge,
              { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
            ]}
          >
            <Text style={[styles.dateText, { color: theme.badgeText }]}>
              ☀️ {todayDateString.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.widgetHeading, { color: theme.textPrimary }]}>
            Daily Wisdom & Reflection
          </Text>
        </View>

        {/* Personalization Tag */}
        <View
          style={[
            styles.personalizationBadge,
            {
              backgroundColor: item.isPersonalized ? theme.badgeBg : theme.canvas,
              borderColor: item.isPersonalized ? theme.accentPrimary : theme.badgeBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.personalizationText,
              { color: item.isPersonalized ? theme.accentPrimary : theme.textMuted },
            ]}
          >
            {item.isPersonalized
              ? `✨ Personalized (${item.totalInteractedCategories} Theme${item.totalInteractedCategories > 1 ? 's' : ''})`
              : '🌱 Daily Contemplation'}
          </Text>
        </View>
      </View>

      {/* Category Indicator */}
      <View style={styles.categoryContextRow}>
        <Text style={[styles.categoryPrefix, { color: theme.textMuted }]}>
          {item.isPersonalized ? 'Drawn from your explored theme:' : 'Contemplative Theme:'}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.categoryNamePressable, pressed && { opacity: 0.8 }]}
          onPress={() => onSelectCategory && onSelectCategory(item.category)}
        >
          <Text style={[styles.categoryNameText, { color: theme.accentPrimary }]}>
            {item.category.category_name} →
          </Text>
        </Pressable>
      </View>

      {/* Quote Block */}
      <View
        style={[
          styles.quoteCard,
          {
            backgroundColor: theme.quoteBg,
            borderColor: theme.quoteBorder,
            borderLeftColor: theme.accentPrimary,
          },
        ]}
      >
        <View style={styles.quoteHeaderRow}>
          {/* Pillar Badge */}
          <View style={[styles.pillarPill, { backgroundColor: pillarBg, borderColor: pillarBorder }]}>
            <Text style={[styles.pillarPillText, { color: pillarColor }]}>{pillarMeta.label}</Text>
          </View>

          <View
            style={[
              styles.verifiedPill,
              { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
            ]}
          >
            <Text style={[styles.verifiedPillText, { color: theme.textSecondary }]}>
              {item.isVerifiedQuote ? '✓ Verified Source Quote' : 'Teaching Summary · Not a Direct Quote'}
            </Text>
          </View>
        </View>

        <Text style={[styles.quoteText, { color: theme.quoteText }]}>
          {item.isVerifiedQuote ? `"${item.quoteText}"` : item.quoteText}
        </Text>

        <View style={styles.attributionRow}>
          <Text style={[styles.authorName, { color: theme.textPrimary }]}>
            {item.isVerifiedQuote ? `— ${item.author}` : `Source context: ${item.author}`}
          </Text>
          <Text style={[styles.sourceWork, { color: theme.textSecondary }]}>
            {item.sourceWork}
          </Text>
          {item.tradition ? (
            <Text style={[styles.traditionText, { color: theme.textMuted }]}>
              ({item.tradition})
            </Text>
          ) : null}
        </View>
      </View>

      {/* Grounded Affirmation Callout */}
      <View
        style={[
          styles.affirmationBox,
          {
            backgroundColor: theme.affirmationBg,
            borderColor: theme.affirmationBorder,
            borderLeftColor: theme.accentPrimary,
          },
        ]}
      >
        <Text style={[styles.affirmationLabel, { color: theme.affirmationLabel }]}>
          TODAY'S CANONICAL REFLECTION
        </Text>
        <Text style={[styles.affirmationText, { color: theme.affirmationText }]}>
          {item.dailyAffirmation}
        </Text>
      </View>

      {/* Action Bar */}
      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              pressed && { opacity: 0.75 },
            ]}
            onPress={handleShuffle}
            disabled={isRefreshing}
            accessibilityLabel="Shuffle Affirmation"
            {...({ 'data-testid': 'shuffle-affirmation-button' } as any)}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={theme.textPrimary} />
            ) : (
              <Text style={[styles.actionButtonText, { color: theme.textPrimary }]}>
                🔄 New Contemplation
              </Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              copied && { borderColor: theme.accentPrimary, backgroundColor: theme.badgeBg },
              pressed && { opacity: 0.75 },
            ]}
            onPress={handleCopy}
            accessibilityLabel="Copy Affirmation"
          >
            <Text
              style={[
                styles.actionButtonText,
                { color: copied ? theme.accentPrimary : theme.textPrimary },
              ]}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionsRight}>
          {onUseAsPrompt && (
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                pressed && { opacity: 0.75 },
              ]}
              onPress={handlePromptClick}
              accessibilityLabel="Reflect on this daily guidance"
            >
              <Text style={[styles.actionButtonText, { color: theme.textSecondary }]}>
                ✍️ Reflect
              </Text>
            </Pressable>
          )}

          {onSelectCategory && (
            <Pressable
              style={({ pressed }) => [
                styles.primaryActionButton,
                { backgroundColor: theme.accentPrimary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => onSelectCategory(item.category)}
              accessibilityLabel="Deep Dive Guidance"
              {...({ 'data-testid': 'deep-dive-category-button' } as any)}
            >
              <Text style={[styles.primaryActionText, { color: theme.accentText }]}>
                Explore Guidance →
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  widgetHeading: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'serif',
    letterSpacing: -0.2,
  },
  personalizationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  personalizationText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  categoryContextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  categoryPrefix: {
    fontSize: 12,
  },
  categoryNamePressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryNameText: {
    fontSize: 12,
    fontWeight: '700',
  },
  quoteCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 16,
    marginBottom: 14,
  },
  quoteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  pillarPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  pillarPillText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  verifiedPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  verifiedPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 23,
    marginBottom: 12,
  },
  attributionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 6,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
  },
  sourceWork: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  traditionText: {
    fontSize: 11,
  },
  affirmationBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 16,
  },
  affirmationLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  affirmationText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  primaryActionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
