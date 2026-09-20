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
import { LegalScreen, LegalDocumentKey } from './screens/LegalScreen';
import { DiagnosticsScreen } from './screens/DiagnosticsScreen';
import { PracticeModalRN } from './components/PracticeModalRN';
import { ThemePickerModal } from './components/ThemePickerModal';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { LaunchGate, LAUNCH_ATTESTATION_KEY } from './components/LaunchGate';
import { evaluateSafetyUpstream } from './safety/safetyRouter';
import { retrieveGroundedGuidance } from './retrieval/retrievalEngine';
import { validateGrounding } from './validation/groundingValidator';
import { getCategoryById } from './knowledgeBase/kbLoader';
import { WISDOM_AFFIRMATIONS } from './data/wisdomLibrary';
import { Category, EmergencyResource, ExistentialRoot, GuidanceResult, KBEntry, SavedReflection } from './types';
import { ThemeProvider, useTheme } from './theme';
import { recordCategoryInteraction } from './services/dailyAffirmationService';
import { installGlobalDebugHooks, recordDebugEvent } from './debug/debugStore';

const STORAGE_KEY = 'inner_compass_saved_reflections_v1';
const INTERACTION_KEY = 'inner_compass_category_interactions_v1';
const PERSONALIZATION_KEY = 'inner_compass_personalization_enabled_v1';
const IS_PREVIEW_MODE = import.meta.env.VITE_INNER_COMPASS_PREVIEW === 'true';
const IS_DIAGNOSTICS_ENABLED =
  import.meta.env.VITE_INNER_COMPASS_DEBUG === 'true' ||
  (import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('debug') === '1');

type AppTab = 'reflect' | 'taxonomy' | 'wisdom' | 'reads' | 'journal' | 'privacy' | 'legal' | 'crisis' | 'diagnostics';

type CrisisAlert = {
  reason?: string;
  safetyNotes?: string[];
  resources?: EmergencyResource[];
} | null;

type WisdomLinkContext = { categoryId?: number; recordId?: string } | null;
type ReadsLinkContext = { categoryId?: number; wisdomRecordId?: string } | null;

interface NavigationState {
  tab: AppTab;
  guidanceResult: GuidanceResult | null;
  crisisAlert: CrisisAlert;
  wisdomLinkContext: WisdomLinkContext;
  readsLinkContext: ReadsLinkContext;
}

