import { COASTAL_COLORS } from '../../constants/frameStyles';

/**
 * Canvas drawing helpers matching the exact HH Goa 2026 Coastal Sunset & Tech aesthetic
 */

export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number }
) {
  let r = typeof radius === 'number'
    ? { tl: radius, tr: radius, br: radius, bl: radius }
    : radius;

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

export function drawTechGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string = 'rgba(32, 212, 197, 0.04)',
  step: number = 50
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawMinimalPalmLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  rotationDeg: number = 0,
  color: string = 'rgba(32, 212, 197, 0.2)'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(scale, scale);

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(60, -40, 140, -60);
  ctx.stroke();

  const leaflets = 7;
  for (let i = 1; i <= leaflets; i++) {
    const t = i / leaflets;
    const lx = t * 130;
    const ly = -Math.sin(t * Math.PI) * 50;

    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(lx - 20, ly - 35, lx - 40, ly - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(lx + 25, ly - 35, lx + 45, ly - 15);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Top-Left Stylized HH GOA 2026 Logo with Theme Color Customization
 */
export function drawHHGoaBrushLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number = 1,
  primaryColor: string = '#20d4c5',
  secondaryColor: string = '#ff9a4d'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Palm Fronds Behind Logo
  ctx.strokeStyle = `${primaryColor}55`;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  const fronds = [
    { c1x: 80, c1y: -40, endX: 220, endY: -80 },
    { c1x: 100, c1y: -10, endX: 250, endY: 10 },
    { c1x: 90, c1y: 40, endX: 230, endY: 80 },
    { c1x: 50, c1y: 80, endX: 180, endY: 140 }
  ];

  fronds.forEach(f => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(f.c1x, f.c1y, f.endX, f.endY);
    ctx.stroke();

    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      const lx = t * f.endX * 0.9;
      const ly = t * f.endY * 0.9;

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 25, ly - 20);
      ctx.stroke();
    }
  });

  // "HH" White Brush Style
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 85px "Outfit", "Plus Jakarta Sans", sans-serif';
  ctx.fillText('HH', 0, 60);

  // "GOA" Theme Gradient Text
  const goaGrad = ctx.createLinearGradient(0, 70, 160, 130);
  goaGrad.addColorStop(0, secondaryColor);
  goaGrad.addColorStop(1, '#ff6b5a');

  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 20;
  ctx.fillStyle = goaGrad;
  ctx.font = '900 95px "Outfit", sans-serif';
  ctx.fillText('GOA', 0, 145);

  // "2026" Text Accent
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 15;
  ctx.fillStyle = secondaryColor;
  ctx.font = '900 48px "Space Grotesk", sans-serif';
  ctx.fillText('2026', 15, 195);

  ctx.restore();
}

/**
 * Top-Right Dynamic Date Box with Theme Accent Colors
 */
