import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeFamily =
  | 'rose'
  | 'amber'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'neutral'
  // Legacy family aliases
  | 'red'
  | 'orange'
  | 'yellow'
  | 'indigo'
  | 'earth';

export type ThemeMode =
  // 1. Rose & Sunset (includes legacy red/ruby)
  | 'rose_light'
  | 'rose_dark'
  // 2. Amber & Earth (includes legacy orange, yellow/gold, linen/earth)
  | 'amber_light'
  | 'amber_dark'
  // 3. Sage & Emerald
  | 'sage_light'
  | 'sage_dark'
  // 4. Teal & Lagoon
  | 'teal_light'
  | 'teal_dark'
  // 5. Ocean & Sky
  | 'mist'
  | 'deep_sea'
  // 6. Twilight & Lavender (includes legacy indigo)
  | 'lavender_light'
  | 'lavender_dark'
  // 7. Slate & Charcoal
  | 'slate_light'
  | 'dusk'
  // Legacy aliases for stored settings compatibility
  | 'ruby_light'
  | 'ruby_dark'
  | 'gold_light'
  | 'gold_dark'
  | 'linen'
  | 'earth_dark'
  | 'indigo_light'
  | 'indigo_dark';

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

// ============================================================================
// CONSOLIDATED 7 COLOR SPECTRUMS
// Off-white ivory lights & soft early-dusk darks complemented by sunset,
// aurora borealis, starlight lavender & warm gold accents.
// ============================================================================

// 1. ROSE & SUNSET
const rose_light: ThemePalette = {
  id: 'rose_light',
  name: 'Sunset Rose & Ivory',
  family: 'rose',
  familyName: 'Rose & Sunset',
  variant: 'light',
  icon: '🌸',
  swatchCanvas: '#FAF4F3',
  swatchCard: '#FCFAF6',
  swatchAccent: '#F43F5E',
  subtitle: 'Vivid sunset rose, warm ivory canvas & gold accents',
  canvas: '#FAF4F3',
  topBar: '#F6ECE9',
  topBarBorder: '#E9D3CF',
  card: '#FCFAF6',
  cardBorder: '#EBD8D4',
  cardShadow: 'rgba(180, 50, 80, 0.08)',
  inputBg: '#F4E7E4',
  inputBorder: '#E2C2BD',
  textPrimary: '#2F151B',
  textSecondary: '#6F2837',
  textMuted: '#9B4155',
  accentPrimary: '#F43F5E',
  accentHover: '#E11D48',
  accentText: '#FAF4F3',
  badgeBg: '#F5E1E0',
  badgeBorder: '#E2BDC0',
  badgeText: '#872136',
  affirmationBg: '#F8EDE9',
  affirmationBorder: '#D4AF37',
  affirmationText: '#561623',
  affirmationLabel: '#D97706',
  quoteBg: '#F5E8E5',
  quoteBorder: '#E5CBC8',
  quoteText: '#2F151B',
  quoteLabel: '#F43F5E',
  practiceBg: '#F5E1E0',
  practiceBorder: '#E2BDC0',
  modalOverlay: 'rgba(40, 14, 20, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#F43F5E',
  tabActiveBg: '#F43F5E',
  tabActiveText: '#FAF4F3',
  tabInactiveBg: '#F5E1E0',
  tabInactiveText: '#6F2837',
};

