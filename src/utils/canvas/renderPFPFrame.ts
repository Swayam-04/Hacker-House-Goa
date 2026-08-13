import { PFPFrameConfig, RenderResult } from '../../types/frame';
import { PFP_THEMES } from '../../constants/frameStyles';
import { calculateCoverCrop } from '../imageUtils';
import { formatGenerationDate } from '../dateUtils';
import {
  drawRoundedRect,
  drawTechGrid,
  drawHHGoaBrushLogo,
  drawGoaDateBadgeBox,
  drawCurvedTextOnRing,
  drawCoastalLandscapeArtwork,
  drawPremiumEventBottomBadge
} from './drawHelpers';

export function drawPFPFrameToCanvas(
  canvas: HTMLCanvasElement,
  userImg: HTMLImageElement,
  config: PFPFrameConfig,
  targetWidth: number = 2048,
  targetHeight: number = 2048
): void {
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // 0. ALWAYS CLEAR CANVAS FIRST (Prevents ghosting / duplicate pixel accumulation)
  ctx.clearRect(0, 0, targetWidth, targetHeight);

  // High-Quality Image Smoothing Setup
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const SIZE = targetWidth;
  const themeDef = PFP_THEMES.find(t => t.id === config.theme) || PFP_THEMES[0];
  const tr = config.transform;

  const primaryCol = themeDef.primaryColor;
  const secondaryCol = themeDef.secondaryColor;

  // 1. Deep Midnight Ocean Background
  ctx.fillStyle = '#040d1a';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 2. Bottom Coastal Sunset & Wave Landscape Artwork with Selected Theme Colors
  drawCoastalLandscapeArtwork(ctx, SIZE, SIZE, primaryCol, secondaryCol);

  // 3. Subtle Tech Grid Pattern
  drawTechGrid(ctx, SIZE, SIZE, `${primaryCol}12`, 70);

  // Avatar Container Bounds
  const borderMargin = 175;
  const avatarBoxSize = SIZE - borderMargin * 2;
  const avatarCenterX = SIZE / 2;
  const avatarCenterY = SIZE / 2 - 20;

  // 4. Draw Avatar Mask & User Photo
  ctx.save();

  if (config.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarBoxSize / 2, 0, Math.PI * 2);
    ctx.clip();
  } else if (config.shape === 'rounded-square') {
    drawRoundedRect(
      ctx,
      avatarCenterX - avatarBoxSize / 2,
      avatarCenterY - avatarBoxSize / 2,
      avatarBoxSize,
      avatarBoxSize,
      140
    );
    ctx.clip();
  } else {
    ctx.rect(
      avatarCenterX - avatarBoxSize / 2,
      avatarCenterY - avatarBoxSize / 2,
      avatarBoxSize,
      avatarBoxSize
    );
    ctx.clip();
  }

  // Cover Crop math with scale & offsets
  const crop = calculateCoverCrop(
    userImg.naturalWidth || userImg.width,
    userImg.naturalHeight || userImg.height,
    avatarBoxSize,
    avatarBoxSize,
    tr.scale,
    tr.x * (SIZE / 1000),
    tr.y * (SIZE / 1000)
  );

  ctx.filter = `brightness(${tr.brightness}%) contrast(${tr.contrast}%)`;
  ctx.translate(avatarCenterX, avatarCenterY);
  if (tr.rotation !== 0) {
    ctx.rotate((tr.rotation * Math.PI) / 180);
  }

  ctx.drawImage(
    userImg,
    crop.x - avatarBoxSize / 2,
    crop.y - avatarBoxSize / 2,
    crop.width,
    crop.height
  );

  ctx.restore(); // Restore clip & filter

  // 5. Double Neon Glowing Circular Ring with Dynamic Theme Colors
  ctx.save();
  
  // Outer Ring 1
  ctx.lineWidth = 26;
  ctx.strokeStyle = primaryCol;
  ctx.shadowColor = primaryCol;
  ctx.shadowBlur = 35;

  if (config.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarBoxSize / 2 + 13, 0, Math.PI * 2);
    ctx.stroke();
  } else if (config.shape === 'rounded-square') {
    drawRoundedRect(
      ctx,
      avatarCenterX - avatarBoxSize / 2 - 13,
      avatarCenterY - avatarBoxSize / 2 - 13,
      avatarBoxSize + 26,
      avatarBoxSize + 26,
      153
    );
    ctx.stroke();
  } else {
    ctx.strokeRect(
      avatarCenterX - avatarBoxSize / 2 - 13,
      avatarCenterY - avatarBoxSize / 2 - 13,
      avatarBoxSize + 26,
      avatarBoxSize + 26
    );
  }

  // Inner Accent Ring 2
  ctx.lineWidth = 8;
  ctx.strokeStyle = secondaryCol;
  ctx.shadowColor = secondaryCol;
  ctx.shadowBlur = 18;

  if (config.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarBoxSize / 2 + 30, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // 6. Curved Border Text ("BUILD • CONNECT • CREATE ///")
  if (config.shape === 'circle') {
    drawCurvedTextOnRing(
      ctx,
      'BUILD • CONNECT • CREATE ///',
      avatarCenterX,
      avatarCenterY,
      avatarBoxSize / 2 + 48,
      Math.PI * 0.72,
      primaryCol
    );
  }

  // Right Side Border Tech Tick Marks (/// ///)
  ctx.save();
  ctx.fillStyle = primaryCol;
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.shadowColor = primaryCol;
  ctx.shadowBlur = 10;
  ctx.textAlign = 'center';
  ctx.fillText('///', avatarCenterX + avatarBoxSize / 2 + 35, avatarCenterY - 180);
  ctx.fillText('///', avatarCenterX + avatarBoxSize / 2 + 35, avatarCenterY - 140);
  ctx.restore();

  // 7. Top-Left Stylized HH GOA 2026 Brush Logo
  drawHHGoaBrushLogo(ctx, 80, 75, 1.05, primaryCol, secondaryCol);

  // 8. Top-Right Dynamic Date Badge Box
  const displayDate = config.generationDate || formatGenerationDate();
  drawGoaDateBadgeBox(ctx, SIZE - 85, 75, displayDate, 1.05, primaryCol);

  // 9. SINGLE SOURCE OF TRUTH: LARGE PREMIUM EVENT BOTTOM BADGE
  drawPremiumEventBottomBadge(
    ctx,
    avatarCenterX,
    1815,
    config.badgeText || 'BUILDER',
    config.teamName || 'INFINIX',
    primaryCol,
    secondaryCol
  );

  // 10. High-Contrast Geo Coordinates Glass Badge in Bottom Corner
  if (config.showCoordinates) {
    ctx.save();
    const coordText = '15.2993° N, 74.1240° E  🌴';
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    const textMetrics = ctx.measureText(coordText);
    const pillW = textMetrics.width + 36;
    const pillH = 50;
    const pillX = SIZE - 70 - pillW;
    const pillY = SIZE - 80;

    // Dark Glass Box Backdrop
    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 25);
    ctx.fillStyle = 'rgba(7, 26, 51, 0.92)';
    ctx.shadowColor = primaryCol;
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = primaryCol;
    ctx.stroke();

    // Bright White Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(coordText, pillX + pillW / 2, pillY + pillH / 2 + 1);
    ctx.restore();
  }
}

export async function renderPFPFrame(
  userImg: HTMLImageElement,
  config: PFPFrameConfig,
  targetW: number = 2048,
  targetH: number = 2048
): Promise<RenderResult> {
  const canvas = document.createElement('canvas');
  drawPFPFrameToCanvas(canvas, userImg, config, targetW, targetH);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Canvas toBlob failed'));
    }, 'image/png', 1.0);
  });

  return {
    blob,
    dataUrl: canvas.toDataURL('image/png'),
    width: canvas.width,
    height: canvas.height
  };
}
