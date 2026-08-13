import React, { useEffect } from 'react';
import { X as CloseIcon, Download, Share2, Maximize2, Sparkles } from 'lucide-react';
import { AppFormat, PFPFrameConfig, IDCardConfig } from '../types/frame';
import { drawPFPFrameToCanvas } from '../utils/canvas/renderPFPFrame';
import { drawBuilderCardToCanvas } from '../utils/canvas/renderBuilderCard';

interface FullScreenPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userImg: HTMLImageElement | null;
  format: AppFormat;
  pfpConfig: PFPFrameConfig;
  idCardConfig: IDCardConfig;
  onDownload: () => void;
  onOpenShareModal: () => void;
}

export const FullScreenPreviewModal: React.FC<FullScreenPreviewModalProps> = ({
  isOpen,
  onClose,
  userImg,
  format,
  pfpConfig,
  idCardConfig,
  onDownload,
  onOpenShareModal
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Render high-res canvas in full screen view
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !userImg) return;

    const renderW = format === 'PFP_FRAME' ? 2048 : 2048;
    const renderH = format === 'PFP_FRAME' ? 2048 : 2560;

    if (format === 'PFP_FRAME') {
      drawPFPFrameToCanvas(canvasRef.current, userImg, pfpConfig, renderW, renderH);
    } else {
      drawBuilderCardToCanvas(canvasRef.current, userImg, idCardConfig, renderW, renderH);
    }
  }, [isOpen, userImg, format, pfpConfig, idCardConfig]);

  if (!isOpen) return null;

  const formatTitle = format === 'PFP_FRAME' ? 'Format A — Profile Overlay' : 'Format B — Builder ID Card';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
        
        {/* Format Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel border border-white/20 text-white font-mono text-xs font-bold shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Full Screen Preview ({formatTitle})</span>
        </div>

        {/* Action Controls & Close */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onDownload();
            }}
            className="py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-display font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Download PNG</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenShareModal();
            }}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 text-white font-display font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share to X</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/20 transition-all"
            title="Close Full Screen (Esc)"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main High-Res Canvas Viewport */}
      <div 
        onClick={onClose}
        className="w-full h-full flex items-center justify-center pt-16 pb-6 cursor-zoom-out"
      >
        <canvas
          ref={canvasRef}
          onClick={(e) => e.stopPropagation()}
          className={`max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-white/20 transition-transform ${
            format === 'PFP_FRAME' ? 'aspect-square max-h-[85vh]' : 'aspect-[4/5] max-h-[85vh]'
          }`}
        />
      </div>

    </div>
  );
};
