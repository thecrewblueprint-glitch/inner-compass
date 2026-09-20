import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Category, ExistentialRoot } from '../types';
import { useTheme } from '../theme';
import { DailyAffirmationWidget } from '../components/DailyAffirmationWidget';

interface HomeScreenProps {
  onSubmit: (problemText: string, preferredRoot?: ExistentialRoot | null) => void;
  onSelectDailyCategory?: (category: Category) => void;
  isLoading: boolean;
  clarificationPrompt?: string | null;
  dailyInteractionTimestamp?: number;
  onOpenLegal?: () => void;
  onOpenCrisis?: () => void;
}

const SAMPLE_SCENARIOS = [
  {
    title: 'Loneliness in crowd',
    text: 'I feel deeply lonely and disconnected even when surrounded by friends and coworkers.',
    root: 'Isolation' as ExistentialRoot,
  },
  {
    title: 'Fear of failing',
    text: 'I am terrified of failing on this upcoming project and looking incompetent in front of peers.',
    root: 'Freedom' as ExistentialRoot,
  },
  {
    title: 'Cannot let go of anger',
    text: 'I keep replaying arguments and boiling with resentment toward someone who mistreated me.',
    root: 'Freedom' as ExistentialRoot,
  },
  {
    title: 'Existential void',
    text: 'Everything feels pointless lately. I am going through the motions without any real meaning.',
    root: 'Meaninglessness' as ExistentialRoot,
  },
];