const rose_dark: ThemePalette = {
  id: 'rose_dark',
  name: 'Early Dusk Crimson & Gold',
  family: 'rose',
  familyName: 'Rose & Sunset',
  variant: 'dark',
  icon: '🍷',
  swatchCanvas: '#241B21',
  swatchCard: '#31242D',
  swatchAccent: '#FB7185',
  subtitle: 'Early dusk crimson, flowy pink sunset & warm starlight glow',
  canvas: '#241B21',
  topBar: '#2A2027',
  topBarBorder: '#463340',
  card: '#31242D',
  cardBorder: '#4E3A47',
  cardShadow: 'rgba(14, 8, 12, 0.35)',
  inputBg: '#271F24',
  inputBorder: '#4E3A47',
  textPrimary: '#FAF6ED',
  textSecondary: '#E4CCD4',
  textMuted: '#FB7185',
  accentPrimary: '#FB7185',
  accentHover: '#F43F5E',
  accentText: '#241B21',
  badgeBg: '#3F2C3A',
  badgeBorder: '#5E3E56',
  badgeText: '#FDE68A',
  affirmationBg: '#362632',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#2C2129',
  quoteBorder: '#4E3A47',
  quoteText: '#F5E5EC',
  quoteLabel: '#FB7185',
  practiceBg: '#392835',
  practiceBorder: '#563B50',
  modalOverlay: 'rgba(14, 8, 12, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#FB7185',
  tabActiveBg: '#FB7185',
  tabActiveText: '#241B21',
  tabInactiveBg: '#31242D',
  tabInactiveText: '#E4CCD4',
};

// 2. AMBER & EARTH (Honey gold, terracotta & linen ivory)
const amber_light: ThemePalette = {
  id: 'amber_light',
  name: 'Warm Amber & Ivory',
  family: 'amber',
  familyName: 'Amber & Earth',
  variant: 'light',
  icon: '🏺',
  swatchCanvas: '#FAF6EE',
  swatchCard: '#FCFAF4',
  swatchAccent: '#EA580C',
  subtitle: 'Honey gold, warm terracotta, tactile linen ivory & gold accents',
  canvas: '#FAF6EE',
  topBar: '#F7F2E8',
  topBarBorder: '#E8DBC6',
  card: '#FCFAF4',
  cardBorder: '#E4D5BE',
  cardShadow: 'rgba(160, 90, 30, 0.08)',
  inputBg: '#F5EDE1',
  inputBorder: '#DECBB1',
  textPrimary: '#2E1E12',
  textSecondary: '#6E4526',
  textMuted: '#995E35',
  accentPrimary: '#EA580C',
  accentHover: '#C2410C',
  accentText: '#FAF6EE',
  badgeBg: '#F4E7D6',
  badgeBorder: '#E0C5A7',
  badgeText: '#7C2D12',
  affirmationBg: '#FAF2E6',
  affirmationBorder: '#D4AF37',
  affirmationText: '#54240B',
  affirmationLabel: '#D97706',
  quoteBg: '#F6EFE5',
  quoteBorder: '#E1D0BC',
  quoteText: '#2E1E12',
  quoteLabel: '#EA580C',
  practiceBg: '#F4E7D6',
  practiceBorder: '#E0C5A7',
  modalOverlay: 'rgba(38, 22, 12, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#EA580C',
  tabActiveBg: '#EA580C',
  tabActiveText: '#FAF6EE',
  tabInactiveBg: '#F4E7D6',
  tabInactiveText: '#6E4526',
};

const amber_dark: ThemePalette = {
  id: 'amber_dark',
  name: 'Early Dusk Amber & Gold',
  family: 'amber',
  familyName: 'Amber & Earth',
  variant: 'dark',
  icon: '🪵',
  swatchCanvas: '#231B15',
  swatchCard: '#30251E',
  swatchAccent: '#F59E0B',
  subtitle: 'Early dusk embers, warm terracotta gold & soft starlight',
  canvas: '#231B15',
  topBar: '#29201A',
  topBarBorder: '#45352A',
  card: '#30251E',
  cardBorder: '#4C3B30',
  cardShadow: 'rgba(16, 10, 6, 0.35)',
  inputBg: '#271E18',
  inputBorder: '#4C3B30',
  textPrimary: '#FAF6ED',
  textSecondary: '#E7D5C4',
  textMuted: '#F59E0B',
  accentPrimary: '#F59E0B',
  accentHover: '#D97706',
  accentText: '#231B15',
  badgeBg: '#3D2F25',
  badgeBorder: '#5A4435',
  badgeText: '#FDE68A',
  affirmationBg: '#34271E',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#2B2019',
  quoteBorder: '#4C3B30',
  quoteText: '#F5EBE1',
  quoteLabel: '#F59E0B',
  practiceBg: '#392B21',
  practiceBorder: '#543F30',
  modalOverlay: 'rgba(16, 10, 6, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#F59E0B',
  tabActiveBg: '#F59E0B',
  tabActiveText: '#231B15',
  tabInactiveBg: '#30251E',
  tabInactiveText: '#E7D5C4',
};

