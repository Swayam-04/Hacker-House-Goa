# 🌴 FrameInGoa — HH Goa 2026 Builder Identity & Frame Generator

> **HH Goa 2026 Shortlisting Task Submission**  
> **Repository**: [https://github.com/Swayam-04/Hacker-House-Goa.git](https://github.com/Swayam-04/Hacker-House-Goa.git)  
> **Hashtag**: `#FrameInGoa`

**FrameInGoa** is a web tool designed for **HH Goa 2026**. It allows users to upload any photo, customize their builder identity in real-time, and generate a branded profile overlay frame or verified builder ID card pass ready to download in high resolution (`2048px`) and share to X (Twitter).

---

## 🌟 Key Features

- ⚡ **Zero Login / Registration Wall**: Instant, one-pass experience from photo upload to PNG export.
- 🎨 **Format A — Profile Overlay Frame**: Replicates the coastal cyber-sunset reference design featuring:
  - Top-left stylized **`HH GOA 2026`** brush logo with palm leaf backdrop.
  - Top-right dynamic date badge box with matrix dot grid.
  - Double neon circular ring with curved border text (`BUILD • CONNECT • CREATE ///`).
  - Ocean surf waves, lighthouse silhouette, flying seagulls, and surfboard with developer code mark `</>`.
  - **Large Futuristic Event Bottom Badge** (`HH GOA 2026 BUILDER • TEAM: {teamName}`).
- 🪪 **Format B — Builder ID Card Pass**: Verified event badge featuring a **real, machine-readable Code 128 barcode** (`HHGOA26-{INITIALS}-{RANDOM_ID}`).
- 🖐️ **Real-Time Live Canvas Editor**:
  - **Desktop**: Mouse drag, mouse wheel zoom, fine-tune sliders for position, scale, rotation, brightness, contrast.
  - **Mobile**: Touch drag, multi-touch pinch-to-zoom, touch-friendly controls.
  - 60 FPS live canvas rendering loop with instant updates.
- 🌈 **4 Dynamic Theme Styles**:
  - **Cyber Wave**: Ocean Cyber Aqua (`#20d4c5`) & Turquoise (`#12b8b0`)
  - **Sunset Glow**: Warm Coastal Sunset Orange (`#ff9a4d`) & Coral (`#ff6b5a`)
  - **Minimal Glass**: Ice Crystal White (`#e2e8f0`) & Sky Blue (`#38bdf8`)
  - **Neon Pulse**: Electric Neon Purple (`#a855f7`) & Pink (`#ec4899`)
- 📁 **Universal Image Extension Support**: Upload any photo format: `JPG`, `PNG`, `WEBP`, `HEIC` / `HEIF` (iPhone photos), `GIF`, `SVG`, `AVIF`, `BMP`, `TIFF`, `ICO`, `DNG`, `CR2`, `NEF`.
- 📅 **Dynamic Generation Date**: Uses device browser date formatted as `DD | MONTH YYYY` (e.g. `13 | MAY 2026`).
- 🔍 **Full Screen Preview Modal**: Inspect graphics in high-resolution across your entire screen before downloading.
- 💎 **Ultra High-Resolution Dual-Canvas Export Engine**:
  - PFP Frame exported at **`2048 × 2048 px`**.
  - Builder ID Card exported at **`2048 × 2560 px`** (4:5 social media resolution).
  - Preserves original uncompressed source photo resolution.
- 🐦 **X Share Flow (`#FrameInGoa`)**: Pre-filled caption with `#FrameInGoa` hashtag, 1-click clipboard copy, and Twitter share dialog.

---

## 🛠️ Step-by-Step Workflow

### Step 1: Upload Your Photo
1. Drag and drop any photo onto the uploader or tap to select from your device.
2. Supports all image file extensions (`JPG`, `PNG`, `WEBP`, `HEIC`, `GIF`, `SVG`, `AVIF`, `BMP`, etc.).
3. Alternatively, click any sample avatar to test instantly.

### Step 2: Choose Your Format
Toggle between the two graphics formats:
- **Format A (Profile Frame Overlay)**: Square 1:1 format for Twitter / GitHub / LinkedIn profile avatars.
- **Format B (Builder ID Card)**: Vertical 4:5 event pass with a scannable Code 128 barcode.

### Step 3: Customize Your Identity (Live Updates)
- **Team Name**: Enter your team name (e.g. `Team NeuralSurf`, `Goa CyberSol`) or select from quick preset buttons.
- **Builder Title**: Click `🎲 Randomize Title` to generate developer titles (*AI Architect*, *Code Voyager*, *Product Hacker*, *GPU Whisperer*, *Zero Knowledge Pioneer*, etc.).
- **Theme**: Select one of 4 dynamic color themes (*Cyber Wave*, *Sunset Glow*, *Minimal Glass*, *Neon Pulse*).
- **Shape**: Select profile ring shape (*Circle*, *Rounded Square*, *Square*).
- **Goa Geo Coordinates**: Toggle `Show Goa Geo Coordinates (15.2993° N, 74.1240° E  🌴)` badge in the bottom-right corner.

### Step 4: Fine-Tune Photo Adjustment
- Click and drag directly on the canvas to reposition your photo.
- Scroll your mouse wheel or pinch on mobile to zoom.
- Open **All Sliders** to fine-tune Scale (`0.5x` - `4.0x`), Position X/Y, Rotation (`-180°` to `+180°`), Brightness, and Contrast.

### Step 5: Full Screen Preview, Download & Share
- Click **Full Screen Preview** to inspect the graphic full-size.
- Click **Download PNG** to generate and save your `2048px` PNG file.
- Click **Share to X (#FrameInGoa)** to open the X sharing modal with a pre-filled caption containing `#FrameInGoa`.

---

## 💻 Tech Stack

- **Core**: React 18, TypeScript, HTML5 Canvas API (2D Context)
- **Styling**: TailwindCSS, Vanilla CSS, Lucide React Icons
- **Build Tool**: Vite 6, PostCSS, Autoprefixer
- **Image Processing**: `JsBarcode` (Code 128 encoding), `heic2any` (iPhone HEIC conversion), `canvas-confetti`

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- `npm` or `pnpm` or `yarn`

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Swayam-04/Hacker-House-Goa.git
   cd Hacker-House-Goa
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Development Server**:
   ```bash
   # On Windows, you can double-click start.bat or run:
   .\start.bat

   # Or run via npm:
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   The production-ready output will be compiled into the `dist/` directory.

---

## 📂 Project Architecture

```text
Hacker-House-Goa/
├── index.html                   # HTML Entry Point
├── package.json                 # Node dependencies and scripts
├── start.bat                    # Windows 1-click startup script
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # TailwindCSS styling config
├── src/
│   ├── main.tsx                 # React DOM Root
│   ├── App.tsx                  # Main Application Component
│   ├── index.css                # Global Design Tokens & Glassmorphism CSS
│   ├── types/
│   │   └── frame.ts             # TypeScript Interfaces (PFPFrameConfig, IDCardConfig)
│   ├── constants/
│   │   ├── builderTitles.ts     # Preset builder titles & team names
│   │   ├── frameStyles.ts       # 4 Theme definitions & coastal palette tokens
│   │   └── samplePhotos.ts      # Default sample avatars
│   ├── components/
│   │   ├── Navbar.tsx           # Top Navigation Bar & reset
│   │   ├── LandingHero.tsx      # Hero Header Banner
│   │   ├── FormatSelector.tsx   # Format A vs Format B Toggle Bar
│   │   ├── ImageUploader.tsx    # Universal Photo Drag & Drop Uploader
│   │   ├── InteractiveCanvasPreview.tsx # Live 60 FPS Canvas Viewport with Gestures
│   │   ├── FullScreenPreviewModal.tsx   # Full Screen High-Res Modal
│   │   ├── PFPFrameEditor.tsx   # Format A Customization Controls
│   │   ├── IDCardEditor.tsx    # Format B Customization Controls
│   │   ├── PhotoAdjuster.tsx    # Fine-Tune Sliders (Zoom, Pos, Rotation)
│   │   ├── PreviewPanel.tsx     # Canvas container & desktop action buttons
│   │   ├── ShareModal.tsx       # Share to X dialog with #FrameInGoa hashtag
│   │   ├── MobileActionBar.tsx  # Sticky Mobile Action Bar
│   │   └── Footer.tsx           # Page Footer
│   └── utils/
│       ├── dateUtils.ts         # Browser Date formatter (DD | MONTH YYYY)
│       ├── imageUtils.ts        # Universal Image loader & HEIC conversion engine
│       └── canvas/
│           ├── drawHelpers.ts   # Logo, Date Box, Waves, & Bottom Event Badge
│           ├── drawCode128Barcode.ts # Machine-readable Code 128 Barcode renderer
│           ├── renderPFPFrame.ts     # Format A PFP Frame renderer (2048px)
│           └── renderBuilderCard.ts   # Format B Builder ID Card renderer (2048px)
└── README.md                    # Documentation & Instructions
```

---

## 📤 Pushing Changes to GitHub

To push updates to `https://github.com/Swayam-04/Hacker-House-Goa.git`:

```bash
git add .
git commit -m "Update FrameInGoa features"
git push origin main
```

---

## 📜 License & Credits

Built with ❤️ for **HH Goa 2026**.  
Designed & Developed by **Swayam Dev** for the **HH Goa 2026 Shortlisting Task**.