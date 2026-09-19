import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode =
  | 'mist'           // Blue Skies / Ocean Mist (Light)
  | 'deep_sea'       // Deep Sea (Dark)
  | 'rose_light'     // Blush Rose (Light)
  | 'rose_dark'      // Midnight Wine (Dark)
  | 'lavender_light' // Lavender Dawn (Light)
  | 'lavender_dark'  // Deep Amethyst (Dark)
  | 'linen'          // Warm Linen (Light)
  | 'dusk';          // Charcoal Dusk (Dark)

export type ThemeFamily = 'blue' | 'rose' | 'purple' | 'neutral';

export interface ThemePalette {
  id: ThemeMode;
  name: string;
  family: ThemeFamily;
  familyName: string;
  variant: 'light' | 'dark';
  icon: string;
  swatchCanvas: string;
  swatchCard: string;
  swatchAccent: string;
  subtitle: string;
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
  // 1. Blue Skies / Ocean Mist (Blue - Light)
  mist: {
    id: 'mist',
    name: 'Blue Skies',
    family: 'blue',
    familyName: 'Ocean & Sky',
    variant: 'light',
    icon: '🌊',
    swatchCanvas: '#EBF1F7',
    swatchCard: '#FFFFFF',
    swatchAccent: '#275A88',
    subtitle: 'Tranquil sea breeze & open skies',
    canvas: '#EBF1F7',
    topBar: '#DEE8F2',
    topBarBorder: '#C6D7E7',
    card: '#FFFFFF',
    cardBorder: '#CDE0EE',
    cardShadow: '#16283C',
    inputBg: '#E5EFF7',
    inputBorder: '#BFD5E7',
    textPrimary: '#152436',
    textSecondary: '#3F566E',
    textMuted: '#6C839B',
    accentPrimary: '#275A88',
    accentHover: '#1B4468',
    accentText: '#FFFFFF',
    badgeBg: '#D8E7F3',
    badgeBorder: '#BFD6E8',
    badgeText: '#334F6A',
    affirmationBg: '#F2F7FB',
    affirmationBorder: '#CEE0EE',
    affirmationText: '#152436',
    affirmationLabel: '#215888',
    quoteBg: '#EBF2F8',
    quoteBorder: '#CCDDEB',
    quoteText: '#2B3F54',
    quoteLabel: '#215888',
    practiceBg: '#E8F0F7',
    practiceBorder: '#CADCEB',
    modalOverlay: 'rgba(21, 36, 54, 0.65)',
    crisisBg: '#F7E4E6',
    crisisBorder: '#E5C4C8',
    crisisText: '#7B2230',
    crisisAccent: '#A02B3D',
    tabActiveBg: '#275A88',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#D4E3EF',
    tabInactiveText: '#3F566E',
  },

  // 2. Deep Sea (Blue - Dark)
  deep_sea: {
    id: 'deep_sea',
    name: 'Deep Sea',
    family: 'blue',
    familyName: 'Ocean & Sky',
    variant: 'dark',
    icon: '🐋',
    swatchCanvas: '#0E1622',
    swatchCard: '#1A273A',
    swatchAccent: '#388BFD',
    subtitle: 'Midnight abyssal navy & ocean depths',
    canvas: '#0E1622',
    topBar: '#152030',
    topBarBorder: '#22334A',
    card: '#1A273A',
    cardBorder: '#2D415E',
    cardShadow: '#000000',
    inputBg: '#131E2D',
    inputBorder: '#2B3E59',
    textPrimary: '#F0F6FC',
    textSecondary: '#B1C5DE',
    textMuted: '#7E9BBF',
    accentPrimary: '#2B6CB0',
    accentHover: '#23578E',
    accentText: '#FFFFFF',
    badgeBg: '#1F2E45',
    badgeBorder: '#304769',
    badgeText: '#C3D6EF',
    affirmationBg: '#172335',
    affirmationBorder: '#293C56',
    affirmationText: '#F0F6FC',
    affirmationLabel: '#6BA4E8',
    quoteBg: '#141E2D',
    quoteBorder: '#26374F',
    quoteText: '#DFEAF6',
    quoteLabel: '#6BA4E8',
    practiceBg: '#182436',
    practiceBorder: '#2A3D58',
    modalOverlay: 'rgba(10, 16, 26, 0.82)',
    crisisBg: '#381C22',
    crisisBorder: '#562730',
    crisisText: '#FCA5A5',
    crisisAccent: '#EF4444',
    tabActiveBg: '#2B6CB0',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#1E2B3E',
    tabInactiveText: '#9AB4D4',
  },