// 3. SAGE & EMERALD
const sage_light: ThemePalette = {
  id: 'sage_light',
  name: 'Sage & Ivory Linen',
  family: 'green',
  familyName: 'Sage & Emerald',
  variant: 'light',
  icon: '🌿',
  swatchCanvas: '#F5F7F5',
  swatchCard: '#FAFBF9',
  swatchAccent: '#16A34A',
  subtitle: 'Calming botanical eucalyptus, ivory linen & gold accents',
  canvas: '#F5F7F5',
  topBar: '#EDF2EE',
  topBarBorder: '#D2DDD5',
  card: '#FAFBF9',
  cardBorder: '#D6E0D9',
  cardShadow: 'rgba(30, 100, 60, 0.08)',
  inputBg: '#EAF0EB',
  inputBorder: '#C4D5C9',
  textPrimary: '#17271E',
  textSecondary: '#2E523E',
  textMuted: '#47745B',
  accentPrimary: '#16A34A',
  accentHover: '#15803D',
  accentText: '#F5F7F5',
  badgeBg: '#E2ECE4',
  badgeBorder: '#BFD5C5',
  badgeText: '#185033',
  affirmationBg: '#EEF5F0',
  affirmationBorder: '#D4AF37',
  affirmationText: '#153D27',
  affirmationLabel: '#D97706',
  quoteBg: '#EBF2ED',
  quoteBorder: '#CBDCD0',
  quoteText: '#17271E',
  quoteLabel: '#16A34A',
  practiceBg: '#E2ECE4',
  practiceBorder: '#BFD5C5',
  modalOverlay: 'rgba(18, 36, 26, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#16A34A',
  tabActiveBg: '#16A34A',
  tabActiveText: '#F5F7F5',
  tabInactiveBg: '#E2ECE4',
  tabInactiveText: '#2E523E',
};

const sage_dark: ThemePalette = {
  id: 'sage_dark',
  name: 'Early Dusk Forest & Aurora',
  family: 'green',
  familyName: 'Sage & Emerald',
  variant: 'dark',
  icon: '🌲',
  swatchCanvas: '#1E2522',
  swatchCard: '#27312C',
  swatchAccent: '#4ADE80',
  subtitle: 'Early dusk evergreen, aurora green sky & warm gold accents',
  canvas: '#1E2522',
  topBar: '#242D29',
  topBarBorder: '#394A42',
  card: '#27312C',
  cardBorder: '#3F5249',
  cardShadow: 'rgba(8, 14, 10, 0.35)',
  inputBg: '#212A26',
  inputBorder: '#3F5249',
  textPrimary: '#FAF6ED',
  textSecondary: '#CDE1D6',
  textMuted: '#4ADE80',
  accentPrimary: '#4ADE80',
  accentHover: '#22C55E',
  accentText: '#1E2522',
  badgeBg: '#314039',
  badgeBorder: '#475C52',
  badgeText: '#FDE68A',
  affirmationBg: '#2B3731',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#232E28',
  quoteBorder: '#3F5249',
  quoteText: '#E6F3EC',
  quoteLabel: '#4ADE80',
  practiceBg: '#2E3D36',
  practiceBorder: '#445A4F',
  modalOverlay: 'rgba(8, 14, 10, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#4ADE80',
  tabActiveBg: '#4ADE80',
  tabActiveText: '#1E2522',
  tabInactiveBg: '#27312C',
  tabInactiveText: '#CDE1D6',
};

