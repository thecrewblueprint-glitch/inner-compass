import React, { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HomeScreen } from './screens/HomeScreen';
import { GuidanceScreen } from './screens/GuidanceScreen';
import { CrisisScreen } from './screens/CrisisScreen';
import { TaxonomyBrowserScreen } from './screens/TaxonomyBrowserScreen';
import { SavedJournalScreen } from './screens/SavedJournalScreen';
import { WisdomLibraryScreen } from './screens/WisdomLibraryScreen';
import { SuggestedReadsScreen } from './screens/SuggestedReadsScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { PracticeModalRN } from './components/PracticeModalRN';
import { ThemePickerModal } from './components/ThemePickerModal';
import { evaluateSafetyUpstream } from './safety/safetyRouter';
import { retrieveGroundedGuidance } from './retrieval/retrievalEngine';
import { validateGrounding } from './validation/groundingValidator';
import { getCategoryById } from './knowledgeBase/kbLoader';
import { WISDOM_AFFIRMATIONS } from './data/wisdomLibrary';
import { Category, ExistentialRoot, GuidanceResult, KBEntry, SavedReflection } from './types';
import { ThemeProvider, useTheme } from './theme';
import { recordCategoryInteraction } from './services/dailyAffirmationService';

const STORAGE_KEY = 'inner_compass_saved_reflections_v1';
const INTERACTION_KEY = 'inner_compass_category_interactions_v1';
const PERSONALIZATION_KEY = 'inner_compass_personalization_enabled_v1';
const AGE_KEY = 'inner_compass_age_confirmed_v1';
const IS_PREVIEW_MODE = import.meta.env.VITE_INNER_COMPASS_PREVIEW === 'true';

type AppTab = 'reflect' | 'taxonomy' | 'wisdom' | 'reads' | 'journal' | 'privacy' | 'crisis';