  // 3. Blush Rose (Rose - Light)
  rose_light: {
    id: 'rose_light',
    name: 'Blush Rose',
    family: 'rose',
    familyName: 'Rose & Blush',
    variant: 'light',
    icon: '🌸',
    swatchCanvas: '#FBF2F2',
    swatchCard: '#FFFFFF',
    swatchAccent: '#B84A5D',
    subtitle: 'Soft petal blush & tender warmth',
    canvas: '#FBF2F2',
    topBar: '#F5E4E4',
    topBarBorder: '#E8CFCF',
    card: '#FFFFFF',
    cardBorder: '#E8D0D0',
    cardShadow: '#3D1B1B',
    inputBg: '#F7ECEC',
    inputBorder: '#DFBFBF',
    textPrimary: '#361A1E',
    textSecondary: '#6E4349',
    textMuted: '#9E6E75',
    accentPrimary: '#B84A5D',
    accentHover: '#9B384A',
    accentText: '#FFFFFF',
    badgeBg: '#F4E2E4',
    badgeBorder: '#E2C2C6',
    badgeText: '#6B3B42',
    affirmationBg: '#FCF5F5',
    affirmationBorder: '#EDD3D6',
    affirmationText: '#361A1E',
    affirmationLabel: '#A83D50',
    quoteBg: '#F9EEEE',
    quoteBorder: '#E8CFD2',
    quoteText: '#4D2A30',
    quoteLabel: '#A83D50',
    practiceBg: '#F7ECEC',
    practiceBorder: '#E4CBCF',
    modalOverlay: 'rgba(54, 26, 30, 0.65)',
    crisisBg: '#F8E2E4',
    crisisBorder: '#E5BAC0',
    crisisText: '#7B1E2B',
    crisisAccent: '#9E2434',
    tabActiveBg: '#B84A5D',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#EED7DA',
    tabInactiveText: '#6E4349',
  },

  // 4. Midnight Wine (Rose - Dark)
  rose_dark: {
    id: 'rose_dark',
    name: 'Midnight Wine',
    family: 'rose',
    familyName: 'Rose & Blush',
    variant: 'dark',
    icon: '🍷',
    swatchCanvas: '#1A1013',
    swatchCard: '#2D1C22',
    swatchAccent: '#C24158',
    subtitle: 'Rich dark plum & velvet crimson',
    canvas: '#1A1013',
    topBar: '#24161A',
    topBarBorder: '#3D2128',
    card: '#2D1C22',
    cardBorder: '#4E2E38',
    cardShadow: '#000000',
    inputBg: '#221419',
    inputBorder: '#4A2B34',
    textPrimary: '#FCEEF0',
    textSecondary: '#DEB4BC',
    textMuted: '#AD7D87',
    accentPrimary: '#C24158',
    accentHover: '#A33045',
    accentText: '#FFFFFF',
    badgeBg: '#372028',
    badgeBorder: '#532D39',
    badgeText: '#E6BAC2',
    affirmationBg: '#26171D',
    affirmationBorder: '#482732',
    affirmationText: '#FCEEF0',
    affirmationLabel: '#E06D82',
    quoteBg: '#201217',
    quoteBorder: '#41222C',
    quoteText: '#F0D4D9',
    quoteLabel: '#E06D82',
    practiceBg: '#28181E',
    practiceBorder: '#4B2935',
    modalOverlay: 'rgba(16, 8, 11, 0.82)',
    crisisBg: '#3A181E',
    crisisBorder: '#5C222C',
    crisisText: '#FCA5A5',
    crisisAccent: '#EF4444',
    tabActiveBg: '#C24158',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#341E25',
    tabInactiveText: '#DEB4BC',
  },

