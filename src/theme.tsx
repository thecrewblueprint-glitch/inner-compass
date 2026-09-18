import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'linen' | 'sage' | 'dusk';

export interface ThemePalette {
  id: ThemeMode;
  name: string;
  canvas: string;
  topBar: string;
  topBarBorder: string;
  card: string;
  cardBorder: string;
  cardShadow: string;
  inputBg: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentHover: string;
  accentText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  affirmationBg: string;
  affirmationBorder: string;
  affirmationText: string;
  affirmationLabel: string;
  quoteBg: string;
  quoteBorder: string;
  quoteText: string;
  quoteLabel: string;
  practiceBg: string;
  practiceBorder: string;
  modalOverlay: string;
  crisisBg: string;
  crisisBorder: string;
  crisisText: string;
  crisisAccent: string;
  tabActiveBg: string;
  tabActiveText: string;
  tabInactiveBg: string;
  tabInactiveText: string;
}

export const THEMES: Record<ThemeMode, ThemePalette> = {
  // 1. Warm Linen (Default) - Warm, rich oatmeal and aged parchment, absolutely zero stark white glare
  linen: {
    id: 'linen',
    name: 'Warm Linen',
    canvas: '#EAE4D7',
    topBar: '#DFD8CA',
    topBarBorder: '#CFC5B4',
    card: '#F3EDE2',
    cardBorder: '#DDD5C4',
    cardShadow: '#26221C',
    inputBg: '#E4DDD0',
    inputBorder: '#CCC2B0',
    textPrimary: '#26221C',
    textSecondary: '#5A5348',
    textMuted: '#7D7569',
    accentPrimary: '#2E4C40',
    accentHover: '#233C32',
    accentText: '#FAF6ED',
    badgeBg: '#DFD7C8',
    badgeBorder: '#CCC2B0',
    badgeText: '#595247',
    affirmationBg: '#ECE3D3',
    affirmationBorder: '#D8CCBA',
    affirmationText: '#26221C',
    affirmationLabel: '#7F5E2B',
    quoteBg: '#E8DFCE',
    quoteBorder: '#D4C8B4',
    quoteText: '#423B31',
    quoteLabel: '#7A5B27',
    practiceBg: '#E7DFD0',
    practiceBorder: '#D2C7B4',
    modalOverlay: 'rgba(38, 34, 28, 0.6)',
    crisisBg: '#EEDDDE',
    crisisBorder: '#E0C5C7',
    crisisText: '#77222F',
    crisisAccent: '#9E2C3D',
    tabActiveBg: '#2E4C40',
    tabActiveText: '#FAF6ED',
    tabInactiveBg: '#DDD5C5',
    tabInactiveText: '#5A5348',
  },

  // 2. Muted Sage - Calming botanical earthy sage, organic and soft on the eyes
  sage: {
    id: 'sage',
    name: 'Muted Sage',
    canvas: '#DDE5DD',
    topBar: '#D1DBD1',
    topBarBorder: '#BDCABD',
    card: '#E8EFE8',
    cardBorder: '#CCD8CC',
    cardShadow: '#1C2920',
    inputBg: '#D6E0D6',
    inputBorder: '#BAC7BA',
    textPrimary: '#1E2B22',
    textSecondary: '#4A5B4F',
    textMuted: '#6B7D70',
    accentPrimary: '#234433',
    accentHover: '#1B3528',
    accentText: '#F2F7F3',
    badgeBg: '#CFDBCF',
    badgeBorder: '#BCCABC',
    badgeText: '#425447',
    affirmationBg: '#DCE8DC',
    affirmationBorder: '#C3D4C3',
    affirmationText: '#1E2B22',
    affirmationLabel: '#365E48',
    quoteBg: '#D6E3D6',
    quoteBorder: '#BFD0BF',
    quoteText: '#2D3F33',
    quoteLabel: '#365E48',
    practiceBg: '#D6E2D6',
    practiceBorder: '#BCCBBC',
    modalOverlay: 'rgba(28, 41, 32, 0.6)',
    crisisBg: '#EADCE0',
    crisisBorder: '#D8C2C7',
    crisisText: '#722534',
    crisisAccent: '#932B3E',
    tabActiveBg: '#234433',
    tabActiveText: '#F2F7F3',
    tabInactiveBg: '#CCD8CC',
    tabInactiveText: '#4A5B4F',
  },

  // 3. Warm Dusk - Gentle, dark espresso warm paper, zero glare for low-light reflection
  dusk: {
    id: 'dusk',
    name: 'Warm Dusk',
    canvas: '#1F1D1B',
    topBar: '#272421',
    topBarBorder: '#393530',
    card: '#2A2724',
    cardBorder: '#3E3A34',
    cardShadow: '#000000',
    inputBg: '#23201D',
    inputBorder: '#3D3831',
    textPrimary: '#EAE5DB',
    textSecondary: '#B2ABA0',
    textMuted: '#888277',
    accentPrimary: '#426958',
    accentHover: '#355547',
    accentText: '#FAF7F2',
    badgeBg: '#34302C',
    badgeBorder: '#48433D',
    badgeText: '#B8B1A7',
    affirmationBg: '#332F2A',
    affirmationBorder: '#4C463D',
    affirmationText: '#F0ECE4',
    affirmationLabel: '#C8A060',
    quoteBg: '#2F2B26',
    quoteBorder: '#464037',
    quoteText: '#DED8CE',
    quoteLabel: '#C8A060',
    practiceBg: '#322E29',
    practiceBorder: '#474138',
    modalOverlay: 'rgba(12, 11, 10, 0.75)',
    crisisBg: '#3A2529',
    crisisBorder: '#54343A',
    crisisText: '#E6A1AC',
    crisisAccent: '#C94B5E',
    tabActiveBg: '#426958',
    tabActiveText: '#FAF7F2',
    tabInactiveBg: '#34302C',
    tabInactiveText: '#B2ABA0',
  },
};

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: ThemePalette;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'linen',
  theme: THEMES.linen,
  setThemeMode: () => {},
});

const THEME_STORAGE_KEY = 'inner_compass_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
        if (stored && THEMES[stored]) {
          return stored;
        }
      }
    } catch {
      // fallback to linen
    }
    return 'linen';
  });

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, mode);
      }
    } catch {
      // ignore
    }
  };

  const theme = THEMES[themeMode] || THEMES.linen;

  // Apply theme canvas to document body to prevent white flashes or margins
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = theme.canvas;
      document.body.style.color = theme.textPrimary;
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ themeMode, theme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};
