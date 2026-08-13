import { AppFormat, PFPFrameConfig, IDCardConfig } from '../types/frame';
import { renderPFPFrame } from './canvas/renderPFPFrame';
import { renderBuilderCard } from './canvas/renderBuilderCard';

export interface ShareResult {
  shareId: string;
  publicImageUrl: string;
  shareUrl: string;
  tweetUrl: string;
  pngBlob: Blob;
  pngFileName: string;
}

// In-memory cache for avoiding duplicate uploads
interface CachedShare {
  configHash: string;
  result: ShareResult;
}

let cachedShare: CachedShare | null = null;

/**
 * Checks if current browser/device supports Web Share API with File attachments (e.g. Mobile Chrome / Safari)
 */
export function canNativeShareFiles(file?: File): boolean {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    const testFile = file || new File(['test'], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [testFile] });
  } catch (e) {
    return false;
  }
}

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
 * Upload Provider 1: Catbox.moe (Permanent Free File Host, Direct CDN)
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
 * Upload Provider 2: tmpfiles.org (Free Public Image Storage)
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
    const viewUrl = json.data.url;
    return viewUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  }
  throw new Error('tmpfiles.org returned invalid format');
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
      // ignore
    }
  }
  throw new Error('ImgBB storage keys failed');
}

/**
 * Multi-Provider Public Image Storage Uploader
 */
export async function uploadToPublicStorage(blob: Blob): Promise<string> {
  const errors: string[] = [];

  try {
    console.log('[Share Engine] Attempting upload via Catbox...');
    const catboxUrl = await uploadToCatbox(blob);
    console.log('[Share Engine] Catbox Upload Success:', catboxUrl);
    return catboxUrl;
  } catch (err: any) {
    console.warn('[Share Engine] Catbox failed:', err?.message || err);
    errors.push(`Catbox: ${err?.message}`);
  }

  try {
    console.log('[Share Engine] Attempting upload via tmpfiles.org...');
    const tmpUrl = await uploadToTmpFiles(blob);
    console.log('[Share Engine] tmpfiles Upload Success:', tmpUrl);
    return tmpUrl;
  } catch (err: any) {
    console.warn('[Share Engine] tmpfiles failed:', err?.message || err);
    errors.push(`tmpfiles: ${err?.message}`);
  }

  try {
    console.log('[Share Engine] Attempting upload via ImgBB...');
    const imgbbUrl = await uploadToImgBB(blob);
    console.log('[Share Engine] ImgBB Upload Success:', imgbbUrl);
    return imgbbUrl;
  } catch (err: any) {
    console.warn('[Share Engine] ImgBB failed:', err?.message || err);
    errors.push(`ImgBB: ${err?.message}`);
  }

  throw new Error(`All public storage upload providers failed (${errors.join('; ')})`);
}

/**
 * Prepares high-resolution PNG and creates public share URL
 */
export async function prepareXShare(
  userImg: HTMLImageElement,
  format: AppFormat,
  pfpConfig: PFPFrameConfig,
  idCardConfig: IDCardConfig,
  onStatusChange?: (statusText: string) => void
): Promise<ShareResult> {
  const currentHash = computeConfigHash(format, userImg, pfpConfig, idCardConfig);

  if (cachedShare && cachedShare.configHash === currentHash) {
    console.log('[Share Engine] Reusing cached share result:', cachedShare.result);
    if (onStatusChange) onStatusChange('Reusing existing share link...');
    return cachedShare.result;
  }

  if (onStatusChange) onStatusChange('Preparing image...');

  let renderResult;
  let pngFileName: string;
  if (format === 'PFP_FRAME') {
    renderResult = await renderPFPFrame(userImg, pfpConfig, 2048, 2048);
    pngFileName = 'HH_Goa_2026_PFP_Frame_2048px.png';
  } else {
    renderResult = await renderBuilderCard(userImg, idCardConfig, 2048, 2560);
    pngFileName = `HH_Goa_2026_${idCardConfig.name.replace(/\s+/g, '_')}_ID_Card_2048px.png`;
  }

  if (onStatusChange) onStatusChange('Uploading...');

  const publicImageUrl = await uploadToPublicStorage(renderResult.blob);

  if (onStatusChange) onStatusChange('Creating share link...');

  const shareId = generateUniqueShareId();
  const domain = window.location.origin || 'https://framein-goa.vercel.app';
  const shareUrl = `${domain}/share/${shareId}?img=${encodeURIComponent(publicImageUrl)}`;

  const captionText = `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n${shareUrl}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(captionText)}`;

  const result: ShareResult = {
    shareId,
    publicImageUrl,
    shareUrl,
    tweetUrl,
    pngBlob: renderResult.blob,
    pngFileName
  };

  console.log('[Share Engine] Preparation Complete:', result);

  cachedShare = {
    configHash: currentHash,
    result
  };

  return result;
}

/**
 * Native Mobile Web Share API — Shares actual PNG image file + caption + share URL
 */
export async function executeNativeFileShare(
  blob: Blob,
  shareUrl: string,
  fileName: string = 'HH_Goa_2026_Builder_Frame.png'
): Promise<boolean> {
  const file = new File([blob], fileName, { type: 'image/png' });
  const captionText = `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n${shareUrl}`;

  if (canNativeShareFiles(file)) {
    try {
      await navigator.share({
        files: [file],
        text: captionText
      });
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('[Native Share Aborted/Failed]', err);
      }
      return false;
    }
  }
  return false;
}
