import React, { useState, useEffect } from 'react';
import { AppFormat, PFPFrameConfig, IDCardConfig, ImageTransform } from './types/frame';
import { renderPFPFrame } from './utils/canvas/renderPFPFrame';
import { renderBuilderCard } from './utils/canvas/renderBuilderCard';
import { ImageLoadResult, loadImageSource } from './utils/imageUtils';
import { formatGenerationDate } from './utils/dateUtils';
import { generateUniqueBuilderId } from './utils/canvas/drawCode128Barcode';
import { SampleAvatar, SAMPLE_AVATARS } from './constants/samplePhotos';

import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FormatSelector } from './components/FormatSelector';
import { ImageUploader } from './components/ImageUploader';
import { PhotoAdjuster } from './components/PhotoAdjuster';
import { PFPFrameEditor } from './components/PFPFrameEditor';
import { IDCardEditor } from './components/IDCardEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { ShareModal } from './components/ShareModal';
import { FullScreenPreviewModal } from './components/FullScreenPreviewModal';
import { MobileActionBar } from './components/MobileActionBar';
import { Footer } from './components/Footer';

import { Sliders, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_TRANSFORM: ImageTransform = {
  x: 0,
  y: 0,
  scale: 1.0,
  rotation: 0,
  brightness: 100,
  contrast: 100
};

export function App() {
  const [currentFormat, setCurrentFormat] = useState<AppFormat>('PFP_FRAME');
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);
  const [showAdjuster, setShowAdjuster] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  // Initial generation date captured from browser Date()
  const initialDate = formatGenerationDate(new Date());

  // Format A Config
  const [pfpConfig, setPfpConfig] = useState<PFPFrameConfig>({
    theme: 'cyber-wave',
    shape: 'circle',
    badgeText: 'HH GOA 2026 BUILDER',
    teamName: 'Team NeuralSurf',
    showCoordinates: true,
    transform: { ...DEFAULT_TRANSFORM },
    generationDate: initialDate
  });

  // Format B Config (Deterministic Code 128 Unique ID)
  const [idCardConfig, setIdCardConfig] = useState<IDCardConfig>({
    name: 'Swayam Dev',
    teamName: 'Team NeuralSurf',
    role: 'Full Stack & AI',
    builderTitle: 'AI ARCHITECT',
    motto: 'Shipped in Goa 🌴',
    theme: 'cyber-pass',
    badgeNumber: generateUniqueBuilderId('Swayam Dev'),
    transform: { ...DEFAULT_TRANSFORM },
    generationDate: initialDate
  });

  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Initialize with Sample Avatar 1 on first load for instant live preview!
  useEffect(() => {
    loadImageSource(SAMPLE_AVATARS[0].avatarUrl)
      .then(res => {
        setUserImage(res.image);
      })
      .catch(console.error);
  }, []);

  // Handle Photo Upload
  const handleImageLoaded = (
    result: ImageLoadResult,
    _fileOrUrl: File | string,
    sampleInfo?: SampleAvatar
  ) => {
    setUserImage(result.image);
    const currentDate = formatGenerationDate(new Date());

    const freshTransform = { ...DEFAULT_TRANSFORM };
    const newName = sampleInfo ? sampleInfo.name : idCardConfig.name;

    setPfpConfig(prev => ({ ...prev, transform: freshTransform, generationDate: currentDate }));
    setIdCardConfig(prev => ({
      ...prev,
      transform: freshTransform,
      generationDate: currentDate,
      name: newName,
      badgeNumber: generateUniqueBuilderId(newName),
      role: sampleInfo ? sampleInfo.role : prev.role,
      builderTitle: sampleInfo ? sampleInfo.title : prev.builderTitle
    }));
  };

  // Replace Image (keeps format and card text fields, updates generation date)
  const handleReplaceImage = (result: ImageLoadResult) => {
    setUserImage(result.image);
    const currentDate = formatGenerationDate(new Date());
    const freshTransform = { ...DEFAULT_TRANSFORM };
    setPfpConfig(prev => ({ ...prev, transform: freshTransform, generationDate: currentDate }));
    setIdCardConfig(prev => ({ ...prev, transform: freshTransform, generationDate: currentDate }));
  };

  // Live Transform Update
  const handleTransformChange = (newTransform: ImageTransform) => {
    if (currentFormat === 'PFP_FRAME') {
      setPfpConfig(prev => ({ ...prev, transform: newTransform }));
    } else {
      setIdCardConfig(prev => ({ ...prev, transform: newTransform }));
    }
  };

  // Reset Transform
  const handleResetTransform = () => {
    handleTransformChange({ ...DEFAULT_TRANSFORM });
  };

  // Format Switch Handler
  const handleSelectFormat = (format: AppFormat) => {
    setCurrentFormat(format);
    const element = document.getElementById('editor-workspace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset/Clear Image & Generate New Unique ID
  const handleResetAll = () => {
    setUserImage(null);
    const currentDate = formatGenerationDate(new Date());
    setPfpConfig(prev => ({ ...prev, transform: { ...DEFAULT_TRANSFORM }, generationDate: currentDate }));
    setIdCardConfig(prev => ({
      ...prev,
      transform: { ...DEFAULT_TRANSFORM },
      generationDate: currentDate,
      badgeNumber: generateUniqueBuilderId(prev.name)
    }));
  };

  // PNG File Download Handler (High-res 2048px export engine with Code 128 barcode)
  const handleDownload = async () => {
    if (!userImage) return;

    setIsExporting(true);
    setGenerationError(null);

    try {
      const exportW = 2048;
      const exportH = currentFormat === 'PFP_FRAME' ? 2048 : 2560;

      let res;
      if (currentFormat === 'PFP_FRAME') {
        res = await renderPFPFrame(userImage, pfpConfig, exportW, exportH);
      } else {
        res = await renderBuilderCard(userImage, idCardConfig, exportW, exportH);
      }

      console.log(`Exported PNG resolution verified: ${res.width} x ${res.height} px`);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }

      const link = document.createElement('a');
      link.href = res.dataUrl;
      const filename = currentFormat === 'PFP_FRAME' 
        ? 'HH_Goa_2026_PFP_Frame_2048px.png' 
        : `HH_Goa_2026_${idCardConfig.name.replace(/\s+/g, '_')}_ID_Card_2048px.png`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Download error:', err);
      setGenerationError('Failed to generate high-resolution image download.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-amber-500 selection:text-black">
      
      {/* Header Navbar */}
      <Navbar
        currentFormat={currentFormat}
        onSelectFormat={handleSelectFormat}
        onReset={handleResetAll}
      />

      {/* Hero Banner */}
      <LandingHero onStartFormat={handleSelectFormat} />

      {/* Main Interactive Workspace */}
      <main id="editor-workspace" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Format Selector Toggle Bar */}
        <FormatSelector
          currentFormat={currentFormat}
          onSelectFormat={handleSelectFormat}
        />

        {/* Export Toast Loading Overlay */}
        {isExporting && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-amber-500 text-black font-mono font-bold text-xs shadow-2xl flex items-center gap-3 animate-bounce">
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Preparing high-quality PNG with Code 128 Barcode...</span>
          </div>
        )}

        {/* Workspace Layout Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls & Text Inputs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step 1: Photo Uploader & Replace */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Step 1: Your Photo</span>
                </span>
                {userImage && (
                  <button
                    onClick={() => setShowAdjuster(!showAdjuster)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      showAdjuster 
                        ? 'bg-amber-500 text-black font-bold' 
                        : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{showAdjuster ? 'Close Sliders' : 'All Sliders'}</span>
                  </button>
                )}
              </div>

              <ImageUploader
                onImageLoaded={handleImageLoaded}
                isLoading={false}
                currentImageLoaded={!!userImage}
              />
            </div>

            {/* Fine-Tune Sliders Drawer */}
            {userImage && showAdjuster && (
              <PhotoAdjuster
                transform={currentFormat === 'PFP_FRAME' ? pfpConfig.transform : idCardConfig.transform}
                onChange={handleTransformChange}
                onReset={handleResetTransform}
              />
            )}

            {/* Step 2: Live Customization Editor */}
            <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Step 2: Customize Identity (Live Updates)</span>
                </span>
              </div>

              {currentFormat === 'PFP_FRAME' ? (
                <PFPFrameEditor
                  config={pfpConfig}
                  onChange={setPfpConfig}
                />
              ) : (
                <IDCardEditor
                  config={idCardConfig}
                  onChange={setIdCardConfig}
                />
              )}
            </div>

            {/* Error Banner */}
            {generationError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

          </div>

          {/* Right Column: Live Interactive Canvas Preview */}
          <div className="lg:col-span-6 sticky top-24">
            <PreviewPanel
              userImg={userImage}
              format={currentFormat}
              pfpConfig={pfpConfig}
              idCardConfig={idCardConfig}
              onChangeTransform={handleTransformChange}
              onResetTransform={handleResetTransform}
              onReplaceImage={handleReplaceImage}
              onDownload={handleDownload}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onToggleAdjuster={() => setShowAdjuster(!showAdjuster)}
              onOpenFullScreen={() => setIsFullScreenOpen(true)}
              showAdjuster={showAdjuster}
            />
          </div>

        </div>

      </main>

      {/* Full Screen Preview Modal */}
      <FullScreenPreviewModal
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        userImg={userImage}
        format={currentFormat}
        pfpConfig={pfpConfig}
        idCardConfig={idCardConfig}
        onDownload={handleDownload}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onDownload={handleDownload}
        formatName={currentFormat === 'PFP_FRAME' ? 'Format A: PFP Overlay' : 'Format B: Builder ID Card'}
      />

      {/* Mobile Sticky Action Bar */}
      <MobileActionBar
        onDownload={handleDownload}
        onShare={() => setIsShareModalOpen(true)}
        hasResult={!!userImage}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
