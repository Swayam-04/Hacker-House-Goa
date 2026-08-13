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
 * Upload Provider 1: tmpfiles.org (Free Public Image Storage, HTTP 200, CORS enabled)
 */
async function uploadToTmpFiles(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', blob, 'framein-goa-builder.png');

  const res = await fetch('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error(`tmpfiles.org upload status ${res.status}`);
  const json = await res.json();
  if (json && json.status === 'success' && json.data && json.data.url) {
    // Convert view URL to direct download URL (tmpfiles.org/12345 -> tmpfiles.org/dl/12345)
    const viewUrl = json.data.url;
    const directUrl = viewUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
    return directUrl;
  }
  throw new Error('tmpfiles.org returned invalid format');
}

/**
 * Upload Provider 2: Catbox.moe (Permanent Free File Host, Direct CDN)
 */
async function uploadToCatbox(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', blob, 'framein-goa-builder.png');

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error(`Catbox upload status ${res.status}`);
  const url = await res.text();
  if (url && url.startsWith('http')) {
    return url.trim();
  }
  throw new Error('Catbox returned invalid URL');
}

/**
 * Upload Provider 3: ImgBB Public API
 */
async function uploadToImgBB(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('image', blob, 'framein-goa-builder.png');

  const keys = [
    '6d207e02198a847e5b4a06c646980e41',
    '235ca2d95015e34749f76a5a0344d59a'
  ];

  for (const key of keys) {
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && (json.data.url || json.data.display_url)) {
          return json.data.url || json.data.display_url;
        }
      }
    } catch (e) {
      // try next key
    }
  }
  throw new Error('ImgBB storage keys failed');
}

/**
 * Multi-Provider Public Image Storage Uploader
 * Tries Provider 1 (Catbox) -> Provider 2 (tmpfiles.org) -> Provider 3 (ImgBB)
 */
export async function uploadToPublicStorage(blob: Blob): Promise<string> {
  const errors: string[] = [];

  // Try Catbox first
  try {
    console.log('[Share Engine] Attempting upload via Catbox...');
    const catboxUrl = await uploadToCatbox(blob);
    console.log('[Share Engine] Catbox Upload Success:', catboxUrl);
    return catboxUrl;
  } catch (err: any) {
    console.warn('[Share Engine] Catbox Provider failed:', err?.message || err);
    errors.push(`Catbox: ${err?.message}`);
  }

  // Try tmpfiles.org second
  try {
    console.log('[Share Engine] Attempting upload via tmpfiles.org...');
    const tmpUrl = await uploadToTmpFiles(blob);
    console.log('[Share Engine] tmpfiles.org Upload Success:', tmpUrl);
    return tmpUrl;
  } catch (err: any) {
    console.warn('[Share Engine] tmpfiles.org Provider failed:', err?.message || err);
    errors.push(`tmpfiles: ${err?.message}`);
  }

  // Try ImgBB third
  try {
    console.log('[Share Engine] Attempting upload via ImgBB...');
    const imgbbUrl = await uploadToImgBB(blob);
    console.log('[Share Engine] ImgBB Upload Success:', imgbbUrl);
    return imgbbUrl;
  } catch (err: any) {
    console.warn('[Share Engine] ImgBB Provider failed:', err?.message || err);
    errors.push(`ImgBB: ${err?.message}`);
  }

  throw new Error(`All public storage upload providers failed (${errors.join('; ')})`);
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
    console.log('[Share Engine] Reusing cached share result:', cachedShare.result);
    if (onStatusChange) onStatusChange('Reusing existing share link...');
    return cachedShare.result;
  }

  // 2. High-Resolution PNG Render
  if (onStatusChange) onStatusChange('Preparing image...');

  let renderResult;
  if (format === 'PFP_FRAME') {
    renderResult = await renderPFPFrame(userImg, pfpConfig, 2048, 2048);
  } else {
    renderResult = await renderBuilderCard(userImg, idCardConfig, 2048, 2560);
  }

  // 3. Upload to Public Storage
  if (onStatusChange) onStatusChange('Uploading...');

  const publicImageUrl = await uploadToPublicStorage(renderResult.blob);

  // 4. Generate Unique Share ID & Public Share Page URL
  if (onStatusChange) onStatusChange('Creating share link...');

  const shareId = generateUniqueShareId();
  const domain = window.location.origin || 'https://framein-goa.vercel.app';
  
  // Clean Share URL pointing to /share/:shareId
  const shareUrl = `${domain}/share/${shareId}?img=${encodeURIComponent(publicImageUrl)}`;

  const captionText = `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n${shareUrl}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(captionText)}`;

  const result: ShareResult = {
    shareId,
    publicImageUrl,
    shareUrl,
    tweetUrl
  };

  console.log('[Share Engine] Share Preparation Complete:', result);

  // Cache result for current config
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

  if (onStatusChange) onStatusChange('Opening X...');

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
