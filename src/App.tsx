import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { HomeScreen } from './screens/HomeScreen';
import { GuidanceScreen } from './screens/GuidanceScreen';
import { CrisisScreen } from './screens/CrisisScreen';
import { TaxonomyBrowserScreen } from './screens/TaxonomyBrowserScreen';
import { SavedJournalScreen } from './screens/SavedJournalScreen';
import { LegalScreen } from './screens/LegalScreen';
import { LaunchGate, LAUNCH_ATTESTATION_KEY } from './components/LaunchGate';
import { PracticeModalRN } from './components/PracticeModalRN';
import { ThemePickerModal } from './components/ThemePickerModal';
import { evaluateSafetyUpstream } from './safety/safetyRouter';
import { retrieveGroundedGuidance } from './retrieval/retrievalEngine';
import { validateGrounding } from './validation/groundingValidator';
import { Category, ExistentialRoot, GuidanceResult, KBEntry, SavedReflection } from './types';
import { ThemeProvider, useTheme, ThemeMode } from './theme';
import { recordCategoryInteraction } from './services/dailyAffirmationService';

const STORAGE_KEY = 'inner_compass_saved_reflections_v1';
const IS_PREVIEW_MODE = import.meta.env.VITE_INNER_COMPASS_PREVIEW === 'true';