  // 5. Lavender Dawn (Purple - Light)
  lavender_light: {
    id: 'lavender_light',
    name: 'Lavender Dawn',
    family: 'purple',
    familyName: 'Lavender & Violet',
    variant: 'light',
    icon: '🪻',
    swatchCanvas: '#F4F1FA',
    swatchCard: '#FFFFFF',
    swatchAccent: '#7048A8',
    subtitle: 'Serene lilac mist & contemplative calm',
    canvas: '#F4F1FA',
    topBar: '#EAE4F4',
    topBarBorder: '#D6CAE8',
    card: '#FFFFFF',
    cardBorder: '#D9CEEA',
    cardShadow: '#281B3C',
    inputBg: '#EFE8F7',
    inputBorder: '#CFBFE3',
    textPrimary: '#241838',
    textSecondary: '#554373',
    textMuted: '#8471A3',
    accentPrimary: '#7048A8',
    accentHover: '#5B378E',
    accentText: '#FFFFFF',
    badgeBg: '#E7DDF4',
    badgeBorder: '#D0BFE7',
    badgeText: '#523F70',
    affirmationBg: '#F8F5FC',
    affirmationBorder: '#DFD3F0',
    affirmationText: '#241838',
    affirmationLabel: '#6B41A3',
    quoteBg: '#F1EBF7',
    quoteBorder: '#D8CBEB',
    quoteText: '#3B2857',
    quoteLabel: '#6B41A3',
    practiceBg: '#EFE8F7',
    practiceBorder: '#D4C5E8',
    modalOverlay: 'rgba(36, 24, 56, 0.65)',
    crisisBg: '#F7E2E6',
    crisisBorder: '#E6BAC2',
    crisisText: '#7B1F2D',
    crisisAccent: '#9E2434',
    tabActiveBg: '#7048A8',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#E0D4F0',
    tabInactiveText: '#554373',
  },

  // 6. Deep Amethyst (Purple - Dark)
  lavender_dark: {
    id: 'lavender_dark',
    name: 'Deep Amethyst',
    family: 'purple',
    familyName: 'Lavender & Violet',
    variant: 'dark',
    icon: '🔮',
    swatchCanvas: '#15101E',
    swatchCard: '#271E38',
    swatchAccent: '#915FDB',
    subtitle: 'Mystical royal violet & night shadows',
    canvas: '#15101E',
    topBar: '#1E172B',
    topBarBorder: '#33264A',
    card: '#271E38',
    cardBorder: '#443461',
    cardShadow: '#000000',
    inputBg: '#1C1528',
    inputBorder: '#3E2E59',
    textPrimary: '#F4F0FC',
    textSecondary: '#C9BAE3',
    textMuted: '#9A86BC',
    accentPrimary: '#824AC9',
    accentHover: '#6D3AA8',
    accentText: '#FFFFFF',
    badgeBg: '#312547',
    badgeBorder: '#4A3769',
    badgeText: '#DBCFF2',
    affirmationBg: '#211831',
    affirmationBorder: '#3D2B59',
    affirmationText: '#F4F0FC',
    affirmationLabel: '#B088F0',
    quoteBg: '#1C142A',
    quoteBorder: '#382652',
    quoteText: '#E6DCF7',
    quoteLabel: '#B088F0',
    practiceBg: '#241A35',
    practiceBorder: '#402D5E',
    modalOverlay: 'rgba(14, 10, 20, 0.82)',
    crisisBg: '#371821',
    crisisBorder: '#592533',
    crisisText: '#FCA5A5',
    crisisAccent: '#EF4444',
    tabActiveBg: '#824AC9',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#2E2142',
    tabInactiveText: '#C9BAE3',
  },

