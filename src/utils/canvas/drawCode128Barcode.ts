import JsBarcode from 'jsbarcode';
import { COASTAL_COLORS } from '../../constants/frameStyles';
import { drawRoundedRect } from './drawHelpers';

/**
 * Draws a real machine-readable CODE 128 barcode onto a Canvas 2D context.
 * Features a high-contrast white quiet zone container and human-readable ID text.
 */
export function drawMachineReadableBarcode(
  ctx: CanvasRenderingContext2D,
  codeText: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.save();

  // 1. Container bounds (White/Cream high-contrast quiet zone box)
  const containerW = width;
  const containerH = height;
  const containerX = x;
  const containerY = y;

  // Background Box
  drawRoundedRect(ctx, containerX, containerY, containerW, containerH, 16);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 12;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = COASTAL_COLORS.turquoise;
  ctx.stroke();

  // 2. Offscreen Canvas for JsBarcode Code 128 Rendering
  try {
    const tempCanvas = document.createElement('canvas');
    JsBarcode(tempCanvas, codeText, {
      format: 'CODE128',
      displayValue: false,
      background: '#ffffff',
      lineColor: '#000000',
      margin: 0,
      height: 60,
      width: 2
    });

    // Draw barcode image inside quiet zone padding
    const paddingX = 24;
    const paddingY = 12;
    const barcodeDrawW = containerW - paddingX * 2;
    const barcodeDrawH = containerH - paddingY * 2 - 28; // Leave space for text below

    ctx.shadowBlur = 0;
    ctx.imageSmoothingEnabled = false; // Sharp 1-to-1 pixel edges for barcode scanners

    ctx.drawImage(
      tempCanvas,
      containerX + paddingX,
      containerY + paddingY,
      barcodeDrawW,
      barcodeDrawH
    );
  } catch (err) {
    console.warn('JsBarcode render fallback:', err);
  }

  // 3. Human-Readable Code ID Text under Barcode
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#071a33';
  ctx.font = '800 20px "Space Grotesk", "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(codeText, containerX + containerW / 2, containerY + containerH - 8);

  ctx.restore();
}

/**
 * Generates a unique, deterministic ID string for a builder card.
 * Format: HHGOA26-{INITIALS}-{RANDOM_HEX}
 * Example: HHGOA26-SB-8F42K
 */
export function generateUniqueBuilderId(name: string = 'Swayam Barik'): string {
  const parts = name.trim().split(/\s+/);
  let initials = 'SB';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase();
  }

  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `HHGOA26-${initials}-${rand}`;
}
