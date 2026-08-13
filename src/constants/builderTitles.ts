export const PRESET_BUILDER_TITLES = [
  'AI Architect',
  'Code Voyager',
  'Product Hacker',
  'Full Stack Builder',
  'AI Explorer',
  'Creative Technologist',
  'Digital Nomad',
  'Autonomous Agent Craftsman',
  'GPU Whisperer',
  'Protocol Engineer',
  'Web3 Architect',
  'Prompt Wizard',
  'Zero Knowledge Pioneer',
  'Systems Artisan',
  'Frontend Visionary',
  'Deep Learning Dev'
] as const;

export const DEFAULT_ROLES = [
  'Full Stack & AI',
  'LLMs & Autonomous Agents',
  'Rust / Smart Contracts',
  'UI/UX & Mobile',
  'Distributed Systems',
  'Cybersecurity & Infra',
  'Product & Growth'
];

export const PRESET_TEAMS = [
  'Team NeuralSurf',
  'Goa CyberSol',
  'Agents of Goa',
  'Zero Knowledge Crew',
  'Autonomous Syndicate',
  'Wave Hackers'
];

export function getRandomBuilderTitle(): string {
  const index = Math.floor(Math.random() * PRESET_BUILDER_TITLES.length);
  return PRESET_BUILDER_TITLES[index];
}
