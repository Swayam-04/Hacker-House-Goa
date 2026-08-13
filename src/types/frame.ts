export type AppFormat = 'PFP_FRAME' | 'ID_CARD';

export interface ImageTransform {
  x: number;          // Horizontal offset in canvas space
  y: number;          // Vertical offset in canvas space
  scale: number;      // 0.5 to 4.0 (default 1.0)
  rotation: number;   // -180 to +180 deg
  brightness: number; // 70% to 130%
  contrast: number;   // 70% to 130%
}

export type PFPShape = 'circle' | 'rounded-square' | 'square';

export type PFPThemeId = 'cyber-wave' | 'sunset-glow' | 'minimal-glass' | 'neon-pulse';

export interface PFPFrameConfig {
  theme: PFPThemeId;
  shape: PFPShape;
  badgeText: string;
  teamName: string;
  showCoordinates: boolean;
  transform: ImageTransform;
  generationDate?: string;
}

export type IDCardThemeId = 'cyber-pass' | 'golden-horizon' | 'terminal-matrix' | 'solar-wave';

export interface IDCardConfig {
  name: string;
  role: string;
  teamName: string;
  builderTitle: string;
  motto: string;
  theme: IDCardThemeId;
  badgeNumber: string;
  transform: ImageTransform;
  generationDate?: string;
}

export interface RenderResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}
