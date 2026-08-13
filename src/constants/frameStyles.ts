import { PFPThemeId, IDCardThemeId } from '../types/frame';

// Coastal Tropical Color Palette System
export const COASTAL_COLORS = {
  deepNavy: '#071a33',
  oceanBlue: '#0b4f71',
  aqua: '#12b8b0',
  turquoise: '#20d4c5',
  coral: '#ff6b5a',
  sunsetOrange: '#ff9a4d',
  warmYellow: '#ffd166',
  sandCream: '#fff1d0'
} as const;

export interface PFPThemeDefinition {
  id: PFPThemeId;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  badgeBg: string;
  gradient: [string, string, string];
}

export const PFP_THEMES: PFPThemeDefinition[] = [
  {
    id: 'cyber-wave',
    name: 'Style 1 — Ocean Cyber',
    description: 'Deep navy, turquoise & aqua with abstract ocean wave curves & tech grid',
    primaryColor: COASTAL_COLORS.turquoise,
    secondaryColor: COASTAL_COLORS.aqua,
    accentColor: COASTAL_COLORS.sandCream,
    badgeBg: 'rgba(7, 26, 51, 0.85)',
    gradient: [COASTAL_COLORS.deepNavy, COASTAL_COLORS.oceanBlue, COASTAL_COLORS.turquoise]
  },
  {
    id: 'sunset-glow',
    name: 'Style 2 — Sunset Horizon',
    description: 'Deep navy, coral & sunset orange gradient ring with subtle sun arc',
    primaryColor: COASTAL_COLORS.sunsetOrange,
    secondaryColor: COASTAL_COLORS.coral,
    accentColor: COASTAL_COLORS.warmYellow,
    badgeBg: 'rgba(7, 26, 51, 0.85)',
    gradient: [COASTAL_COLORS.deepNavy, COASTAL_COLORS.coral, COASTAL_COLORS.sunsetOrange]
  },
  {
    id: 'neon-pulse',
    name: 'Style 3 — Tropical Dusk',
    description: 'Ocean blue, turquoise & cream with minimal palm silhouettes & golden stars',
    primaryColor: COASTAL_COLORS.aqua,
    secondaryColor: COASTAL_COLORS.warmYellow,
    accentColor: COASTAL_COLORS.sandCream,
    badgeBg: 'rgba(11, 79, 113, 0.85)',
    gradient: [COASTAL_COLORS.oceanBlue, COASTAL_COLORS.turquoise, COASTAL_COLORS.sandCream]
  },
  {
    id: 'minimal-glass',
    name: 'Style 4 — Sand & Wave',
    description: 'Cream sand details with subtle navy/cyan coastal borders',
    primaryColor: COASTAL_COLORS.sandCream,
    secondaryColor: COASTAL_COLORS.turquoise,
    accentColor: COASTAL_COLORS.sunsetOrange,
    badgeBg: 'rgba(7, 26, 51, 0.85)',
    gradient: [COASTAL_COLORS.deepNavy, COASTAL_COLORS.oceanBlue, COASTAL_COLORS.sandCream]
  }
];

export interface IDCardThemeDefinition {
  id: IDCardThemeId;
  name: string;
  description: string;
  accent: string;
  secondaryAccent: string;
  bgGradient: [string, string, string];
}

export const IDCARD_THEMES: IDCardThemeDefinition[] = [
  {
    id: 'cyber-pass',
    name: 'Style 1 — Ocean Pass',
    description: 'Deep navy & turquoise coastal festival badge',
    accent: COASTAL_COLORS.turquoise,
    secondaryAccent: COASTAL_COLORS.aqua,
    bgGradient: [COASTAL_COLORS.deepNavy, COASTAL_COLORS.oceanBlue, '#040d1a']
  },
  {
    id: 'golden-horizon',
    name: 'Style 2 — Sunset Pass',
    description: 'Warm coral, sunset orange & golden yellow VIP pass',
    accent: COASTAL_COLORS.sunsetOrange,
    secondaryAccent: COASTAL_COLORS.coral,
    bgGradient: [COASTAL_COLORS.deepNavy, '#24101d', '#3b1419']
  },
  {
    id: 'terminal-matrix',
    name: 'Style 3 — Tropical Pass',
    description: 'Aqua & sand cream developer pass',
    accent: COASTAL_COLORS.aqua,
    secondaryAccent: COASTAL_COLORS.sandCream,
    bgGradient: ['#051c24', COASTAL_COLORS.oceanBlue, COASTAL_COLORS.deepNavy]
  },
  {
    id: 'solar-wave',
    name: 'Style 4 — Solar Dusk',
    description: 'Deep ocean violet & sunset gradient pass',
    accent: COASTAL_COLORS.coral,
    secondaryAccent: COASTAL_COLORS.warmYellow,
    bgGradient: ['#130a24', '#2d1136', COASTAL_COLORS.deepNavy]
  }
];

export const PRESET_BADGE_TEXTS = [
  'HH GOA 2026 BUILDER',
  'SELECTED BUILDER',
  'GOA HACKERHOUSE',
  'AI REVOLUTION 2026',
  'COASTAL HACKER'
];