// 4. TEAL & LAGOON
const teal_light: ThemePalette = {
  id: 'teal_light',
  name: 'Turquoise & Ivory Mist',
  family: 'teal',
  familyName: 'Teal & Lagoon',
  variant: 'light',
  icon: '🌊',
  swatchCanvas: '#F4F8F7',
  swatchCard: '#FAFDFB',
  swatchAccent: '#0D9488',
  subtitle: 'Vivid turquoise lagoon, soft ivory & sunset gold shimmer',
  canvas: '#F4F8F7',
  topBar: '#EDF5F3',
  topBarBorder: '#D0E3DF',
  card: '#FAFDFB',
  cardBorder: '#D3E6E2',
  cardShadow: 'rgba(15, 120, 110, 0.08)',
  inputBg: '#EBF4F2',
  inputBorder: '#C1DDD7',
  textPrimary: '#112C2B',
  textSecondary: '#255D5A',
  textMuted: '#387F7B',
  accentPrimary: '#0D9488',
  accentHover: '#0F766E',
  accentText: '#F4F8F7',
  badgeBg: '#E2F0ED',
  badgeBorder: '#BFDED8',
  badgeText: '#135853',
  affirmationBg: '#F0F8F6',
  affirmationBorder: '#D4AF37',
  affirmationText: '#103F3C',
  affirmationLabel: '#D97706',
  quoteBg: '#ECF5F3',
  quoteBorder: '#CCE3DF',
  quoteText: '#112C2B',
  quoteLabel: '#0D9488',
  practiceBg: '#E2F0ED',
  practiceBorder: '#BFDED8',
  modalOverlay: 'rgba(14, 36, 35, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#0D9488',
  tabActiveBg: '#0D9488',
  tabActiveText: '#F4F8F7',
  tabInactiveBg: '#E2F0ED',
  tabInactiveText: '#255D5A',
};

const teal_dark: ThemePalette = {
  id: 'teal_dark',
  name: 'Early Dusk Teal & Aurora',
  family: 'teal',
  familyName: 'Teal & Lagoon',
  variant: 'dark',
  icon: '🪸',
  swatchCanvas: '#1A2525',
  swatchCard: '#233232',
  swatchAccent: '#2DD4BF',
  subtitle: 'Early dusk lagoon, polar aurora teal & warm starlight',
  canvas: '#1A2525',
  topBar: '#202E2E',
  topBarBorder: '#354B4B',
  card: '#233232',
  cardBorder: '#3B5454',
  cardShadow: 'rgba(8, 14, 14, 0.35)',
  inputBg: '#1D2A2A',
  inputBorder: '#3B5454',
  textPrimary: '#FAF6ED',
  textSecondary: '#C9E6E3',
  textMuted: '#2DD4BF',
  accentPrimary: '#2DD4BF',
  accentHover: '#14B8A6',
  accentText: '#1A2525',
  badgeBg: '#2D4141',
  badgeBorder: '#435E5E',
  badgeText: '#FDE68A',
  affirmationBg: '#263737',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#202E2E',
  quoteBorder: '#3B5454',
  quoteText: '#E3F6F4',
  quoteLabel: '#2DD4BF',
  practiceBg: '#2B3E3E',
  practiceBorder: '#3F5B5B',
  modalOverlay: 'rgba(8, 14, 14, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#2DD4BF',
  tabActiveBg: '#2DD4BF',
  tabActiveText: '#1A2525',
  tabInactiveBg: '#233232',
  tabInactiveText: '#C9E6E3',
};