const ROOTS: { key: ExistentialRoot; label: string; desc: string }[] = [
  { key: 'Isolation', label: 'Isolation', desc: 'Existential solitude & connection' },
  { key: 'Freedom', label: 'Freedom', desc: 'Responsibility, choice & agency' },
  { key: 'Death', label: 'Death', desc: 'Impermanence & boundary of life' },
  { key: 'Meaninglessness', label: 'Meaning', desc: 'Purpose & sense-making' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSubmit,
  onSelectDailyCategory,
  isLoading,
  clarificationPrompt,
  dailyInteractionTimestamp,
  onOpenLegal,
  onOpenCrisis,
}) => {
  const { theme } = useTheme();
  const [problemInput, setProblemInput] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<ExistentialRoot | null>(null);

  const handleSubmit = () => {
    if (!problemInput.trim() || isLoading) return;
    onSubmit(problemInput.trim(), selectedRoot);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
          <Text style={[styles.badgeText, { color: theme.badgeText }]}>RESEARCH-INFORMED REFLECTION TAXONOMY V1.0</Text>
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>What is weighing on your heart?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Share an honest reflection. Your input is matched deterministically to 25 research-informed reflection categories grounded in philosophy, depth-psychology traditions, and evidence-informed psychological methods.
        </Text>
      </View>

      <DailyAffirmationWidget
        onSelectCategory={onSelectDailyCategory}
        onUseAsPrompt={(promptText) => {
          setProblemInput(promptText);
          setSelectedRoot(null);
        }}
        lastInteractionTimestamp={dailyInteractionTimestamp}
      />

      {/* Main Input Box */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
            shadowColor: theme.cardShadow,
          },
        ]}
      >
        <Text style={[styles.inputLabel, { color: theme.textMuted }]}>YOUR INNER DILEMMA</Text>

        {clarificationPrompt && (
          <View
            style={[
              styles.clarificationCard,
              { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
            ]}
          >
            <Text style={[styles.clarificationLabel, { color: theme.accentPrimary }]}>
              ONE DETAIL WOULD HELP
            </Text>
            <Text style={[styles.clarificationQuestion, { color: theme.textPrimary }]}>
              {clarificationPrompt}
            </Text>
            <Text style={[styles.clarificationHint, { color: theme.textSecondary }]}>
              Add a sentence answering that question to your reflection, then submit again.
            </Text>
          </View>
        )}

        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
              color: theme.textPrimary,
            },
          ]}
          multiline
          numberOfLines={4}
          value={problemInput}
          onChangeText={setProblemInput}
          placeholder="e.g., I've been feeling so overwhelmed with demands and terrified of making the wrong choice..."
          placeholderTextColor={theme.textMuted}
          editable={!isLoading}
          accessibilityLabel="Problem Input"
          {...({ 'data-testid': 'problem-input' } as any)}
        />

        {/* Existential Root Filter */}
        <View style={styles.rootsSection}>
          <Text style={[styles.rootsLabel, { color: theme.textMuted }]}>
            OPTIONAL EXISTENTIAL ROOT FOCUS (YALOM'S ULTIMATE CONCERNS)
          </Text>
          <View style={styles.rootsRow}>
            {ROOTS.map((root) => {
              const isSelected = selectedRoot === root.key;
              return (
                <Pressable
                  key={root.key}
                  style={({ pressed }) => [
                    styles.rootChip,
                    {
                      backgroundColor: isSelected ? theme.accentPrimary : theme.inputBg,
                      borderColor: isSelected ? theme.accentPrimary : theme.inputBorder,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => setSelectedRoot(isSelected ? null : root.key)}
                  accessibilityLabel={`Root filter ${root.label}`}
                  {...({ 'data-testid': `root-filter-${root.key.toLowerCase()}` } as any)}
                >
                  <Text
                    style={[
                      styles.rootChipText,
                      { color: isSelected ? theme.accentText : theme.textSecondary },
                    ]}
                  >
                    {root.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: theme.accentPrimary },
            (!problemInput.trim() || isLoading) && {
              backgroundColor: theme.inputBorder,
              shadowOpacity: 0,
            },
            pressed && problemInput.trim() && !isLoading && { opacity: 0.85 },
          ]}
          onPress={handleSubmit}
          disabled={!problemInput.trim() || isLoading}
          accessibilityLabel="Submit Reflection"
          {...({ 'data-testid': 'submit-guidance-button' } as any)}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.accentText} size="small" />
          ) : (
            <Text style={[styles.submitButtonText, { color: theme.accentText }]}>Receive Grounded Guidance</Text>
          )}
        </Pressable>
      </View>

      {/* Sample Scenarios */}
      <View style={styles.scenariosSection}>
        <Text style={[styles.scenariosHeader, { color: theme.textMuted }]}>SAMPLE CONTEMPLATIVE DILEMMAS</Text>
        <View style={styles.scenariosGrid}>
          {SAMPLE_SCENARIOS.map((scenario, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [
                styles.scenarioCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                  shadowColor: theme.cardShadow,
                },
                pressed && { opacity: 0.85 },
              ]}
              onPress={() => {
                setProblemInput(scenario.text);
                setSelectedRoot(scenario.root);
              }}
            >
              <Text style={[styles.scenarioTitle, { color: theme.textPrimary }]}>{scenario.title}</Text>
              <Text style={[styles.scenarioText, { color: theme.textSecondary }]} numberOfLines={2}>
                "{scenario.text}"
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Persistent release / safety notice */}
      <View style={[styles.privacyNote, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
        <Text style={[styles.privacyNoteText, { color: theme.textMuted }]}>
          18+ · United States · English only. Inner Compass is a general-wellness reflection tool, not therapy, diagnosis, medical care, or emergency response. Raw reflection text is processed locally and is not intentionally persisted.
        </Text>
        <View style={styles.noticeLinks}>
          {onOpenLegal && (
            <Pressable accessibilityRole="link" accessibilityLabel="Open legal and safety notices" onPress={onOpenLegal}>
              <Text style={[styles.noticeLink, { color: theme.accentPrimary }]}>Legal & Safety</Text>
            </Pressable>
          )}
          {onOpenCrisis && (
            <Pressable accessibilityRole="link" accessibilityLabel="Open crisis lifelines" onPress={onOpenCrisis}>
              <Text style={[styles.noticeLink, { color: theme.crisisAccent }]}>Lifelines 24/7</Text>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 12,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'serif',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 580,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  clarificationCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  clarificationLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  clarificationQuestion: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  clarificationHint: {
    fontSize: 12,
    lineHeight: 18,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  rootsSection: {
    marginTop: 18,
    marginBottom: 18,
  },
  rootsLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  rootsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rootChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  rootChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scenariosSection: {
    marginBottom: 24,
  },
  scenariosHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 12,
  },
  scenariosGrid: {
    gap: 10,
  },
  scenarioCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  scenarioTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  scenarioText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  privacyNote: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  privacyNoteText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  noticeLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  noticeLink: {
    fontSize: 12,
    fontWeight: '800',
  },
});