const getCategoryAffirmation = (categoryId: number, fallback: string): string => {
  const candidate = WISDOM_AFFIRMATIONS.find(
    (item) =>
      item.category_id === categoryId &&
      ['CATEGORY_VERIFIED', 'APPROVED', 'SOURCE_LINKED'].includes(item.review_status)
  );
  return candidate?.text || fallback;
};

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [currentTab, setCurrentTab] = useState<AppTab>('reflect');
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResult | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<{ reason?: string; safetyNotes?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clarificationPrompt, setClarificationPrompt] = useState<string | null>(null);
  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [dailyInteractionTimestamp, setDailyInteractionTimestamp] = useState(0);
  const [wisdomLinkContext, setWisdomLinkContext] = useState<{ categoryId?: number; recordId?: string } | null>(null);
  const [readsLinkContext, setReadsLinkContext] = useState<{ categoryId?: number; wisdomRecordId?: string } | null>(null);

  const [ageConfirmed, setAgeConfirmed] = useState(() => {
    if (IS_PREVIEW_MODE) return true;
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem(AGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [personalizationEnabled, setPersonalizationEnabled] = useState(() => {
    try {
      return typeof localStorage === 'undefined' || localStorage.getItem(PERSONALIZATION_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const [savedReflections, setSavedReflections] = useState<SavedReflection[]>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      }
    } catch {
      // Fail closed to an empty local journal.
    }
    return [];
  });

  const [practiceModal, setPracticeModal] = useState<{
    visible: boolean;
    category: Category | null;
    entry: KBEntry | null;
  }>({ visible: false, category: null, entry: null });

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedReflections));
      }
    } catch {
      // Local storage is optional; never send this data elsewhere as fallback.
    }
  }, [savedReflections]);

  const trackCategoryInteraction = (
    categoryId: number,
    source: 'reflection' | 'saved' | 'taxonomy_view' | 'sample'
  ) => {
    if (!personalizationEnabled) return;
    recordCategoryInteraction(categoryId, source);
    setDailyInteractionTimestamp(Date.now());
  };

  const routeSafety = (reason?: string, safetyNotes?: string[]) => {
    setCrisisAlert({ reason, safetyNotes });
    setGuidanceResult(null);
    setClarificationPrompt(null);
    setCurrentTab('crisis');
  };

  const makeGuidance = (category: Category, safety: ReturnType<typeof evaluateSafetyUpstream>): GuidanceResult => {
    const grounding = validateGrounding(null, category);
    return {
      category,
      safety,
      grounding,
      affirmation: getCategoryAffirmation(category.category_id, category.synthesis_note),
      synthesis: category.synthesis_note,
      guidanceSource: 'canonical_deterministic',
    };
  };

  const handleSubmitProblem = async (
    problemText: string,
    preferredRoot?: ExistentialRoot | null
  ) => {
    setIsLoading(true);
    setClarificationPrompt(null);

    try {
      // Raw reflection text is processed only in this browser execution path.
      const safety = evaluateSafetyUpstream(problemText);

      if (safety.blockedFromWisdomMatching || safety.status === 'SUBSTANCE_HARD_CEILING') {
        routeSafety(safety.reason, safety.safetyNotes);
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

      const result = makeGuidance(retrieval.category, safety);
      setGuidanceResult(result);
      setCrisisAlert(null);
      setCurrentTab('reflect');
      trackCategoryInteraction(retrieval.category.category_id, 'reflection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (
    category: Category,
    source: 'saved' | 'taxonomy_view' | 'sample'
  ) => {
    // Direct navigation must obey the same hard ceiling as reflection routing.
    if (category.category_id === 10) {
      const safety = evaluateSafetyUpstream('substance use');
      routeSafety(
        safety.reason || 'Substance-use guidance has a hard safety ceiling.',
        safety.safetyNotes
      );
      return;
    }

    const safety = evaluateSafetyUpstream(category.category_name);
    if (safety.blockedFromWisdomMatching || safety.status === 'SUBSTANCE_HARD_CEILING') {
      routeSafety(safety.reason, safety.safetyNotes);
      return;
    }

    setGuidanceResult(makeGuidance(category, safety));
    setCrisisAlert(null);
    setCurrentTab('reflect');
    trackCategoryInteraction(category.category_id, source);
  };

  const handleSelectCategoryId = (categoryId: number) => {
    const category = getCategoryById(categoryId);
    if (category) handleSelectCategory(category, 'taxonomy_view');
  };

  const openWisdomForCategory = (categoryId: number) => {
    setWisdomLinkContext({ categoryId });
    setCurrentTab('wisdom');
  };

  const openWisdomRecord = (recordId: string) => {
    setWisdomLinkContext({ recordId });
    setCurrentTab('wisdom');
  };

  const openReadsForCategory = (categoryId: number) => {
    setReadsLinkContext({ categoryId });
    setCurrentTab('reads');
  };

  const openReadsForWisdomRecord = (recordId: string) => {
    setReadsLinkContext({ wisdomRecordId: recordId });
    setCurrentTab('reads');
  };

  const handleSaveReflection = (category: Category, affirmation: string) => {
    const isAlreadySaved = savedReflections.some((item) => item.categoryId === category.category_id);
    if (isAlreadySaved) {
      setSavedReflections((previous) =>
        previous.filter((item) => item.categoryId !== category.category_id)
      );
      return;
    }

    const newReflection: SavedReflection = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      problemInput: '[REDACTED_PRIVACY_RULE_7]',
      categoryId: category.category_id,
      categoryName: category.category_name,
      synthesisNote: category.synthesis_note,
      affirmation,
    };

    setSavedReflections((previous) => [newReflection, ...previous]);
    trackCategoryInteraction(category.category_id, 'saved');
  };

  const handleTogglePersonalization = () => {
    const next = !personalizationEnabled;
    setPersonalizationEnabled(next);
    try {
      localStorage.setItem(PERSONALIZATION_KEY, String(next));
    } catch {
      // No remote fallback.
    }
    setDailyInteractionTimestamp(Date.now());
  };

  const clearPersonalization = () => {
    try {
      localStorage.removeItem(INTERACTION_KEY);
    } catch {
      // No remote fallback.
    }
    setDailyInteractionTimestamp(Date.now());
  };

  const clearAllLocalData = () => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith('inner_compass_'))
        .forEach((key) => localStorage.removeItem(key));
    } catch {
      // No remote fallback.
    }
    setSavedReflections([]);
    setPersonalizationEnabled(true);
    setDailyInteractionTimestamp(Date.now());
    if (!IS_PREVIEW_MODE) setAgeConfirmed(false);
  };

  const isCurrentCategorySaved = Boolean(
    guidanceResult &&
      savedReflections.some((item) => item.categoryId === guidanceResult.category.category_id)
  );

  if (!ageConfirmed) {
    return (
      <SafeAreaView style={[styles.root, styles.centered, { backgroundColor: theme.canvas }]}>
        <View style={[styles.ageCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={styles.ageIcon}>🧭</Text>
          <Text style={[styles.ageTitle, { color: theme.textPrimary }]}>Inner Compass</Text>
          <Text style={[styles.ageText, { color: theme.textSecondary }]}>
            The initial public launch is intended for adults age 18 and older in the United States.
          </Text>
          <Pressable
            accessibilityLabel="Confirm age 18 or older"
            onPress={() => {
              try {
                localStorage.setItem(AGE_KEY, 'true');
              } catch {
                // Local storage may be unavailable.
              }
              setAgeConfirmed(true);
            }}
            style={[styles.ageButton, { backgroundColor: theme.accentPrimary }]}
          >
            <Text style={[styles.ageButtonText, { color: theme.accentText }]}>I am 18 or older</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const tabs: { id: AppTab; label: string }[] = [
    { id: 'reflect', label: 'Reflect' },
    { id: 'taxonomy', label: 'Taxonomy' },
    { id: 'wisdom', label: 'Wisdom' },
    { id: 'reads', label: 'Suggested Reads' },
    { id: 'journal', label: `Journal${savedReflections.length ? ` (${savedReflections.length})` : ''}` },
    { id: 'privacy', label: 'Privacy' },
    { id: 'crisis', label: 'Lifelines 24/7' },
  ];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.canvas }]}>
      <StatusBar barStyle={theme.variant === 'dark' ? 'light-content' : 'dark-content'} />

      <View style={[styles.topBar, { backgroundColor: theme.topBar, borderBottomColor: theme.topBarBorder }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoCircle, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={styles.logoIcon}>🧭</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>INNER COMPASS</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textMuted }]}>
              Research-Informed Wisdom & Reflection
            </Text>
          </View>
        </View>

        <View style={styles.navRightSection}>
          <Pressable
            onPress={() => setThemePickerVisible(true)}
            accessibilityLabel="Open Theme Palette Selector"
            style={[styles.themeButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          >
            <Text style={[styles.themeButtonText, { color: theme.textPrimary }]}>{theme.icon} {theme.name}</Text>
          </Pressable>

          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const active = currentTab === tab.id;
              const crisis = tab.id === 'crisis';
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => {
                    if (tab.id === 'crisis') setCrisisAlert(null);
                    if (tab.id === 'wisdom') setWisdomLinkContext(null);
                    if (tab.id === 'reads') setReadsLinkContext(null);
                    setCurrentTab(tab.id);
                  }}
                  style={[
                    styles.tabButton,
                    {
                      backgroundColor: active
                        ? crisis
                          ? theme.crisisAccent
                          : theme.tabActiveBg
                        : crisis
                          ? theme.crisisBg
                          : theme.tabInactiveBg,
                      borderColor: crisis ? theme.crisisBorder : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: active
                          ? crisis
                            ? '#FFFFFF'
                            : theme.tabActiveText
                          : crisis
                            ? theme.crisisText
                            : theme.tabInactiveText,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {IS_PREVIEW_MODE && (
        <View style={[styles.previewBanner, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.previewText, { color: theme.accentPrimary }]}>● PREVIEW MODE ACTIVE</Text>
          <Text style={[styles.previewDetail, { color: theme.textSecondary }]}>
            Local deterministic guidance · 25-category taxonomy · Wisdom Library · Suggested Reads · zero runtime AI providers
          </Text>
        </View>
      )}

      <View style={styles.content}>
        {currentTab === 'reflect' &&
          (guidanceResult ? (
            <GuidanceScreen
              result={guidanceResult}
              onBack={() => setGuidanceResult(null)}
              onOpenPractice={(category, entry) =>
                setPracticeModal({ visible: true, category, entry })
              }
              onSaveReflection={handleSaveReflection}
              isSaved={isCurrentCategorySaved}
              onOpenCrisis={() => setCurrentTab('crisis')}
              onOpenWisdom={openWisdomForCategory}
              onOpenReads={openReadsForCategory}
            />
          ) : (
            <HomeScreen
              onSubmit={handleSubmitProblem}
              onSelectDailyCategory={(category) => handleSelectCategory(category, 'sample')}
              isLoading={isLoading}
              clarificationPrompt={clarificationPrompt}
              dailyInteractionTimestamp={dailyInteractionTimestamp}
            />
          ))}

        {currentTab === 'taxonomy' && (
          <TaxonomyBrowserScreen
            onSelectCategory={(category) => handleSelectCategory(category, 'taxonomy_view')}
          />
        )}

        {currentTab === 'wisdom' && (
          <WisdomLibraryScreen
            initialCategoryId={wisdomLinkContext?.categoryId ?? null}
            initialRecordId={wisdomLinkContext?.recordId ?? null}
            onSelectCategoryId={handleSelectCategoryId}
            onOpenSuggestedReads={openReadsForWisdomRecord}
          />
        )}

        {currentTab === 'reads' && (
          <SuggestedReadsScreen
            initialCategoryId={readsLinkContext?.categoryId ?? null}
            initialWisdomRecordId={readsLinkContext?.wisdomRecordId ?? null}
            onSelectCategoryId={handleSelectCategoryId}
            onOpenWisdomRecord={openWisdomRecord}
          />
        )}

        {currentTab === 'journal' && (
          <SavedJournalScreen
            savedList={savedReflections}
            onOpenWisdomForCategory={openWisdomForCategory}
            onRemove={(id) =>
              setSavedReflections((previous) => previous.filter((item) => item.id !== id))
            }
          />
        )}

        {currentTab === 'privacy' && (
          <PrivacyScreen
            savedCount={savedReflections.length}
            personalizationEnabled={personalizationEnabled}
            onTogglePersonalization={handleTogglePersonalization}
            onClearJournal={() => setSavedReflections([])}
            onClearPersonalization={clearPersonalization}
            onClearAllLocalData={clearAllLocalData}
          />
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

      <PracticeModalRN
        visible={practiceModal.visible}
        category={practiceModal.category}
        entry={practiceModal.entry}
        onClose={() => setPracticeModal({ visible: false, category: null, entry: null })}
      />

      <ThemePickerModal
        visible={themePickerVisible}
        onClose={() => setThemePickerVisible(false)}
      />
    </SafeAreaView>
  );
};

export const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  ageCard: { width: 440, maxWidth: '100%', borderWidth: 1, borderRadius: 18, padding: 26, alignItems: 'center' },
  ageIcon: { fontSize: 34, marginBottom: 8 },
  ageTitle: { fontSize: 26, fontWeight: '800', fontFamily: 'serif', marginBottom: 9 },
  ageText: { fontSize: 14, lineHeight: 21, textAlign: 'center', marginBottom: 18 },
  ageButton: { borderRadius: 11, paddingVertical: 12, paddingHorizontal: 20 },
  ageButtonText: { fontSize: 13, fontWeight: '800' },
  topBar: { borderBottomWidth: 1, paddingHorizontal: 18, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoCircle: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  logoIcon: { fontSize: 19 },
  brandTitle: { fontSize: 15, fontWeight: '800', letterSpacing: 0.8 },
  brandSubtitle: { fontSize: 10, marginTop: 1 },
  navRightSection: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 9 },
  themeButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  themeButtonText: { fontSize: 11, fontWeight: '700' },
  tabsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  tabButton: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  tabText: { fontSize: 10, fontWeight: '700' },
  previewBanner: { borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 7, flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  previewText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  previewDetail: { fontSize: 10 },
  content: { flex: 1 },
});

export default App;