// 5. OCEAN & SKY
const mist: ThemePalette = {
  id: 'mist',
  name: 'Ocean Mist & Ivory',
  family: 'blue',
  familyName: 'Ocean & Sky',
  variant: 'light',
  icon: '🔷',
  swatchCanvas: '#F5F7FA',
  swatchCard: '#FAFCFD',
  swatchAccent: '#2563EB',
  subtitle: 'Coastal cerulean sky, soft ivory & sunset gold glow',
  canvas: '#F5F7FA',
  topBar: '#EEF2F7',
  topBarBorder: '#D0DBE8',
  card: '#FAFCFD',
  cardBorder: '#D5E0EC',
  cardShadow: 'rgba(30, 80, 160, 0.08)',
  inputBg: '#ECF1F7',
  inputBorder: '#C3D4E5',
  textPrimary: '#152238',
  textSecondary: '#294875',
  textMuted: '#42689F',
  accentPrimary: '#1D4ED8',
  accentHover: '#1D4ED8',
  accentText: '#F5F7FA',
  badgeBg: '#E3EDF8',
  badgeBorder: '#BCD2EC',
  badgeText: '#1E40AF',
  affirmationBg: '#F0F5FA',
  affirmationBorder: '#D4AF37',
  affirmationText: '#13356D',
  affirmationLabel: '#92400E',
  quoteBg: '#EDF3F9',
  quoteBorder: '#CDDEEE',
  quoteText: '#152238',
  quoteLabel: '#1D4ED8',
  practiceBg: '#E3EDF8',
  practiceBorder: '#BCD2EC',
  modalOverlay: 'rgba(16, 28, 48, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#1D4ED8',
  tabActiveBg: '#1D4ED8',
  tabActiveText: '#F5F7FA',
  tabInactiveBg: '#E3EDF8',
  tabInactiveText: '#294875',
};

const deep_sea: ThemePalette = {
  id: 'deep_sea',
  name: 'Early Dusk Nautical & Aurora',
  family: 'blue',
  familyName: 'Ocean & Sky',
  variant: 'dark',
  icon: '⚓',
  swatchCanvas: '#1D2330',
  swatchCard: '#252D3E',
  swatchAccent: '#60A5FA',
  subtitle: 'Early dusk twilight navy, shimmering aurora sky & warm gold',
  canvas: '#1D2330',
  topBar: '#232A3B',
  topBarBorder: '#39455E',
  card: '#252D3E',
  cardBorder: '#3E4C67',
  cardShadow: 'rgba(8, 12, 18, 0.35)',
  inputBg: '#202736',
  inputBorder: '#3E4C67',
  textPrimary: '#FAF6ED',
  textSecondary: '#CCD7EB',
  textMuted: '#60A5FA',
  accentPrimary: '#60A5FA',
  accentHover: '#3B82F6',
  accentText: '#1D2330',
  badgeBg: '#303B52',
  badgeBorder: '#475677',
  badgeText: '#FDE68A',
  affirmationBg: '#293245',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#222938',
  quoteBorder: '#3E4C67',
  quoteText: '#E6EDF8',
  quoteLabel: '#60A5FA',
  practiceBg: '#2C374D',
  practiceBorder: '#425372',
  modalOverlay: 'rgba(8, 12, 18, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#60A5FA',
  tabActiveBg: '#60A5FA',
  tabActiveText: '#1D2330',
  tabInactiveBg: '#252D3E',
  tabInactiveText: '#CCD7EB',
};

// 6. TWILIGHT & LAVENDER
const lavender_light: ThemePalette = {
  id: 'lavender_light',
  name: 'Sunset Twilight & Ivory',
  family: 'purple',
  familyName: 'Twilight & Lavender',
  variant: 'light',
  icon: '🪻',
  swatchCanvas: '#F8F5FA',
  swatchCard: '#FDFBFD',
  swatchAccent: '#7C3AED',
  subtitle: 'Flowy sunset orchid, royal periwinkle, soft ivory & gold shimmer',
  canvas: '#F8F5FA',
  topBar: '#F3EEF7',
  topBarBorder: '#DDD2E7',
  card: '#FDFBFD',
  cardBorder: '#E0D5EB',
  cardShadow: 'rgba(80, 30, 130, 0.08)',
  inputBg: '#F1EBF6',
  inputBorder: '#D3C3E3',
  textPrimary: '#261735',
  textSecondary: '#5A2E7D',
  textMuted: '#7D47A6',
  accentPrimary: '#7C3AED',
  accentHover: '#6D28D9',
  accentText: '#F8F5FA',
  badgeBg: '#EBDEF5',
  badgeBorder: '#D0BDE3',
  badgeText: '#5A2285',
  affirmationBg: '#F5EEFA',
  affirmationBorder: '#D4AF37',
  affirmationText: '#3B125C',
  affirmationLabel: '#D97706',
  quoteBg: '#F2EAF7',
  quoteBorder: '#DBC9EB',
  quoteText: '#261735',
  quoteLabel: '#7C3AED',
  practiceBg: '#EBDEF5',
  practiceBorder: '#D0BDE3',
  modalOverlay: 'rgba(32, 14, 46, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#7C3AED',
  tabActiveBg: '#7C3AED',
  tabActiveText: '#F8F5FA',
  tabInactiveBg: '#EBDEF5',
  tabInactiveText: '#5A2E7D',
};

