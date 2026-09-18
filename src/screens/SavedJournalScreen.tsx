import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Category, SavedReflection } from '../types';
import { getCategoryById } from '../knowledgeBase/kbLoader';
import { useTheme } from '../theme';

interface SavedJournalScreenProps {
  savedList: SavedReflection[];
  onSelectCategory: (category: Category) => void;
  onRemove: (id: string) => void;
}

export const SavedJournalScreen: React.FC<SavedJournalScreenProps> = ({
  savedList,
  onSelectCategory,
  onRemove,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>PRIVATE CONTEMPLATIVE JOURNAL</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Bookmarked Wisdom & Affirmations</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Review your grounded philosophical reflections and affirmations. Stored safely in local session storage without raw problem text.
        </Text>
      </View>

      {savedList.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Bookmarked Reflections Yet</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
            When you explore guidance on any dilemma or category, tap "Bookmark Reflection" to save its synthesis and daily affirmation here.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {savedList.map((item) => {
            const cat = getCategoryById(item.categoryId);
            const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                    shadowColor: theme.cardShadow,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.catIdBadge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                    <Text style={[styles.catIdText, { color: theme.badgeText }]}>CATEGORY #{item.categoryId}</Text>
                  </View>
                  <Text style={[styles.dateText, { color: theme.textMuted }]}>{dateStr}</Text>
                </View>

                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{item.categoryName}</Text>

                {item.affirmation && (
                  <View
                    style={[
                      styles.affirmationBox,
                      {
                        backgroundColor: theme.affirmationBg,
                        borderColor: theme.affirmationBorder,
                        borderLeftColor: theme.affirmationLabel,
                      },
                    ]}
                  >
                    <Text style={[styles.affirmationText, { color: theme.affirmationText }]}>"{item.affirmation}"</Text>
                  </View>
                )}

                <Text style={[styles.synthesisText, { color: theme.textSecondary }]} numberOfLines={3}>
                  "{item.synthesisNote}"
                </Text>

                <View style={[styles.cardActions, { borderTopColor: theme.cardBorder }]}>
                  {cat && (
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => onSelectCategory(cat)}
                    >
                      <Text style={[styles.viewButtonText, { color: theme.accentPrimary }]}>View Sourced Teachings →</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => onRemove(item.id)}
                  >
                    <Text style={[styles.removeButtonText, { color: theme.textMuted }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 36,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 440,
  },
  list: {
    gap: 14,
  },
  card: {
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
    marginBottom: 8,
  },
  catIdBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catIdText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 11,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  affirmationBox: {
    borderLeftWidth: 3,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  affirmationText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  synthesisText: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  viewButton: {
    paddingVertical: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  removeButton: {
    paddingVertical: 4,
  },
  removeButtonText: {
    fontSize: 11,
  },
});
