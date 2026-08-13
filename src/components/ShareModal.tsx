import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Download, AlertCircle, X as CloseIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  formatName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  formatName
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const captionText = `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\nSee you in Goa! 🌴✨`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareToX = () => {
    // 1. Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    // 2. Automatically copy caption text containing #FrameInGoa
    navigator.clipboard.writeText(captionText);
    setCopied(true);

    // 3. Open X post intent in a new tab
    const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(captionText)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel-glow p-6 sm:p-8 rounded-3xl border border-amber-500/30 text-left shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-white">
              Share Your Builder Identity to X
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Format: {formatName}
            </p>
          </div>
        </div>

        {/* Caption Preview Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Pre-filled Caption</span>
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/15 text-slate-200 font-sans text-sm whitespace-pre-line relative">
            {captionText}
          </div>
        </div>

        {/* 3-Step Sharing Instructions */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2 text-slate-300">
          <div className="font-mono font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>3 Simple Steps To Post:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 font-medium">
            <li>
              <span className="text-white font-bold">Download your PNG graphic</span> to your device.
            </li>
            <li>
              Click <span className="text-white font-bold">"Post to X (#FrameInGoa)"</span> below (caption will auto-copy).
            </li>
            <li>
              In X composer, <span className="text-amber-300 font-bold">attach your downloaded image</span> and paste caption!
            </li>
          </ol>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              onDownload();
            }}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>1. Download PNG</span>
          </button>

          <button
            onClick={handleShareToX}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 text-white font-display font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>2. Post to X (#FrameInGoa)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