const lavender_dark: ThemePalette = {
  id: 'lavender_dark',
  name: 'Early Dusk Twilight & Gold',
  family: 'purple',
  familyName: 'Twilight & Lavender',
  variant: 'dark',
  icon: '🔮',
  swatchCanvas: '#221B2A',
  swatchCard: '#2E2439',
  swatchAccent: '#C084FC',
  subtitle: 'Early dusk velvet, sunset purple hues & golden stars',
  canvas: '#221B2A',
  topBar: '#282032',
  topBarBorder: '#433452',
  card: '#2E2439',
  cardBorder: '#4B3B5C',
  cardShadow: 'rgba(12, 8, 18, 0.35)',
  inputBg: '#251E2E',
  inputBorder: '#4B3B5C',
  textPrimary: '#FAF6ED',
  textSecondary: '#DCBEDE',
  textMuted: '#C084FC',
  accentPrimary: '#C084FC',
  accentHover: '#A855F7',
  accentText: '#221B2A',
  badgeBg: '#3B2F49',
  badgeBorder: '#56446B',
  badgeText: '#FDE68A',
  affirmationBg: '#32273F',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#2A2135',
  quoteBorder: '#4B3B5C',
  quoteText: '#F3EBF7',
  quoteLabel: '#C084FC',
  practiceBg: '#362B44',
  practiceBorder: '#503E64',
  modalOverlay: 'rgba(12, 8, 18, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#C084FC',
  tabActiveBg: '#C084FC',
  tabActiveText: '#221B2A',
  tabInactiveBg: '#2E2439',
  tabInactiveText: '#DCBEDE',
};

// 7. SLATE & CHARCOAL
const slate_light: ThemePalette = {
  id: 'slate_light',
  name: 'Slate Mist & Ivory',
  family: 'neutral',
  familyName: 'Slate & Charcoal',
  variant: 'light',
  icon: '🪨',
  swatchCanvas: '#F5F6F8',
  swatchCard: '#FAFBFC',
  swatchAccent: '#0284C7',
  subtitle: 'Soft mist ivory, vivid cyan twilight & warm gold accents',
  canvas: '#F5F6F8',
  topBar: '#EFF1F4',
  topBarBorder: '#D2D7DF',
  card: '#FAFBFC',
  cardBorder: '#D7DCE3',
  cardShadow: 'rgba(20, 30, 45, 0.08)',
  inputBg: '#ECEEF2',
  inputBorder: '#C5CBD5',
  textPrimary: '#16202E',
  textSecondary: '#324256',
  textMuted: '#50637A',
  accentPrimary: '#0284C7',
  accentHover: '#0369A1',
  accentText: '#F5F6F8',
  badgeBg: '#E4E8EE',
  badgeBorder: '#BFCCD8',
  badgeText: '#1E3A5F',
  affirmationBg: '#F1F4F8',
  affirmationBorder: '#D4AF37',
  affirmationText: '#142942',
  affirmationLabel: '#D97706',
  quoteBg: '#EEF1F5',
  quoteBorder: '#CED5E0',
  quoteText: '#16202E',
  quoteLabel: '#0284C7',
  practiceBg: '#E4E8EE',
  practiceBorder: '#BFCCD8',
  modalOverlay: 'rgba(18, 24, 34, 0.65)',
  crisisBg: '#FDF1F0',
  crisisBorder: '#F6C1BC',
  crisisText: '#9F1239',
  crisisAccent: '#0284C7',
  tabActiveBg: '#0284C7',
  tabActiveText: '#F5F6F8',
  tabInactiveBg: '#E4E8EE',
  tabInactiveText: '#324256',
};