  // 7. Linen Sea (Blue Sea & Skies - Light)
  linen: {
    id: 'linen',
    name: 'Linen Sea',
    family: 'neutral',
    familyName: 'Sea Linen & Dusk',
    variant: 'light',
    icon: '⛵',
    swatchCanvas: '#E6EFF7',
    swatchCard: '#FFFFFF',
    swatchAccent: '#1E5682',
    subtitle: 'Deep sea breeze & crisp blue skies',
    canvas: '#E6EFF7',
    topBar: '#D9E6F2',
    topBarBorder: '#C1D6E7',
    card: '#FFFFFF',
    cardBorder: '#CCE0F0',
    cardShadow: '#15314C',
    inputBg: '#E0EDF8',
    inputBorder: '#B9D5EC',
    textPrimary: '#132435',
    textSecondary: '#355370',
    textMuted: '#6786A5',
    accentPrimary: '#1E5682',
    accentHover: '#154163',
    accentText: '#FFFFFF',
    badgeBg: '#D6E7F5',
    badgeBorder: '#BBD6ED',
    badgeText: '#264B6E',
    affirmationBg: '#EFF6FC',
    affirmationBorder: '#CBE0F2',
    affirmationText: '#132435',
    affirmationLabel: '#195380',
    quoteBg: '#E7F1F9',
    quoteBorder: '#C8DDF0',
    quoteText: '#203952',
    quoteLabel: '#195380',
    practiceBg: '#E4F0F9',
    practiceBorder: '#C4DCF0',
    modalOverlay: 'rgba(19, 36, 53, 0.65)',
    crisisBg: '#F7E4E6',
    crisisBorder: '#E8C5C9',
    crisisText: '#7B2230',
    crisisAccent: '#A02B3D',
    tabActiveBg: '#1E5682',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#D2E3F2',
    tabInactiveText: '#355370',
  },

  // 8. Charcoal Dusk (Neutral - Dark)
  dusk: {
    id: 'dusk',
    name: 'Charcoal Dusk',
    family: 'neutral',
    familyName: 'Sea Linen & Dusk',
    variant: 'dark',
    icon: '🌘',
    swatchCanvas: '#14171E',
    swatchCard: '#222834',
    swatchAccent: '#4D6B94',
    subtitle: 'Elevated charcoal twilight & indigo slate',
    canvas: '#14171E',
    topBar: '#1B212B',
    topBarBorder: '#2B3444',
    card: '#222834',
    cardBorder: '#354154',
    cardShadow: '#000000',
    inputBg: '#181D26',
    inputBorder: '#303B4D',
    textPrimary: '#FFFFFF',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    accentPrimary: '#4D6B94',
    accentHover: '#3A5477',
    accentText: '#FFFFFF',
    badgeBg: '#2A3342',
    badgeBorder: '#3D4A5E',
    badgeText: '#D1DCED',
    affirmationBg: '#1D232E',
    affirmationBorder: '#323F52',
    affirmationText: '#FFFFFF',
    affirmationLabel: '#7FA2D4',
    quoteBg: '#191E28',
    quoteBorder: '#2D394A',
    quoteText: '#E2E8F0',
    quoteLabel: '#7FA2D4',
    practiceBg: '#1F2633',
    practiceBorder: '#334054',
    modalOverlay: 'rgba(10, 14, 20, 0.82)',
    crisisBg: '#381E23',
    crisisBorder: '#552B33',
    crisisText: '#FCA5A5',
    crisisAccent: '#EF4444',
    tabActiveBg: '#4D6B94',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#272F3D',
    tabInactiveText: '#94A3B8',
  },
};

// Aliases for backwards compatibility
(THEMES as any).sage = THEMES.mist;
(THEMES as any).clay = THEMES.rose_light;
(THEMES as any).ocean_light = THEMES.mist;
(THEMES as any).ocean_dark = THEMES.deep_sea;

export const THEME_LIST: ThemePalette[] = [
  THEMES.mist,
  THEMES.deep_sea,
  THEMES.rose_light,
  THEMES.rose_dark,
  THEMES.lavender_light,
  THEMES.lavender_dark,
  THEMES.linen,
  THEMES.dusk,
];

interface ThemeContextType {
  themeMode: ThemeMode;
  theme: ThemePalette;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'mist',
  theme: THEMES.mist,
  setThemeMode: () => {},
});

const THEME_STORAGE_KEY = 'inner_compass_theme_mode_v2';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as string;
        if (stored === 'sage') return 'mist';
        if (stored === 'clay') return 'rose_light';
        if (stored && (THEMES as any)[stored]) {
          return stored as ThemeMode;
        }
      }
    } catch {
      // fallback to mist
    }
    return 'mist';
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

  const theme = THEMES[themeMode] || THEMES.mist;

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
