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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel-glow p-6 sm:p-8 rounded-3xl border border-amber-500/30 text-left shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-white">
              Share Your Builder Identity to X
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {formatTitle}
            </p>
          </div>
        </div>

        {/* Dynamic State Card: LOADING / SUCCESS / ERROR */}
        {isProcessing ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-amber-400 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-bold text-amber-300">Preparing your X post...</p>
              <p className="text-[11px] text-slate-400">{statusText}</p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Unable to prepare your X post</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">{errorMessage}</p>
            <button
              onClick={startPreparation}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-white font-mono text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Preparation</span>
            </button>
          </div>
        ) : shareData ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5 font-mono">
            <div className="font-bold text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Public Share Link & Graphic Ready</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Public Link: <span className="font-mono text-emerald-300 font-bold break-all">{shareData.shareUrl}</span>
            </p>
          </div>
        ) : null}

        {/* Desktop Auto-Download Notice Banner */}
        {desktopInstructionNotice && !hasNativeShare && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-sans space-y-1 animate-fadeIn">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-amber-400" />
              Image Downloaded & Caption Copied!
            </p>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              X composer is open! Simply click the <span className="text-white font-bold">Media / Image icon</span> in X and select your downloaded PNG file to attach it.
            </p>
          </div>
        )}

        {/* Caption Preview Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Pre-filled X Caption & Public Link
            </span>
            {currentShareUrl && (
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-amber-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
              </button>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/15 text-slate-200 font-sans text-sm whitespace-pre-line break-all">
            {captionText}
          </div>
        </div>

        {/* Device Capability Guidance Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs space-y-1.5 text-slate-300 font-mono">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            {hasNativeShare ? (
              <>
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Mobile Native Image Sharing:</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>Desktop Share Guidance:</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {hasNativeShare
              ? 'Your FrameInGoa image will be shared as an actual image file attached as media along with your caption and public verification link via native device share sheet.'
              : 'Your high-resolution PNG image will be downloaded and X will open with your caption and public link. Simply attach the downloaded image file before posting!'}
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onDownload}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePostToX}
            disabled={isProcessing || !shareData}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 disabled:opacity-50 text-white font-display font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{statusText}</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>{hasNativeShare ? 'Post Image to X' : 'Post to X (#FrameInGoa)'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
