export default function handler(req, res) {
  const host = req.headers['host'] || 'framein-goa.vercel.app';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const currentUrl = `${protocol}://${host}${req.url || ''}`;

  const { id, img } = req.query || {};

  const shareId = id || 'HHGOA26-BUILDER';
  // Default to provided img or fallback
  const imageUrl = img 
    ? decodeURIComponent(img)
    : `${protocol}://${host}/og-preview.png`;

  const title = `HH Goa 2026 — FrameInGoa Builder Pass (${shareId})`;
  const description = `Just framed my builder identity for HH Goa 2026 🚀 #FrameInGoa`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${currentUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="1200" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${currentUrl}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Instant Human Redirect to Main App View -->
  <meta http-equiv="refresh" content="0;url=/?viewShare=${shareId}&img=${encodeURIComponent(imageUrl)}" />
</head>
<body style="background-color: #040d1a; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; text-align: center;">
  <div style="max-width: 500px; padding: 30px; background: rgba(7, 26, 51, 0.9); border: 1px solid rgba(32, 212, 197, 0.4); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
    <h2 style="color: #ff9a4d; font-size: 24px; margin-bottom: 12px;">HH GOA 2026</h2>
    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">Builder Pass (${shareId})</p>
    <img src="${imageUrl}" alt="FrameInGoa Builder Graphic" style="width: 100%; max-width: 380px; height: auto; border-radius: 16px; border: 2px solid #20d4c5; margin-bottom: 20px;" />
    <p style="color: #20d4c5; font-size: 14px; font-weight: bold;">Loading FrameInGoa App...</p>
    <script>
      setTimeout(function() {
        window.location.href = "/?viewShare=${shareId}&img=" + encodeURIComponent("${imageUrl}");
      }, 500);
    </script>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}