const AppContent: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const isPreview = IS_PREVIEW_MODE;
  const [currentTab, setCurrentTab] = useState<'reflect' | 'taxonomy' | 'crisis' | 'journal' | 'legal'>('reflect');
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResult | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<{ reason?: string; safetyNotes?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clarificationPrompt, setClarificationPrompt] = useState<string | null>(null);
  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [dailyInteractionTimestamp, setDailyInteractionTimestamp] = useState(0);

  const [launchAccepted, setLaunchAccepted] = useState<boolean>(() => {
    try {
      if (typeof localStorage === 'undefined') return false;
      const raw = localStorage.getItem(LAUNCH_ATTESTATION_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed?.version === 1 && parsed?.adult === true && parsed?.us === true;
    } catch {
      return false;
    }
  });

  // Saved reflections (Rule 7: Never stores raw problem text)
  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Practice Modal state
  const [practiceModal, setPracticeModal] = useState<{
    visible: boolean;
    category: Category | null;
    entry: KBEntry | null;
  }>({
    visible: false,
    category: null,
    entry: null,
  });

  // Sync saved reflections to local storage
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReflections));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  }, [savedReflections]);

  const trackCategoryInteraction = (
    categoryId: number,
    source: 'reflection' | 'saved' | 'taxonomy_view' | 'sample'
  ) => {
    recordCategoryInteraction(categoryId, source);
    setDailyInteractionTimestamp(Date.now());
  };

  const handleSubmitProblem = async (problemText: string, preferredRoot?: ExistentialRoot | null) => {
    setIsLoading(true);
    setClarificationPrompt(null);

    try {
      // Privacy-by-design production path:
      // raw reflection text is processed only in this browser and is never sent
      // to a server, analytics product, or AI provider.
      const safety = evaluateSafetyUpstream(problemText);

      if (safety.blockedFromWisdomMatching || safety.status === 'SUBSTANCE_HARD_CEILING') {
        setCrisisAlert({
          reason: safety.reason,
          safetyNotes: safety.safetyNotes,
        });
        setCurrentTab('crisis');
        setGuidanceResult(null);
        return;
      }

      const retrieval = retrieveGroundedGuidance(
        problemText,
        preferredRoot,
        safety.suggestedCategoryId
      );

      if (retrieval.needsClarification) {
        setClarificationPrompt(
          retrieval.clarificationQuestion ||
            'Could you add one concrete detail about what feels most difficult right now?'
        );
        setGuidanceResult(null);
        setCrisisAlert(null);
        setCurrentTab('reflect');
        return;
      }

      const grounding = validateGrounding(null, retrieval.category);
      const localResult: GuidanceResult = {
        category: retrieval.category,
        safety,
        grounding,
        affirmation: retrieval.category.synthesis_note,
        synthesis: grounding.groundedSynthesis,
        isFallback: true,
      };

      setGuidanceResult(localResult);
      trackCategoryInteraction(retrieval.category.category_id, 'reflection');
      setCrisisAlert(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (
    category: Category,
    source: 'saved' | 'taxonomy_view' | 'sample'
  ) => {
    const safety = evaluateSafetyUpstream(category.category_name);
    const grounding = validateGrounding(null, category);
    const result: GuidanceResult = {
      category,
      safety,
      grounding,
      affirmation: category.synthesis_note,
      synthesis: category.synthesis_note,
      isFallback: true,
    };
    trackCategoryInteraction(category.category_id, source);
    setGuidanceResult(result);
    setCurrentTab('reflect');
  };

  const handleSaveReflection = (category: Category, affirmation: string) => {
    const isAlreadySaved = savedReflections.some((r) => r.categoryId === category.category_id);
    if (isAlreadySaved) {
      setSavedReflections((prev) => prev.filter((r) => r.categoryId !== category.category_id));
      return;
    }

    // Rule 7: Do NOT persist raw problem input text!
    const newRef: SavedReflection = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      problemInput: `[REDACTED_PRIVACY_RULE_7]`,
      categoryId: category.category_id,
      categoryName: category.category_name,
      synthesisNote: category.synthesis_note,
      affirmation,
    };

    setSavedReflections((prev) => [newRef, ...prev]);
    trackCategoryInteraction(category.category_id, 'saved');
  };

  const isCurrentCategorySaved = Boolean(
    guidanceResult &&
    savedReflections.some((r) => r.categoryId === guidanceResult.category.category_id)
  );

  if (!launchAccepted) {
    return <LaunchGate onAccepted={() => setLaunchAccepted(true)} />;
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.canvas }]}>
      <StatusBar barStyle={theme.variant === 'dark' ? 'light-content' : 'dark-content'} />

      {/* App Navigation Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.topBar, borderBottomColor: theme.topBarBorder }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoCircle, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={styles.logoIcon}>🧭</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>INNER COMPASS</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textMuted }]}>Guided Reflection & Sourced Wisdom</Text>
          </View>
        </View>

        {/* Right side: Palette Trigger & Tabs */}
        <View style={styles.navRightSection}>
          {/* Theme Palette Popup Trigger */}
          <Pressable
            style={({ pressed }) => [
              styles.themeMenuTrigger,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => setThemePickerVisible(true)}
            accessibilityLabel="Open Theme Palette Selector"
          >
            <View style={styles.themeTriggerContent}>
              <View style={[styles.themeTriggerSwatch, { backgroundColor: theme.accentPrimary }]}>
                <Text style={styles.themeTriggerEmoji}>{theme.icon}</Text>
              </View>
              <View style={styles.themeTriggerTextCol}>
                <Text style={[styles.themeTriggerName, { color: theme.textPrimary }]}>
                  {theme.name}
                </Text>
                <Text style={[styles.themeTriggerVariant, { color: theme.textMuted }]}>
                  {theme.variant === 'light' ? 'Light' : 'Dark'} ▾
                </Text>
              </View>
            </View>
          </Pressable>

          {/* Tab Switcher */}
          <View style={styles.tabsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                { backgroundColor: currentTab === 'reflect' ? theme.tabActiveBg : theme.tabInactiveBg },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setCurrentTab('reflect')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: currentTab === 'reflect' ? theme.tabActiveText : theme.tabInactiveText },
                ]}
              >
                Reflect
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                { backgroundColor: currentTab === 'taxonomy' ? theme.tabActiveBg : theme.tabInactiveBg },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setCurrentTab('taxonomy')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: currentTab === 'taxonomy' ? theme.tabActiveText : theme.tabInactiveText },
                ]}
              >
                Taxonomy
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                { backgroundColor: currentTab === 'journal' ? theme.tabActiveBg : theme.tabInactiveBg },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setCurrentTab('journal')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: currentTab === 'journal' ? theme.tabActiveText : theme.tabInactiveText },
                ]}
              >
                Journal {savedReflections.length > 0 ? `(${savedReflections.length})` : ''}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                { backgroundColor: currentTab === 'legal' ? theme.tabActiveBg : theme.tabInactiveBg },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setCurrentTab('legal')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: currentTab === 'legal' ? theme.tabActiveText : theme.tabInactiveText },
                ]}
              >
                About & Privacy
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.tabButton,
                {
                  backgroundColor: currentTab === 'crisis' ? theme.crisisAccent : theme.crisisBg,
                  borderWidth: 1,
                  borderColor: theme.crisisBorder,
                },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {
                setCrisisAlert(null);
                setCurrentTab('crisis');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: currentTab === 'crisis' ? '#FFFFFF' : theme.crisisText, fontWeight: '700' },
                ]}
              >
                Lifelines 24/7
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Visible Preview Mode Banner */}
      {isPreview && (
        <View style={[styles.previewBanner, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
          <View style={styles.previewContent}>
            <View style={styles.previewBadgeRow}>
              <View style={[styles.previewDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.previewBadgeText, { color: theme.accentPrimary }]}>
                PREVIEW MODE ACTIVE
              </Text>
              <View style={[styles.previewPill, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
                <Text style={[styles.previewPillText, { color: theme.textSecondary }]}>
                  VITE_INNER_COMPASS_PREVIEW=true
                </Text>
              </View>
            </View>
            <Text style={[styles.previewNoticeText, { color: theme.textSecondary }]}>
              Local deterministic reflection · Raw reflection text stays on this device · No runtime AI providers
            </Text>
          </View>
        </View>
      )}

      {/* Main Screen View */}
      <View style={styles.contentContainer}>
        {currentTab === 'reflect' && (
          guidanceResult ? (
            <GuidanceScreen
              result={guidanceResult}
              onBack={() => setGuidanceResult(null)}
              onOpenPractice={(cat, entry) =>
                setPracticeModal({ visible: true, category: cat, entry })
              }
              onSaveReflection={handleSaveReflection}
              isSaved={isCurrentCategorySaved}
              onOpenCrisis={() => setCurrentTab('crisis')}
            />
          ) : (
            <HomeScreen
              onSubmit={handleSubmitProblem}
              onSelectDailyCategory={(cat) => handleSelectCategory(cat, 'sample')}
              isLoading={isLoading}
              clarificationPrompt={clarificationPrompt}
              dailyInteractionTimestamp={dailyInteractionTimestamp}
            />
          )
        )}

        {currentTab === 'taxonomy' && (
          <TaxonomyBrowserScreen
            onSelectCategory={(cat) => {
              handleSelectCategory(cat, 'taxonomy_view');
            }}
          />
        )}

        {currentTab === 'journal' && (
          <SavedJournalScreen
            savedList={savedReflections}
            onSelectCategory={(cat) => {
              handleSelectCategory(cat, 'saved');
            }}
            onRemove={(id) => {
              setSavedReflections((prev) => prev.filter((r) => r.id !== id));
            }}
          />
        )}

        {currentTab === 'legal' && (
          <LegalScreen onResetLaunchGate={() => setLaunchAccepted(false)} />
        )}

        {currentTab === 'crisis' && (
          <CrisisScreen
            reason={crisisAlert?.reason}
            safetyNotes={crisisAlert?.safetyNotes}
            onDismiss={() => {
              setCrisisAlert(null);
              setCurrentTab('reflect');
            }}
          />
        )}
      </View>

      {/* Guided Practice Modal */}
      <PracticeModalRN
        visible={practiceModal.visible}
        category={practiceModal.category}
        entry={practiceModal.entry}
        onClose={() => setPracticeModal({ visible: false, category: null, entry: null })}
      />

      {/* Pop-up Color & Atmosphere Spectrum Picker */}
      <ThemePickerModal
        visible={themePickerVisible}
        onClose={() => setThemePickerVisible(false)}
      />
    </SafeAreaView>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  logoIcon: {
    fontSize: 19,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  navRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  themeMenuTrigger: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  themeTriggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeTriggerSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeTriggerEmoji: {
    fontSize: 12,
  },
  themeTriggerTextCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  themeTriggerName: {
    fontSize: 12,
    fontWeight: '700',
  },
  themeTriggerVariant: {
    fontSize: 10,
    fontWeight: '500',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tabButton: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  previewBanner: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  previewPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  previewPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  previewNoticeText: {
    fontSize: 11,
    fontWeight: '400',
  },
});

export default App;
