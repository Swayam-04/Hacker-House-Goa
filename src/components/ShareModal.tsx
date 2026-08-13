import React, { useState, useEffect, useCallback } from 'react';
import { Share2, Copy, Check, ExternalLink, Download, AlertCircle, X as CloseIcon, Loader2, Sparkles, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppFormat, PFPFrameConfig, IDCardConfig } from '../types/frame';
import { prepareXShare, ShareResult, canNativeShareFiles, executeNativeFileShare } from '../utils/shareUtils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  userImg: HTMLImageElement | null;
  format: AppFormat;
  pfpConfig: PFPFrameConfig;
  idCardConfig: IDCardConfig;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onDownload,
  userImg,
  format,
  pfpConfig,
  idCardConfig
}) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState<string>('Preparing image...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareResult | null>(null);
  const [hasNativeShare, setHasNativeShare] = useState<boolean>(false);
  const [desktopInstructionNotice, setDesktopInstructionNotice] = useState<boolean>(false);

  // Check device capability for native Web Share file support
  useEffect(() => {
    setHasNativeShare(canNativeShareFiles());
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const startPreparation = useCallback(async () => {
    if (!userImg) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusText('Preparing image...');

    try {
      const result = await prepareXShare(userImg, format, pfpConfig, idCardConfig, (status) => {
        setStatusText(status);
      });
      setShareData(result);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('[ShareModal Error]', err);
      setIsProcessing(false);
      setShareData(null);
      setErrorMessage(err?.message || 'Unable to prepare your X post. Please check internet connection and try again.');
    }
  }, [userImg, format, pfpConfig, idCardConfig]);

  // Auto-start preparation when modal opens
  useEffect(() => {
    if (isOpen && userImg) {
      startPreparation();
    } else if (!isOpen) {
      setShareData(null);
      setErrorMessage(null);
      setIsProcessing(false);
      setDesktopInstructionNotice(false);
    }
  }, [isOpen, userImg, startPreparation]);

  if (!isOpen) return null;

  const currentShareUrl = shareData ? shareData.shareUrl : null;
  
  // Compact display URL for clean UI
  const displayShareUrl = currentShareUrl
    ? `${window.location.host || 'framein-goa.vercel.app'}/share/${shareData?.shareId}`
    : null;

  const captionText = currentShareUrl
    ? `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n${currentShareUrl}`
    : `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n[Preparing unique share link...]`;

  const handleCopyCaption = () => {
    if (!currentShareUrl) return;
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePostToX = async () => {
    if (!shareData) {
      startPreparation();
      return;
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    // 1. Mobile Native Web Share API (Passes actual PNG File + caption + public URL to X app)
    if (hasNativeShare) {
      const shared = await executeNativeFileShare(shareData.pngBlob, shareData.shareUrl, shareData.pngFileName);
      if (shared) return;
    }

    // 2. Desktop Fallback (Auto-Downloads PNG, Copies Caption, Opens X Intent)
    onDownload(); // Automatically download 2048px PNG
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setDesktopInstructionNotice(true);

    if (shareData.tweetUrl) {
      window.open(shareData.tweetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatTitle = format === 'PFP_FRAME' ? 'Format A — Profile Overlay' : 'Format B — Builder ID Card';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      
      {/* Mobile-Optimized Dialog Card (Max 90dvh height, flex column) */}
      <div className="relative w-full max-w-lg max-h-[90dvh] bg-[#071a33]/95 border border-amber-500/30 text-left shadow-2xl rounded-3xl flex flex-col overflow-hidden backdrop-blur-xl">
        
        {/* FIXED HEADER (Never scrolls away) */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#071a33]">
          <div className="flex items-center gap-3 pr-8">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base sm:text-xl text-white leading-tight">
                Share Builder Identity to X
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                {formatTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* DEDICATED SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-left touch-pan-y max-w-full">
          
          {/* Dynamic State Card: LOADING / SUCCESS / ERROR */}
          {isProcessing ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400 shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-300">Preparing your X post...</p>
                <p className="text-[11px] text-slate-400">{statusText}</p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Unable to prepare your X post</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal break-words">{errorMessage}</p>
              <button
                onClick={startPreparation}
                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-white font-mono text-xs font-bold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Preparation</span>
              </button>
            </div>
          ) : shareData ? (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5 font-mono">
              <div className="font-bold text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Public Share Link & Graphic Ready</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed break-words">
                Link: <span className="font-mono text-emerald-300 font-bold break-all">{displayShareUrl}</span>
              </p>
            </div>
          ) : null}

          {/* Desktop Auto-Download Notice Banner */}
          {desktopInstructionNotice && !hasNativeShare && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-sans space-y-1 animate-fadeIn">
              <p className="font-bold text-amber-300 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-400 shrink-0" />
                Image Downloaded & Caption Copied!
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                X composer is open! Click the <span className="text-white font-bold">Media / Image icon</span> in X and attach your downloaded PNG.
              </p>
            </div>
          )}

          {/* Caption Preview Box */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                Pre-filled X Caption & Link
              </span>
              {currentShareUrl && (
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-amber-400 hover:underline shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              )}
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-white/15 text-slate-200 font-sans text-xs sm:text-sm whitespace-pre-line break-words overflow-wrap-anywhere">
              {captionText}
            </div>
          </div>

          {/* Device Capability Guidance Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs space-y-1.5 text-slate-300 font-mono">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              {hasNativeShare ? (
                <>
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-400">Mobile Native File Sharing:</span>
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Desktop Share Guidance:</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {hasNativeShare
                ? 'Your FrameInGoa image will be shared as an actual media file attached along with your caption and public link via your native device share sheet.'
                : 'Your high-resolution PNG image will be downloaded and X will open with your caption and public link. Simply attach your downloaded PNG file before posting!'}
            </p>
          </div>

        </div>

        {/* FIXED STICKY FOOTER ACTIONS (Always reachable on phones, safe-area padded) */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-[#071a33]/98 shrink-0 flex flex-col gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          
          {/* Button 1: Download PNG */}
          <button
            onClick={onDownload}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Download PNG</span>
          </button>

          {/* Button 2: Post to X */}
          <button
            onClick={handlePostToX}
            disabled={isProcessing || !shareData}
            className="w-full min-h-[52px] py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 disabled:opacity-50 text-white font-display font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                <span>{statusText}</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>{hasNativeShare ? 'Post Image to X' : 'Post to X (#FrameInGoa)'}</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