const ROOT_NAVIGATION: NavigationState = {
  tab: 'reflect',
  guidanceResult: null,
  crisisAlert: null,
  wisdomLinkContext: null,
  readsLinkContext: null,
};

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
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([ROOT_NAVIGATION]);
  const [isLoading, setIsLoading] = useState(false);
  const [clarificationPrompt, setClarificationPrompt] = useState<string | null>(null);
  const [themePickerVisible, setThemePickerVisible] = useState(false);
  const [dailyInteractionTimestamp, setDailyInteractionTimestamp] = useState(0);
  const [legalDocument, setLegalDocument] = useState<LegalDocumentKey>('privacy');

  const currentNavigation = navigationStack[navigationStack.length - 1];
  const currentTab = currentNavigation.tab;
  const guidanceResult = currentNavigation.guidanceResult;
  const crisisAlert = currentNavigation.crisisAlert;
  const wisdomLinkContext = currentNavigation.wisdomLinkContext;
  const readsLinkContext = currentNavigation.readsLinkContext;
  const canGoBack = navigationStack.length > 1;

  useEffect(() => {
    recordDebugEvent('navigation', {
      tab: currentTab,
      depth: navigationStack.length,
      hasGuidance: Boolean(guidanceResult),
      hasCrisis: Boolean(crisisAlert),
    });
  }, [currentTab, navigationStack.length, guidanceResult, crisisAlert]);

  const [launchAccepted, setLaunchAccepted] = useState(() => {
    if (IS_PREVIEW_MODE) return true;
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

  useEffect(() => {
    recordDebugEvent('app_start', { preview: IS_PREVIEW_MODE, diagnostics: IS_DIAGNOSTICS_ENABLED });
    return installGlobalDebugHooks();
  }, []);

  const pushNavigation = (next: NavigationState) => {
    setNavigationStack((previous) => [...previous, next]);
  };

  const navigateBack = () => {
    setNavigationStack((previous) =>
      previous.length > 1 ? previous.slice(0, -1) : previous
    );
  };

  const navigateToTab = (tab: AppTab) => {
    setNavigationStack((previous) => {
      const current = previous[previous.length - 1];
      const isSameRootView =
        current.tab === tab &&
        current.guidanceResult === null &&
        current.crisisAlert === null &&
        current.wisdomLinkContext === null &&
        current.readsLinkContext === null;

      if (isSameRootView) return previous;

      // Tabs restore the most recent page in that section when it exists.
      // This preserves a guidance result when the user follows a Wisdom/Reads
      // cross-link and then returns to Reflect, while Back still walks the
      // page history one state at a time.
      for (let index = previous.length - 2; index >= 0; index -= 1) {
        if (previous[index].tab === tab) {
          return previous.slice(0, index + 1);
        }
      }

      return [
        ...previous,
        {
          tab,
          guidanceResult: null,
          crisisAlert: null,
          wisdomLinkContext: null,
          readsLinkContext: null,
        },
      ];
    });
  };

  const openLegalDocument = (document: LegalDocumentKey) => {
    setLegalDocument(document);
    navigateToTab('legal');
  };

  const trackCategoryInteraction = (
    categoryId: number,
    source: 'reflection' | 'saved' | 'taxonomy_view' | 'sample'
  ) => {
    if (!personalizationEnabled) return;
    recordCategoryInteraction(categoryId, source);
    setDailyInteractionTimestamp(Date.now());
  };

  const routeSafety = (reason?: string, safetyNotes?: string[], resources?: EmergencyResource[]) => {
    setClarificationPrompt(null);
    recordDebugEvent('safety_route', {
      status: 'manual_or_routed',
      blocked: true,
      resourceCount: resources?.length || 0,
    });
    pushNavigation({
      tab: 'crisis',
      guidanceResult: null,
      crisisAlert: { reason, safetyNotes, resources },
      wisdomLinkContext: null,
      readsLinkContext: null,
    });
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

  const openGuidance = (
    category: Category,
    safety: ReturnType<typeof evaluateSafetyUpstream>,
    source: 'reflection' | 'saved' | 'taxonomy_view' | 'sample'
  ) => {
    pushNavigation({
      tab: 'reflect',
      guidanceResult: makeGuidance(category, safety),
      crisisAlert: null,
      wisdomLinkContext: null,
      readsLinkContext: null,
    });
    trackCategoryInteraction(category.category_id, source);
  };

  const handleSubmitProblem = async (
    problemText: string,
    preferredRoot?: ExistentialRoot | null
  ) => {
    setIsLoading(true);
    setClarificationPrompt(null);

    try {
      recordDebugEvent('reflection_submit', {
        chars: problemText.length,
        words: problemText.trim().split(/\s+/).filter(Boolean).length,
        preferredRoot: preferredRoot || 'none',
      });

      // Raw reflection text is processed only in this browser execution path.
      const safety = evaluateSafetyUpstream(problemText);
      recordDebugEvent('safety_route', {
        status: safety.status,
        blocked: safety.blockedFromWisdomMatching,
        rule: safety.matchedRule || 'none',
        confidence: safety.confidence || 'none',
      });

      if (safety.blockedFromWisdomMatching || safety.status === 'SUBSTANCE_HARD_CEILING') {
        routeSafety(safety.reason, safety.safetyNotes, safety.emergencyResources);
        return;
      }

      const retrieval = retrieveGroundedGuidance(
        problemText,
        preferredRoot,
        safety.suggestedCategoryId
      );

      if (retrieval.needsClarification) {
        recordDebugEvent('clarification', {
          categoryId: retrieval.category.category_id,
          score: retrieval.score,
          margin: retrieval.scoreMargin ?? 0,
        });
        setClarificationPrompt(
          retrieval.clarificationQuestion ||
            'Could you add one concrete detail about what feels most difficult right now?'
        );
        return;
      }

      recordDebugEvent('guidance', {
        categoryId: retrieval.category.category_id,
        score: retrieval.score,
        source: 'reflection',
      });
      openGuidance(retrieval.category, safety, 'reflection');
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
        safety.safetyNotes,
        safety.emergencyResources
      );
      return;
    }

    const safety = evaluateSafetyUpstream(category.category_name);
    if (safety.blockedFromWisdomMatching || safety.status === 'SUBSTANCE_HARD_CEILING') {
      routeSafety(safety.reason, safety.safetyNotes, safety.emergencyResources);
      return;
    }

    openGuidance(category, safety, source);
  };

  const handleSelectCategoryId = (categoryId: number) => {
    const category = getCategoryById(categoryId);
    if (category) handleSelectCategory(category, 'taxonomy_view');
  };

  const openWisdomForCategory = (categoryId: number) => {
    pushNavigation({
      tab: 'wisdom',
      guidanceResult: null,
      crisisAlert: null,
      wisdomLinkContext: { categoryId },
      readsLinkContext: null,
    });
  };

  const openWisdomRecord = (recordId: string) => {
    pushNavigation({
      tab: 'wisdom',
      guidanceResult: null,
      crisisAlert: null,
      wisdomLinkContext: { recordId },
      readsLinkContext: null,
    });
  };

  const openReadsForCategory = (categoryId: number) => {
    pushNavigation({
      tab: 'reads',
      guidanceResult: null,
      crisisAlert: null,
      wisdomLinkContext: null,
      readsLinkContext: { categoryId },
    });
  };

  const openReadsForWisdomRecord = (recordId: string) => {
    pushNavigation({
      tab: 'reads',
      guidanceResult: null,
      crisisAlert: null,
      wisdomLinkContext: null,
      readsLinkContext: { wisdomRecordId: recordId },
    });
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
    setNavigationStack([ROOT_NAVIGATION]);
    if (!IS_PREVIEW_MODE) setLaunchAccepted(false);
  };

  const isCurrentCategorySaved = Boolean(
    guidanceResult &&
      savedReflections.some((item) => item.categoryId === guidanceResult.category.category_id)
  );

  if (!launchAccepted) {
    return <LaunchGate onAccepted={() => setLaunchAccepted(true)} />;
  }

  const tabs: { id: AppTab; label: string }[] = [
    { id: 'reflect', label: 'Reflect' },
    { id: 'taxonomy', label: 'Taxonomy' },
    { id: 'wisdom', label: 'Wisdom' },
    { id: 'reads', label: 'Suggested Reads' },
    { id: 'journal', label: `Journal${savedReflections.length ? ` (${savedReflections.length})` : ''}` },
    { id: 'privacy', label: 'Privacy' },
    { id: 'legal', label: 'Legal & Safety' },
    { id: 'crisis', label: 'Lifelines 24/7' },
    ...(IS_DIAGNOSTICS_ENABLED ? [{ id: 'diagnostics' as AppTab, label: 'Local Diagnostics' }] : []),
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
          {canGoBack && (
            <Pressable
              onPress={navigateBack}
              accessibilityLabel="Go back one page"
              style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            >
              <Text style={[styles.backButtonText, { color: theme.textPrimary }]}>← Back</Text>
            </Pressable>
          )}

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
                  onPress={() => navigateToTab(tab.id)}
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
              onBack={navigateBack}
              onOpenPractice={(category, entry) =>
                setPracticeModal({ visible: true, category, entry })
              }
              onSaveReflection={handleSaveReflection}
              isSaved={isCurrentCategorySaved}
              onOpenCrisis={() => routeSafety()}
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
              onOpenLegal={() => openLegalDocument('terms')}
              onOpenHealthData={() => openLegalDocument('health-data')}
              onOpenCrisis={() => navigateToTab('crisis')}
            />
          ))}

        {currentTab === 'taxonomy' && (
          <TaxonomyBrowserScreen
            onSelectCategory={(category) => handleSelectCategory(category, 'taxonomy_view')}
            onOpenWisdomForCategory={openWisdomForCategory}
            onOpenReadsForCategory={openReadsForCategory}
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
            onOpenLegal={() => openLegalDocument('privacy')}
          />
        )}

        {currentTab === 'legal' && <LegalScreen initialDocument={legalDocument} />}

        {currentTab === 'diagnostics' && IS_DIAGNOSTICS_ENABLED && <DiagnosticsScreen />}

        {currentTab === 'crisis' && (
          <CrisisScreen
            reason={crisisAlert?.reason}
            safetyNotes={crisisAlert?.safetyNotes}
            resources={crisisAlert?.resources}
            onDismiss={navigateBack}
          />
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: theme.topBar, borderTopColor: theme.topBarBorder }]}>
        <Text style={[styles.footerText, { color: theme.textMuted }]}>Beta · 18+ · U.S. · English only · General-wellness reflection</Text>
        <View style={styles.footerLinks}>
          <Pressable accessibilityRole="link" onPress={() => openLegalDocument('terms')}><Text style={[styles.footerLink, { color: theme.accentPrimary }]}>Legal & Safety</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => openLegalDocument('health-data')}><Text style={[styles.footerLink, { color: theme.accentPrimary }]}>Consumer Health Data Policy</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => navigateToTab('privacy')}><Text style={[styles.footerLink, { color: theme.accentPrimary }]}>Privacy</Text></Pressable>
          <Pressable accessibilityRole="link" onPress={() => navigateToTab('crisis')}><Text style={[styles.footerLink, { color: theme.crisisAccent }]}>Lifelines</Text></Pressable>
        </View>
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
  <AppErrorBoundary>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </AppErrorBoundary>
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
  backButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  backButtonText: { fontSize: 11, fontWeight: '800' },
  themeButton: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 },
  themeButtonText: { fontSize: 11, fontWeight: '700' },
  tabsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  tabButton: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6 },
  tabText: { fontSize: 10, fontWeight: '700' },
  previewBanner: { borderBottomWidth: 1, paddingHorizontal: 20, paddingVertical: 7, flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' },
  previewText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.6 },
  previewDetail: { fontSize: 10 },
  content: { flex: 1 },
  footer: { borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  footerText: { fontSize: 9, fontWeight: '700' },
  footerLinks: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  footerLink: { fontSize: 10, fontWeight: '800' },
});

export default App;
