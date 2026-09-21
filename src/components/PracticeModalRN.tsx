import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Category, KBEntry } from '../types';
import { useTheme } from '../theme';

interface PracticeModalProps {
  visible: boolean;
  category: Category | null;
  entry: KBEntry | null;
  onClose: () => void;
}

export const PracticeModalRN: React.FC<PracticeModalProps> = ({
  visible,
  category,
  entry,
  onClose,
}) => {
  const { theme } = useTheme();
  const [reflectionNote, setReflectionNote] = useState('');
  const [completed, setCompleted] = useState(false);

  if (!visible || !category || !entry) {
    return null;
  }

  const handleFinish = () => {
    setCompleted(true);
    setTimeout(() => {
      setCompleted(false);
      setReflectionNote('');
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.badge, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Text style={[styles.badgeText, { color: theme.badgeText }]}>GUIDED CONTEMPLATIVE PRACTICE</Text>
              </View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{category.category_name}</Text>
              <Text style={[styles.authorLine, { color: theme.textSecondary }]}>
                Method: {entry.source_author} ({entry.tradition_or_school})
              </Text>
            </View>

            {/* Technique Box */}
            <View
              style={[
                styles.techniqueBox,
                {
                  backgroundColor: theme.practiceBg,
                  borderColor: theme.practiceBorder,
                },
              ]}
            >
              <Text style={[styles.techniqueLabel, { color: theme.accentPrimary }]}>TRY THIS APPROACH:</Text>
              <Text style={[styles.techniqueText, { color: theme.textPrimary }]}>
                {entry.practice_or_technique || entry.teaching}
              </Text>
            </View>

            {/* Step-by-Step Practice Guide */}
            <View style={styles.stepsSection}>
              <Text style={[styles.stepsHeader, { color: theme.textMuted }]}>GUIDED STEPS:</Text>

              <View style={styles.stepRow}>
                <View style={[styles.stepNumBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                  <Text style={[styles.stepNum, { color: theme.textPrimary }]}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Pause and Ground</Text>
                  <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                    Lower your gaze or close your eyes. Take three slow, unforced breaths. Release muscular tension in your jaw, shoulders, and belly.
                  </Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <View style={[styles.stepNumBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                  <Text style={[styles.stepNum, { color: theme.textPrimary }]}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Touch the Material With Friendliness</Text>
                  <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                    Instead of fighting the painful feeling, acknowledge its presence. Hold this perspective from {entry.source_author}: notice what it feels like in the body right now.
                  </Text>
                </View>
              </View>

              <View style={styles.stepRow}>
                <View style={[styles.stepNumBox, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                  <Text style={[styles.stepNum, { color: theme.textPrimary }]}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Integration & Next Action</Text>
                  <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                    Ask yourself: What is one small, wholesome action aligned with your deeper values that is available to you today?
                  </Text>
                </View>
              </View>
            </View>

            {/* In-Memory Reflection Scratchpad */}
            <View style={styles.scratchpadSection}>
              <Text style={[styles.scratchpadLabel, { color: theme.textMuted }]}>
                TEMPORARY SESSION NOTES (CLEARED UPON EXIT):
              </Text>
              <TextInput
                style={[
                  styles.scratchpadInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    color: theme.textPrimary,
                  },
                ]}
                multiline
                numberOfLines={3}
                placeholder="Notice what shifted in your awareness or body..."
                placeholderTextColor={theme.textMuted}
                value={reflectionNote}
                onChangeText={setReflectionNote}
              />
              <Text style={[styles.privacyScratchpadText, { color: theme.textMuted }]}>
                Rule 7 Privacy: Scratchpad notes exist only during this active dialog and are never sent to external servers or logged.
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Close</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.finishButton,
                  { backgroundColor: theme.accentPrimary },
                  completed && { backgroundColor: theme.accentHover },
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleFinish}
              >
                <Text style={[styles.finishButtonText, { color: theme.accentText }]}>
                  {completed ? '✓ Practice Complete' : 'Complete Practice Session'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 26, 23, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    borderRadius: 18,
    maxWidth: 580,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'serif',
    letterSpacing: -0.2,
  },
  authorLine: {
    fontSize: 13,
    marginTop: 3,
  },
  techniqueBox: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
  },
  techniqueLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  techniqueText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  stepsSection: {
    gap: 14,
    marginBottom: 18,
  },
  stepsHeader: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  scratchpadSection: {
    marginBottom: 18,
  },
  scratchpadLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  scratchpadInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
    lineHeight: 19,
  },
  privacyScratchpadText: {
    fontSize: 10,
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  finishButton: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  finishButtonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
