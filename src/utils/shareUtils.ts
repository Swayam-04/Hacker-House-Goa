import { AppFormat, PFPFrameConfig, IDCardConfig } from '../types/frame';
import { renderPFPFrame } from './canvas/renderPFPFrame';
import { renderBuilderCard } from './canvas/renderBuilderCard';

export interface ShareResult {
  shareId: string;
  publicImageUrl: string;
  shareUrl: string;
  tweetUrl: string;
}

// In-memory cache for avoiding duplicate uploads
interface CachedShare {
  configHash: string;
  result: ShareResult;
}

let cachedShare: CachedShare | null = null;

/**
 * Computes a deterministic state hash from current editor configuration
 */
export function computeConfigHash(
  format: AppFormat,
  userImg: HTMLImageElement | null,
  pfpConfig: PFPFrameConfig,
  idCardConfig: IDCardConfig
): string {
  if (!userImg) return 'no-image';

  const imgSource = userImg.src || userImg.currentSrc || 'img';
  const imgState = `${imgSource.substring(0, 100)}_${userImg.naturalWidth}x${userImg.naturalHeight}`;

  if (format === 'PFP_FRAME') {
    const tr = pfpConfig.transform;
    return `PFP_${pfpConfig.theme}_${pfpConfig.shape}_${pfpConfig.badgeText}_${pfpConfig.teamName}_${pfpConfig.showCoordinates}_${tr.scale}_${tr.x}_${tr.y}_${tr.rotation}_${tr.brightness}_${tr.contrast}_${imgState}`;
  } else {
    const tr = idCardConfig.transform;
    return `IDCARD_${idCardConfig.theme}_${idCardConfig.name}_${idCardConfig.role}_${idCardConfig.builderTitle}_${idCardConfig.badgeNumber}_${idCardConfig.teamName}_${tr.scale}_${tr.x}_${tr.y}_${tr.rotation}_${imgState}`;
  }
}

/**
 * Generates a unique share ID (e.g. HHGOA26-8F42K7)
 */
export function generateUniqueShareId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HHGOA26-${randomStr}`;
}

/**
 * Uploads a PNG blob to public cloud image host (ImgBB)
 */
async function uploadToPublicStorage(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('image', blob, 'framein-goa-builder.png');

  // Primary: Upload via ImgBB Public API
  const response = await fetch('https://api.imgbb.com/1/upload?key=6d207e02198a847e5b4a06c646980e41', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Public storage upload failed (${response.status})`);
  }

  const json = await response.json();
  if (json && json.data && (json.data.url || json.data.display_url)) {
    return json.data.url || json.data.display_url;
  }

  throw new Error('Image storage service returned invalid response');
}

/**
 * Prepares the complete X Share payload — renders high-res PNG, uploads to public storage,
 * generates unique share URL with OG tags, and constructs X Tweet intent URL.
 */
export async function prepareXShare(
  userImg: HTMLImageElement,
  format: AppFormat,
  pfpConfig: PFPFrameConfig,
  idCardConfig: IDCardConfig,
  onStatusChange?: (statusText: string) => void
): Promise<ShareResult> {
  // 1. Check if cached share exists for current exact config
  const currentHash = computeConfigHash(format, userImg, pfpConfig, idCardConfig);

  if (cachedShare && cachedShare.configHash === currentHash) {
    if (onStatusChange) onStatusChange('Reusing existing share link...');
    return cachedShare.result;
  }

  // 2. High-Resolution PNG Render
  if (onStatusChange) onStatusChange('Preparing high-resolution graphic...');

  let renderResult;
  if (format === 'PFP_FRAME') {
    renderResult = await renderPFPFrame(userImg, pfpConfig, 2048, 2048);
  } else {
    renderResult = await renderBuilderCard(userImg, idCardConfig, 2048, 2560);
  }

  // 3. Upload to Public Storage
  if (onStatusChange) onStatusChange('Creating public share link...');

  const publicImageUrl = await uploadToPublicStorage(renderResult.blob);

  // 4. Generate Unique Share ID & URLs
  const shareId = generateUniqueShareId();
  const domain = window.location.origin || 'https://framein-goa.vercel.app';
  const shareUrl = `${domain}/share/${shareId}?img=${encodeURIComponent(publicImageUrl)}`;

  const captionText = `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n${shareUrl}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(captionText)}`;

  const result: ShareResult = {
    shareId,
    publicImageUrl,
    shareUrl,
    tweetUrl
  };

  // Cache result
  cachedShare = {
    configHash: currentHash,
    result
  };

  return result;
}

/**
 * Triggers automatic X sharing workflow
 */
export async function executeXPostFlow(
  userImg: HTMLImageElement,
  format: AppFormat,
  pfpConfig: PFPFrameConfig,
  idCardConfig: IDCardConfig,
  onStatusChange?: (statusText: string) => void
): Promise<ShareResult> {
  const shareResult = await prepareXShare(userImg, format, pfpConfig, idCardConfig, onStatusChange);

  // Open X Composer in new window / tab
  const width = 600;
  const height = 650;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    shareResult.tweetUrl,
    '_blank',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
  );

  return shareResult;
}