export function drawGoaDateBadgeBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dateString: string,
  scale: number = 1,
  primaryColor: string = '#20d4c5'
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const parts = dateString.split('|');
  const dayStr = parts[0] ? parts[0].trim() : '12';
  const monthYearParts = parts[1] ? parts[1].trim().split(' ') : ['AUGUST', '2026'];
  const monthStr = monthYearParts[0] ? monthYearParts[0].substring(0, 3).toUpperCase() : 'AUG';
  const yearStr = monthYearParts[1] || '2026';

  const boxW = 210;
  const boxH = 95;

  drawRoundedRect(ctx, -boxW, 0, boxW, boxH, 22);
  ctx.fillStyle = 'rgba(7, 26, 51, 0.88)';
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 18;
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = primaryColor;
  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 52px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(dayStr, -boxW + 55, boxH / 2 + 2);

  ctx.strokeStyle = `${primaryColor}66`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-boxW + 105, 18);
  ctx.lineTo(-boxW + 105, boxH - 18);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = primaryColor;
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText(monthStr, -boxW + 122, boxH / 2 - 14);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillText(yearStr, -boxW + 122, boxH / 2 + 16);

  // Matrix Dot Grid
  ctx.fillStyle = `${primaryColor}66`;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 6; c++) {
      ctx.beginPath();
      ctx.arc(-140 + c * 22, boxH + 25 + r * 15, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Curved Text Along Circular Frame Ring
 */
export function drawCurvedTextOnRing(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngleRad: number,
  color: string = '#20d4c5'
) {
  ctx.save();
  ctx.font = '800 22px "Space Grotesk", sans-serif';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const characters = text.split('');
  let currentAngle = startAngleRad;
  const angularSpacing = 0.045;

  characters.forEach((char) => {
    ctx.save();
    const x = centerX + radius * Math.cos(currentAngle);
    const y = centerY + radius * Math.sin(currentAngle);

    ctx.translate(x, y);
    ctx.rotate(currentAngle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();

    currentAngle += angularSpacing;
  });

  ctx.restore();
}

/**
 * Coastal Sunset & Ocean Wave Landscape Artwork with Dynamic Theme Colors
 */
export function drawCoastalLandscapeArtwork(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  primaryColor: string = '#20d4c5',
  secondaryColor: string = '#ff9a4d'
) {
  ctx.save();

  const sunsetGrad = ctx.createLinearGradient(0, height - 750, 0, height);
  sunsetGrad.addColorStop(0, 'transparent');
  sunsetGrad.addColorStop(0.3, `${secondaryColor}25`);
  sunsetGrad.addColorStop(0.65, `${secondaryColor}55`);
  sunsetGrad.addColorStop(0.85, `${primaryColor}66`);
  sunsetGrad.addColorStop(1, '#071a33');

  ctx.fillStyle = sunsetGrad;
  ctx.fillRect(0, height - 750, width, 750);

  // Sun Orbs
  ctx.save();
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 40;
  ctx.fillStyle = secondaryColor;
  ctx.beginPath();
  ctx.arc(width - 320, height - 240, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 35;
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.arc(280, height - 210, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Lighthouse Silhouette
  ctx.save();
  ctx.fillStyle = '#051224';
  const lx = 180;
  const ly = height - 260;

  ctx.beginPath();
  ctx.moveTo(0, height - 120);
  ctx.quadraticCurveTo(150, height - 190, 300, height - 140);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(lx - 25, ly + 100);
  ctx.lineTo(lx - 15, ly);
  ctx.lineTo(lx + 15, ly);
  ctx.lineTo(lx + 25, ly + 100);
  ctx.fill();

  ctx.fillRect(lx - 18, ly - 20, 36, 20);
  ctx.beginPath();
  ctx.arc(lx, ly - 20, 18, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = `${primaryColor}40`;
  ctx.beginPath();
  ctx.moveTo(lx, ly - 20);
  ctx.lineTo(lx + 450, ly - 180);
  ctx.lineTo(lx + 450, ly - 80);
  ctx.fill();

  // Flying Seagulls
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const gulls = [
    { x: 120, y: height - 420, s: 18 },
    { x: 180, y: height - 460, s: 24 },
    { x: 250, y: height - 440, s: 16 }
  ];

  gulls.forEach(g => {
    ctx.beginPath();
    ctx.moveTo(g.x - g.s, g.y);
    ctx.quadraticCurveTo(g.x - g.s / 2, g.y - g.s / 2, g.x, g.y);
    ctx.quadraticCurveTo(g.x + g.s / 2, g.y - g.s / 2, g.x + g.s, g.y);
    ctx.stroke();
  });
  ctx.restore();

  // Surfboard with Code Symbol </>
  ctx.save();
  const sbX = width - 180;
  const sbY = height - 280;

  ctx.translate(sbX, sbY);
  ctx.rotate((12 * Math.PI) / 180);

  ctx.fillStyle = '#06172e';
  ctx.strokeStyle = secondaryColor;
  ctx.lineWidth = 4;
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 18;

  drawRoundedRect(ctx, -32, -130, 64, 260, 32);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('</>', 0, 0);

  ctx.restore();

  // Palm Trees
  ctx.save();
  ctx.fillStyle = '#040d1a';
  const px = width - 120;
  const py = height - 160;

  ctx.beginPath();
  ctx.moveTo(px, height);
  ctx.quadraticCurveTo(px - 60, py + 100, px - 80, py);
  ctx.lineTo(px - 100, py);
  ctx.quadraticCurveTo(px - 70, py + 100, px - 20, height);
  ctx.fill();

  const palmFronds = [
    { cx: px - 130, cy: py - 60, ex: px - 220, ey: py - 30 },
    { cx: px - 140, cy: py - 90, ex: px - 200, ey: py - 120 },
    { cx: px - 80, cy: py - 110, ex: px - 70, ey: py - 160 },
    { cx: px - 40, cy: py - 90, ex: px + 30, ey: py - 100 }
  ];

  palmFronds.forEach(f => {
    ctx.beginPath();
    ctx.moveTo(px - 80, py);
    ctx.quadraticCurveTo(f.cx, f.cy, f.ex, f.ey);
    ctx.quadraticCurveTo(f.cx + 20, f.cy + 20, px - 80, py);
    ctx.fill();
  });
  ctx.restore();

  // Crashing Ocean Waves
  ctx.save();
  ctx.fillStyle = primaryColor;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 25;

  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 40) {
    const waveY = height - 140 + Math.sin((x / width) * Math.PI * 6) * 35;
    ctx.lineTo(x, waveY);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let x = 0; x <= width; x += 40) {
    const waveY = height - 140 + Math.sin((x / width) * Math.PI * 6) * 35;
    ctx.lineTo(x, waveY);
  }
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}

/**
 * Large Premium Futuristic Event Bottom Badge / Identity Plate
 * Zero Duplication Fix: Strips redundant prefix strings from Title and Team inputs!
 */
export function drawPremiumEventBottomBadge(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  badgeTitleText: string = 'BUILDER',
  teamNameText: string = '',
  primaryColor: string = '#20d4c5',
  secondaryColor: string = '#ff9a4d'
) {
  ctx.save();

  // Dimensions & Coordinates
  const badgeWidth = 1380;   // Spans ~67% of 2048px canvas width
  const badgeHeight = 160;   // Generous height for 2 distinct text levels
  const bx = centerX - badgeWidth / 2;
  const by = centerY - badgeHeight / 2;

  const cornerCut = 32;      // Futuristic angled chamfered corner cuts

  // Helper path for futuristic angled polygon badge
  const createBadgePath = (x: number, y: number, w: number, h: number, cut: number) => {
    ctx.beginPath();
    ctx.moveTo(x + cut, y);
    ctx.lineTo(x + w - cut, y);
    ctx.lineTo(x + w, y + cut);
    ctx.lineTo(x + w, y + h - cut);
    ctx.lineTo(x + w - cut, y + h);
    ctx.lineTo(x + cut, y + h);
    ctx.lineTo(x, y + h - cut);
    ctx.lineTo(x, y + cut);
    ctx.closePath();
  };

  // 1. Outer Soft Glow Backdrop Layer
  ctx.save();
  createBadgePath(bx - 6, by - 6, badgeWidth + 12, badgeHeight + 12, cornerCut + 4);
  ctx.fillStyle = `${secondaryColor}30`;
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 35;
  ctx.fill();
  ctx.restore();

  // 2. Secondary Cyan Accent Outer Outline
  ctx.save();
  createBadgePath(bx - 3, by - 3, badgeWidth + 6, badgeHeight + 6, cornerCut + 2);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 20;
  ctx.stroke();
  ctx.restore();

  // 3. Deep Midnight Navy Main Badge Container Panel
  ctx.save();
  createBadgePath(bx, by, badgeWidth, badgeHeight, cornerCut);
  ctx.fillStyle = '#051224'; // Deep dark navy
  ctx.fill();

  // Layered Sunset Orange / Coral Inner Border Stroke
  const borderGrad = ctx.createLinearGradient(bx, by, bx + badgeWidth, by + badgeHeight);
  borderGrad.addColorStop(0, secondaryColor);
  borderGrad.addColorStop(0.5, '#ff6b5a');
  borderGrad.addColorStop(1, primaryColor);

  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4.5;
  ctx.stroke();
  ctx.restore();

  // 4. Corner Geometric Tech Accent Notch Marks
  ctx.save();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;

  // Left & Right Tech Tick Marks (/// ///)
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = primaryColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('///', bx - 35, centerY);
  ctx.fillText('///', bx + badgeWidth + 35, centerY);

  // Small Corner Bracket Marks
  ctx.strokeStyle = secondaryColor;
  ctx.beginPath();
  ctx.moveTo(bx + 18, by + 12);
  ctx.lineTo(bx + 12, by + 12);
  ctx.lineTo(bx + 12, by + 18);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(bx + badgeWidth - 18, by + 12);
  ctx.lineTo(bx + badgeWidth - 12, by + 12);
  ctx.lineTo(bx + badgeWidth - 12, by + 18);
  ctx.stroke();
  ctx.restore();

  // 5. Level 1 Primary Text ("HH GOA 2026 BUILDER")
  // Zero Duplication Fix: Strip redundant 'HH GOA 2026' from suffix if already present
  ctx.save();
  const textLevel1Y = by + 52;
  ctx.font = '900 46px "Outfit", "Space Grotesk", sans-serif';
  ctx.textBaseline = 'middle';

  let rawTitle = (badgeTitleText || 'BUILDER').toUpperCase();
  let suffixTitle = rawTitle.replace(/^HH\s+GOA\s+2026\s*/i, '').trim();
  if (!suffixTitle) suffixTitle = 'BUILDER';

  const partHH = 'HH ';
  const partGoa = 'GOA 2026 ';
  const partSuffix = suffixTitle;

  const wHH = ctx.measureText(partHH).width;

  // Create Goa 2026 gradient
  const goaGradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
  goaGradient.addColorStop(0, secondaryColor);
  goaGradient.addColorStop(1, '#ff6b5a');

  ctx.font = '900 46px "Outfit", sans-serif';
  const wGoa = ctx.measureText(partGoa).width;
  const wSuffix = ctx.measureText(partSuffix).width;
  const totalW1 = wHH + wGoa + wSuffix;

  let startX1 = centerX - totalW1 / 2;

  // Draw HH (White)
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 8;
  ctx.fillText(partHH, startX1, textLevel1Y);
  startX1 += wHH;

  // Draw GOA 2026 (Orange/Coral Sunset Gradient)
  ctx.fillStyle = goaGradient;
  ctx.shadowColor = secondaryColor;
  ctx.shadowBlur = 15;
  ctx.fillText(partGoa, startX1, textLevel1Y);
  startX1 += wGoa;

  // Draw BUILDER / Badge Suffix Text (White)
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 8;
  ctx.fillText(partSuffix, startX1, textLevel1Y);
  ctx.restore();

  // 6. Subtle Horizontal Glowing Divider Line
  ctx.save();
  const dividerY = by + 90;
  const divGrad = ctx.createLinearGradient(centerX - 350, dividerY, centerX + 350, dividerY);
  divGrad.addColorStop(0, 'transparent');
  divGrad.addColorStop(0.2, `${primaryColor}44`);
  divGrad.addColorStop(0.5, primaryColor);
  divGrad.addColorStop(0.8, `${primaryColor}44`);
  divGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 350, dividerY);
  ctx.lineTo(centerX + 350, dividerY);
  ctx.stroke();

  // Center Diamond Tech Accent
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  ctx.moveTo(centerX, dividerY - 5);
  ctx.lineTo(centerX + 5, dividerY);
  ctx.lineTo(centerX, dividerY + 5);
  ctx.lineTo(centerX - 5, dividerY);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 7. Level 2 Secondary Text ("TEAM: INFINIX")
  // Zero Duplication Fix: Strip redundant 'TEAM:' or 'TEAM ' if already present
  ctx.save();
  const textLevel2Y = by + 125;
  ctx.font = '800 32px "Space Grotesk", sans-serif';
  ctx.textBaseline = 'middle';

  let rawTeam = (teamNameText || 'INFINIX').toUpperCase();
  let cleanTeamVal = rawTeam.replace(/^(TEAM:\s*|TEAM\s+)/i, '').trim();
  if (!cleanTeamVal) cleanTeamVal = 'INFINIX';

  const teamLabel = 'TEAM: ';
  const teamVal = cleanTeamVal;

  const wLabel = ctx.measureText(teamLabel).width;
  const wVal = ctx.measureText(teamVal).width;
  const totalW2 = wLabel + wVal;

  let startX2 = centerX - totalW2 / 2;

  // Draw "TEAM:" (Bright Aqua/Cyan Highlight)
  ctx.fillStyle = primaryColor;
  ctx.shadowColor = primaryColor;
  ctx.shadowBlur = 12;
  ctx.textAlign = 'left';
  ctx.fillText(teamLabel, startX2, textLevel2Y);
  startX2 += wLabel;

  // Draw "{teamName}" (Bright White)
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 0;
  ctx.fillText(teamVal, startX2, textLevel2Y);

  ctx.restore();

  ctx.restore();
}
