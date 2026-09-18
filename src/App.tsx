import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { HomeScreen } from './screens/HomeScreen';
import { GuidanceScreen } from './screens/GuidanceScreen';
import { CrisisScreen } from './screens/CrisisScreen';
import { TaxonomyBrowserScreen } from './screens/TaxonomyBrowserScreen';
import { SavedJournalScreen } from './screens/SavedJournalScreen';
import { PracticeModalRN } from './components/PracticeModalRN';
import { evaluateSafetyUpstream } from './safety/safetyRouter';
import { retrieveGroundedGuidance } from './retrieval/retrievalEngine';
import { validateGrounding } from './validation/groundingValidator';
import { Category, ExistentialRoot, GuidanceResult, KBEntry, SavedReflection } from './types';
import { ThemeProvider, useTheme, ThemeMode } from './theme';

const STORAGE_KEY = 'inner_compass_saved_reflections_v1';

const AppContent: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const [currentTab, setCurrentTab] = useState<'reflect' | 'taxonomy' | 'crisis' | 'journal'>('reflect');
  const [guidanceResult, setGuidanceResult] = useState<GuidanceResult | null>(null);
  const [crisisAlert, setCrisisAlert] = useState<{ reason?: string; safetyNotes?: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmitProblem = async (problemText: string, preferredRoot?: ExistentialRoot | null) => {
    setIsLoading(true);

    try {
      // 1. Upstream Deterministic Safety Evaluation
      const safety = evaluateSafetyUpstream(problemText);

      // Handle Crisis / Abuse / Substance hard ceilings
      if (safety.status === 'CRISIS_REDIRECT' || safety.status === 'ABUSE_REDIRECT' || safety.status === 'ESCALATION_REDIRECT') {
        setCrisisAlert({
          reason: safety.reason,
          safetyNotes: safety.safetyNotes,
        });
        setCurrentTab('crisis');
        setIsLoading(false);
        return;
      }

      // 2. Call server API endpoint for Gemini structured guidance
      const response = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problemText,
          problemText,
          preferredRoot,
          suggestedCategoryId: safety.suggestedCategoryId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.blockedFromWisdom) {
          setCrisisAlert({
            reason: data.safety?.reason,
            safetyNotes: data.safety?.safetyNotes,
          });
          setCurrentTab('crisis');
          setIsLoading(false);
          return;
        }

        const category = data.category as Category;
        const result: GuidanceResult = {
          category,
          safety: data.safety || safety,
          grounding: data.grounding || validateGrounding(null, category),
          affirmation: data.affirmation || `I anchor in ${category.category_name} with awareness and presence.`,
          synthesis: data.synthesis || category.synthesis_note,
          isFallback: Boolean(data.isFallback),
        };

        setGuidanceResult(result);
        setCrisisAlert(null);
      } else {
        // Deterministic local client fallback
        const retrieval = retrieveGroundedGuidance(problemText, preferredRoot, safety.suggestedCategoryId);
        const grounding = validateGrounding(null, retrieval.category);
        const localResult: GuidanceResult = {
          category: retrieval.category,
          safety,
          grounding,
          affirmation: `I meet this moment with presence, honesty, and grounded courage.`,
          synthesis: grounding.groundedSynthesis,
          isFallback: true,
        };
        setGuidanceResult(localResult);
        setCrisisAlert(null);
      }
    } catch (err) {
      // Deterministic local client fallback
      const fallbackSafety = evaluateSafetyUpstream(problemText);
      const retrieval = retrieveGroundedGuidance(problemText, preferredRoot, fallbackSafety.suggestedCategoryId);
      const grounding = validateGrounding(null, retrieval.category);
      const localResult: GuidanceResult = {
        category: retrieval.category,
        safety: fallbackSafety,
        grounding,
        affirmation: `I meet this moment with presence, honesty, and grounded courage.`,
        synthesis: grounding.groundedSynthesis,
        isFallback: true,
      };
      setGuidanceResult(localResult);
      setCrisisAlert(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategoryFromTaxonomy = (category: Category) => {
    const safety = evaluateSafetyUpstream(category.category_name);
    const grounding = validateGrounding(null, category);
    const result: GuidanceResult = {
      category,
      safety,
      grounding,
      affirmation: `I anchor in ${category.category_name} with mindful clarity and practical steps.`,
      synthesis: category.synthesis_note,
      isFallback: true,
    };
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
  };

  const isCurrentCategorySaved = Boolean(
    guidanceResult &&
    savedReflections.some((r) => r.categoryId === guidanceResult.category.category_id)
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.canvas }]}>
      <StatusBar barStyle={themeMode === 'dusk' ? 'light-content' : 'dark-content'} />

      {/* App Navigation Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.topBar, borderBottomColor: theme.topBarBorder }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoCircle, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            <Text style={styles.logoIcon}>🧭</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>INNER COMPASS</Text>
            <Text style={[styles.brandSubtitle, { color: theme.textMuted }]}>Clinical Wisdom & Contemplative Taxonomy</Text>
          </View>
        </View>

        {/* Right side: Palette Switcher & Tabs */}
        <View style={styles.navRightSection}>
          {/* Theme Palette Switcher */}
          <View style={[styles.themePillsRow, { backgroundColor: theme.badgeBg, borderColor: theme.badgeBorder }]}>
            {(['linen', 'sage', 'dusk'] as ThemeMode[]).map((mode) => {
              const isSelected = themeMode === mode;
              const label = mode === 'linen' ? 'Linen' : mode === 'sage' ? 'Sage' : 'Dusk';
              const icon = mode === 'linen' ? '📜' : mode === 'sage' ? '🍃' : '🌘';
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themePill,
                    isSelected && { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  ]}
                  onPress={() => setThemeMode(mode)}
                >
                  <Text
                    style={[
                      styles.themePillText,
                      { color: isSelected ? theme.textPrimary : theme.textMuted },
                    ]}
                  >
                    {icon} {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                { backgroundColor: currentTab === 'reflect' ? theme.tabActiveBg : theme.tabInactiveBg },
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
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                { backgroundColor: currentTab === 'taxonomy' ? theme.tabActiveBg : theme.tabInactiveBg },
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
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                { backgroundColor: currentTab === 'journal' ? theme.tabActiveBg : theme.tabInactiveBg },
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
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor: currentTab === 'crisis' ? theme.crisisAccent : theme.crisisBg,
                  borderWidth: 1,
                  borderColor: theme.crisisBorder,
                },
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
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
              isLoading={isLoading}
            />
          )
        )}

        {currentTab === 'taxonomy' && (
          <TaxonomyBrowserScreen
            onSelectCategory={(cat) => {
              handleSelectCategoryFromTaxonomy(cat);
            }}
          />
        )}

        {currentTab === 'journal' && (
          <SavedJournalScreen
            savedList={savedReflections}
            onSelectCategory={(cat) => {
              handleSelectCategoryFromTaxonomy(cat);
            }}
            onRemove={(id) => {
              setSavedReflections((prev) => prev.filter((r) => r.id !== id));
            }}
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

      {/* Guided Practice Modal */}
      <PracticeModalRN
        visible={practiceModal.visible}
        category={practiceModal.category}
        entry={practiceModal.entry}
        onClose={() => setPracticeModal({ visible: false, category: null, entry: null })}
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
  themePillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  themePill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themePillText: {
    fontSize: 11,
    fontWeight: '600',
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
});

export default App;
