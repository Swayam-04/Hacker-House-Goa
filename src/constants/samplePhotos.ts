export interface SampleAvatar {
  id: string;
  name: string;
  role: string;
  title: string;
  avatarUrl: string;
}

// Crisp inline SVG avatars as data URLs for instant offline demo testing
function createSvgAvatar(bg: string, fg: string, hair: string, glassesColor?: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="${fg}" />
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#bg)"/>
    <!-- Palm leaf motif background -->
    <path d="M50 350 Q 150 200 350 350" stroke="rgba(255,255,255,0.08)" stroke-width="12" fill="none"/>
    <path d="M50 380 Q 200 150 380 300" stroke="rgba(255,255,255,0.05)" stroke-width="8" fill="none"/>
    
    <!-- Body / Shoulders -->
    <path d="M 80 400 C 80 290, 320 290, 320 400 Z" fill="#1e293b"/>
    <path d="M 120 400 L 200 310 L 280 400 Z" fill="#334155"/>

    <!-- Neck & Face -->
    <rect x="175" y="220" width="50" height="60" rx="10" fill="#f87171"/>
    <ellipse cx="200" cy="180" rx="75" ry="90" fill="#fb923c"/>
    
    <!-- Hair -->
    <path d="M 120 180 C 120 90, 280 90, 280 180 C 270 120, 130 120, 120 180 Z" fill="${hair}"/>
    
    <!-- Eyes / Glasses -->
    ${glassesColor ? `
      <rect x="145" y="165" width="45" height="30" rx="6" fill="none" stroke="${glassesColor}" stroke-width="6"/>
      <rect x="210" y="165" width="45" height="30" rx="6" fill="none" stroke="${glassesColor}" stroke-width="6"/>
      <line x1="190" y1="180" x2="210" y2="180" stroke="${glassesColor}" stroke-width="6"/>
    ` : `
      <circle cx="165" cy="175" r="8" fill="#1e1b4b"/>
      <circle cx="235" cy="175" r="8" fill="#1e1b4b"/>
    `}
    
    <!-- Smile -->
    <path d="M 175 220 Q 200 240 225 220" stroke="#7c2d12" stroke-width="5" fill="none" stroke-linecap="round"/>

    <!-- Glowing Tech Badge Overlay -->
    <circle cx="340" cy="60" r="24" fill="#06b6d4"/>
    <text x="340" y="66" font-family="sans-serif" font-size="14" font-weight="bold" fill="#000" text-anchor="middle">GOA</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_AVATARS: SampleAvatar[] = [
  {
    id: 'sample-1',
    name: 'Aarav Sharma',
    role: 'AI & Autonomous Agents',
    title: 'AI Architect',
    avatarUrl: createSvgAvatar('#0f172a', '#1e1b4b', '#0f172a', '#06b6d4')
  },
  {
    id: 'sample-2',
    name: 'Sophia Chen',
    role: 'Full Stack & Web3',
    title: 'Product Hacker',
    avatarUrl: createSvgAvatar('#831843', '#4c1d95', '#1e1b4b', '#f97316')
  },
  {
    id: 'sample-3',
    name: 'Vikram Patel',
    role: 'Rust & Protocol Dev',
    title: 'Code Voyager',
    avatarUrl: createSvgAvatar('#064e3b', '#0284c7', '#090d16', '#22c3ee')
  }
];
