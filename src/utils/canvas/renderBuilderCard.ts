import { IDCardConfig, RenderResult } from '../../types/frame';
import { IDCARD_THEMES, COASTAL_COLORS } from '../../constants/frameStyles';
import { calculateCoverCrop } from '../imageUtils';
import { formatGenerationDate } from '../dateUtils';
import { drawMachineReadableBarcode } from './drawCode128Barcode';
import {
  drawRoundedRect,
  drawTechGrid,
  drawMinimalPalmLeaf,
  drawHHGoaBrushLogo,
  drawCoastalLandscapeArtwork
} from './drawHelpers';

export function drawBuilderCardToCanvas(
  canvas: HTMLCanvasElement,
  userImg: HTMLImageElement,
  config: IDCardConfig,
  targetWidth: number = 2048,
  targetHeight: number = 2560
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

  const scale = targetWidth / 1200;
  const WIDTH = targetWidth;
  const HEIGHT = targetHeight;

  const themeDef = IDCARD_THEMES.find(t => t.id === config.theme) || IDCARD_THEMES[0];
  const tr = config.transform;

  // 1. Midnight Coastal Sunset Background
  ctx.fillStyle = '#040d1a';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Bottom Coastal Landscape Artwork
  drawCoastalLandscapeArtwork(ctx, WIDTH, HEIGHT);

  // Subtle Tech Grid & Palm Accents
  drawTechGrid(ctx, WIDTH, HEIGHT, `${themeDef.accent}0d`, 60 * scale);
  drawMinimalPalmLeaf(ctx, 60 * scale, 140 * scale, 1.8 * scale, -20, `${themeDef.accent}25`);
  drawMinimalPalmLeaf(ctx, WIDTH - 140 * scale, HEIGHT - 180 * scale, 2.0 * scale, 160, `${themeDef.secondaryAccent}20`);

  // 2. Main Card Frame Container (Glassmorphic Event Pass)
  const marginX = 70 * scale;
  const marginY = 70 * scale;
  const cardW = WIDTH - marginX * 2;
  const cardH = HEIGHT - marginY * 2;

  ctx.save();
  ctx.shadowColor = themeDef.accent;
  ctx.shadowBlur = 40 * scale;

  drawRoundedRect(ctx, marginX, marginY, cardW, cardH, 40 * scale);
  ctx.fillStyle = 'rgba(7, 26, 51, 0.88)';
  ctx.fill();

  ctx.lineWidth = 3.5 * scale;
  ctx.strokeStyle = `${themeDef.accent}44`;
  ctx.stroke();
  ctx.restore();

  // 3. Top Holographic Sunset Strip
  ctx.save();
  const holoGrad = ctx.createLinearGradient(marginX, marginY, marginX + cardW, marginY);
  holoGrad.addColorStop(0, themeDef.accent);
  holoGrad.addColorStop(0.33, COASTAL_COLORS.turquoise);
  holoGrad.addColorStop(0.66, COASTAL_COLORS.sunsetOrange);
  holoGrad.addColorStop(1, COASTAL_COLORS.coral);

  ctx.fillStyle = holoGrad;
  drawRoundedRect(ctx, marginX + 2, marginY + 2, cardW - 4, 18 * scale, { tl: 38 * scale, tr: 38 * scale, bl: 0, br: 0 });
  ctx.fill();
  ctx.restore();

  // 4. Card Header: Stylized Brush Logo & Pass Number
  const headerY = marginY + 55 * scale;
  drawHHGoaBrushLogo(ctx, marginX + 35 * scale, headerY - 20 * scale, 0.75 * scale);

  const barcodeText = config.badgeNumber.startsWith('HHGOA26') 
    ? config.badgeNumber 
    : `HHGOA26-${config.badgeNumber}`;

  ctx.save();
  ctx.textAlign = 'right';
  ctx.fillStyle = themeDef.accent;
  ctx.font = `800 24px "Space Grotesk", sans-serif`;
  ctx.fillText(`ID: ${barcodeText}`, marginX + cardW - 40 * scale, headerY + 15 * scale);

  ctx.fillStyle = COASTAL_COLORS.sandCream;
  ctx.font = `700 20px "Space Grotesk", sans-serif`;
  ctx.fillText('VERIFIED BUILDER PASS', marginX + cardW - 40 * scale, headerY + 48 * scale);
  ctx.restore();

  // Header Divider Line
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(marginX + 40 * scale, headerY + 135 * scale);
  ctx.lineTo(marginX + cardW - 40 * scale, headerY + 135 * scale);
  ctx.stroke();
  ctx.restore();

  // 5. Photo Box Section
  const photoBoxSize = 440 * scale;
  const photoX = marginX + 40 * scale;
  const photoY = headerY + 165 * scale;

  // Photo Border
  ctx.save();
  ctx.shadowColor = themeDef.accent;
  ctx.shadowBlur = 30 * scale;

  drawRoundedRect(ctx, photoX, photoY, photoBoxSize, photoBoxSize, 30 * scale);
  ctx.fillStyle = COASTAL_COLORS.deepNavy;
  ctx.fill();

  const photoBorderGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoBoxSize, photoY + photoBoxSize);
  photoBorderGrad.addColorStop(0, themeDef.accent);
  photoBorderGrad.addColorStop(0.5, COASTAL_COLORS.turquoise);
  photoBorderGrad.addColorStop(1, COASTAL_COLORS.sunsetOrange);
  ctx.strokeStyle = photoBorderGrad;
  ctx.lineWidth = 7 * scale;
  ctx.stroke();
  ctx.restore();

  // Clip & Render User Photo
  ctx.save();
  drawRoundedRect(ctx, photoX + 3 * scale, photoY + 3 * scale, photoBoxSize - 6 * scale, photoBoxSize - 6 * scale, 27 * scale);
  ctx.clip();

  const crop = calculateCoverCrop(
    userImg.naturalWidth || userImg.width,
    userImg.naturalHeight || userImg.height,
    photoBoxSize,
    photoBoxSize,
    tr.scale,
    tr.x * (WIDTH / 1000),
    tr.y * (WIDTH / 1000)
  );

  ctx.filter = `brightness(${tr.brightness}%) contrast(${tr.contrast}%)`;
  ctx.translate(photoX + photoBoxSize / 2, photoY + photoBoxSize / 2);
  if (tr.rotation !== 0) {
    ctx.rotate((tr.rotation * Math.PI) / 180);
  }
  ctx.drawImage(
    userImg,
    crop.x - photoBoxSize / 2,
    crop.y - photoBoxSize / 2,
    crop.width,
    crop.height
  );
  ctx.restore();

  // 6. Details Section (Right of photo)
  const infoX = photoX + photoBoxSize + 48 * scale;
  const infoW = marginX + cardW - infoX - 30 * scale;

  // A. BUILDER TITLE TAG
  ctx.save();
  ctx.font = `800 22px "Space Grotesk", sans-serif`;
  const titleText = (config.builderTitle || 'AI ARCHITECT').toUpperCase();
  const titleMetrics = ctx.measureText(titleText);
  const tagW = Math.min(titleMetrics.width + 36 * scale, infoW);
  const tagH = 44 * scale;

  drawRoundedRect(ctx, infoX, photoY + 10 * scale, tagW, tagH, 22 * scale);
  ctx.fillStyle = themeDef.accent;
  ctx.shadowColor = themeDef.accent;
  ctx.shadowBlur = 14 * scale;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = COASTAL_COLORS.deepNavy;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleText, infoX + tagW / 2, photoY + 10 * scale + tagH / 2 + 1);
  ctx.restore();

  // B. NAME
  ctx.save();
  ctx.fillStyle = COASTAL_COLORS.sandCream;
  ctx.font = `800 ${52 * scale}px "Outfit", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const nameStr = config.name || 'Anonymous Hacker';
  ctx.fillText(nameStr, infoX, photoY + 72 * scale, infoW);
  ctx.restore();

  // C. TEAM NAME (Directly without "TEAM:" prefix)
  if (config.teamName) {
    ctx.save();
    ctx.fillStyle = themeDef.accent;
    ctx.font = `700 ${24 * scale}px "Space Grotesk", sans-serif`;
    ctx.fillText(config.teamName.toUpperCase(), infoX, photoY + 138 * scale, infoW);
    ctx.restore();
  }

  // D. STACK / ROLE
  ctx.save();
  const roleY = config.teamName ? photoY + 185 * scale : photoY + 168 * scale;
  ctx.fillStyle = themeDef.accent;
  ctx.font = `700 ${20 * scale}px "Space Grotesk", sans-serif`;
  ctx.fillText('STACK / SPECIALTY', infoX, roleY);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.font = `700 ${26 * scale}px "Plus Jakarta Sans", sans-serif`;
  const roleStr = config.role || 'Full Stack Builder';
  ctx.fillText(roleStr, infoX, roleY + 32 * scale, infoW);
  ctx.restore();

  // E. MOTTO / SLOGAN
  if (config.motto) {
    ctx.save();
    const mottoY = config.teamName ? photoY + 285 * scale : photoY + 275 * scale;
    ctx.fillStyle = 'rgba(255, 241, 208, 0.75)';
    ctx.font = `italic 500 ${22 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`"${config.motto}"`, infoX, mottoY, infoW);
    ctx.restore();
  }

  // F. VENUE & DYNAMIC GENERATION DATE (DD | MONTH YYYY)
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = `600 ${20 * scale}px "Space Grotesk", sans-serif`;
  ctx.fillText('VENUE & DATE', infoX, photoY + 350 * scale);

  ctx.fillStyle = COASTAL_COLORS.sandCream;
  ctx.font = `700 ${25 * scale}px "Space Grotesk", sans-serif`;
  const displayDate = config.generationDate || formatGenerationDate();
  ctx.fillText(`GOA, INDIA  •  ${displayDate}`, infoX, photoY + 382 * scale);
  ctx.restore();

  // 7. Footer & Machine-Readable Code 128 Barcode Section
  const footerY = photoY + photoBoxSize + 30 * scale;
  const barcodeY = footerY + 35 * scale;
  const barcodeH = 110 * scale;

  // Real Machine-Readable Code 128 Barcode
  drawMachineReadableBarcode(
    ctx,
    barcodeText,
    marginX + 50 * scale,
    barcodeY,
    cardW - 100 * scale,
    barcodeH
  );

  // Footer Hashtag & Pass Notice
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = COASTAL_COLORS.sandCream;
  ctx.font = `800 ${28 * scale}px "Space Grotesk", sans-serif`;
  ctx.fillText('#FrameInGoa  •  HH GOA 2026 OFFICIAL BUILDER PASS', WIDTH / 2, barcodeY + barcodeH + 50 * scale);
  ctx.restore();
}

export async function renderBuilderCard(
  userImg: HTMLImageElement,
  config: IDCardConfig,
  targetW: number = 2048,
  targetH: number = 2560
): Promise<RenderResult> {
  const canvas = document.createElement('canvas');
  drawBuilderCardToCanvas(canvas, userImg, config, targetW, targetH);

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