const dusk: ThemePalette = {
  id: 'dusk',
  name: 'Early Dusk & Aurora Charcoal',
  family: 'neutral',
  familyName: 'Slate & Charcoal',
  variant: 'dark',
  icon: '🌑',
  swatchCanvas: '#1D222B',
  swatchCard: '#272E3A',
  swatchAccent: '#38BDF8',
  subtitle: 'Early dusk charcoal, glowing aurora sky & warm starlight',
  canvas: '#1D222B',
  topBar: '#232934',
  topBarBorder: '#394353',
  card: '#272E3A',
  cardBorder: '#3D485A',
  cardShadow: 'rgba(8, 10, 14, 0.35)',
  inputBg: '#202630',
  inputBorder: '#3D485A',
  textPrimary: '#FAF6ED',
  textSecondary: '#C8D2DE',
  textMuted: '#38BDF8',
  accentPrimary: '#38BDF8',
  accentHover: '#0EA5E9',
  accentText: '#1D222B',
  badgeBg: '#323B49',
  badgeBorder: '#475468',
  badgeText: '#FDE68A',
  affirmationBg: '#2A3340',
  affirmationBorder: '#FBBF24',
  affirmationText: '#FAF6ED',
  affirmationLabel: '#FBBF24',
  quoteBg: '#222833',
  quoteBorder: '#3D485A',
  quoteText: '#E6EBF2',
  quoteLabel: '#38BDF8',
  practiceBg: '#2E3745',
  practiceBorder: '#435164',
  modalOverlay: 'rgba(8, 10, 14, 0.72)',
  crisisBg: '#3C1F22',
  crisisBorder: '#662D35',
  crisisText: '#FECDD3',
  crisisAccent: '#38BDF8',
  tabActiveBg: '#38BDF8',
  tabActiveText: '#1D222B',
  tabInactiveBg: '#272E3A',
  tabInactiveText: '#C8D2DE',
};

// ============================================================================
// THEMES MAP WITH CONSOLIDATED SPECTRUMS AND BACKWARDS COMPATIBILITY ALIASES
// ============================================================================

export const THEMES: Record<ThemeMode, ThemePalette> = {
  // 1. Rose & Sunset
  rose_light,
  rose_dark,

  // 2. Amber & Earth
  amber_light,
  amber_dark,

  // 3. Sage & Emerald
  sage_light,
  sage_dark,

  // 4. Teal & Lagoon
  teal_light,
  teal_dark,

  // 5. Ocean & Sky
  mist,
  deep_sea,

  // 6. Twilight & Lavender
  lavender_light,
  lavender_dark,

  // 7. Slate & Charcoal
  slate_light,
  dusk,

  // Consolidated legacy aliases for stored preferences & backward compatibility
  ruby_light: rose_light,
  ruby_dark: rose_dark,
  gold_light: amber_light,
  gold_dark: amber_dark,
  linen: amber_light,
  earth_dark: amber_dark,
  indigo_light: lavender_light,
  indigo_dark: lavender_dark,
};

// Legacy single-word and short aliases
(THEMES as any).sage = THEMES.sage_light;
(THEMES as any).clay = THEMES.rose_light;
(THEMES as any).ocean_light = THEMES.mist;
(THEMES as any).ocean_dark = THEMES.deep_sea;

// Curated 14 options for UI selection (7 families x 2 variants)
export const THEME_LIST: ThemePalette[] = [
  // 1. Rose & Sunset
  THEMES.rose_light,
  THEMES.rose_dark,
  // 2. Amber & Earth
  THEMES.amber_light,
  THEMES.amber_dark,
  // 3. Sage & Emerald
  THEMES.sage_light,
  THEMES.sage_dark,
  // 4. Teal & Lagoon
  THEMES.teal_light,
  THEMES.teal_dark,
  // 5. Ocean & Sky
  THEMES.mist,
  THEMES.deep_sea,
  // 6. Twilight & Lavender
  THEMES.lavender_light,
  THEMES.lavender_dark,
  // 7. Slate & Charcoal
  THEMES.slate_light,
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
        if (stored === 'sage') return 'sage_light';
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
