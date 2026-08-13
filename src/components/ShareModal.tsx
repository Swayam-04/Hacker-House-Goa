import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, ExternalLink, Download, AlertCircle, X as CloseIcon, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppFormat, PFPFrameConfig, IDCardConfig } from '../types/frame';
import { prepareXShare, ShareResult } from '../utils/shareUtils';

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
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareResult | null>(null);

  // Auto-generate public share link on modal open if user image is present
  useEffect(() => {
    if (!isOpen || !userImg) return;

    let isMounted = true;
    setIsProcessing(true);
    setErrorMessage(null);
    setStatusText('Preparing image...');

    prepareXShare(userImg, format, pfpConfig, idCardConfig, (status) => {
      if (isMounted) setStatusText(status);
    })
      .then((result) => {
        if (isMounted) {
          setShareData(result);
          setIsProcessing(false);
          setStatusText(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Share link creation error:', err);
          setIsProcessing(false);
          setStatusText(null);
          setErrorMessage('Unable to prepare your X post automatically. You can still download the PNG and share manually.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, userImg, format, pfpConfig, idCardConfig]);

  if (!isOpen) return null;

  const defaultShareUrl = shareData ? shareData.shareUrl : 'https://framein-goa.vercel.app';
  const captionText = `Just framed my builder identity for HH Goa 2026 🚀\n\n#FrameInGoa\n\n${defaultShareUrl}`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePostToX = () => {
    if (!userImg) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    navigator.clipboard.writeText(captionText);
    setCopied(true);

    if (shareData && shareData.tweetUrl) {
      window.open(shareData.tweetUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIsProcessing(true);
      setStatusText('Preparing image...');
      prepareXShare(userImg, format, pfpConfig, idCardConfig, (status) => setStatusText(status))
        .then((result) => {
          setShareData(result);
          setIsProcessing(false);
          setStatusText(null);
          window.open(result.tweetUrl, '_blank', 'noopener,noreferrer');
        })
        .catch(() => {
          setIsProcessing(false);
          setStatusText(null);
          setErrorMessage('Unable to prepare your X post. Please try again.');
        });
    }
  };

  const formatTitle = format === 'PFP_FRAME' ? 'Format A — Profile Overlay' : 'Format B — Builder ID Card';

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
              {formatTitle}
            </p>
          </div>
        </div>

        {/* Dynamic Status / Progress Banner */}
        {isProcessing && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-3 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>{statusText || 'Preparing image...'}</span>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Caption Preview Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Generated Caption & Public Share URL
            </span>
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/15 text-slate-200 font-sans text-sm whitespace-pre-line break-all">
            {captionText}
          </div>
        </div>

        {/* Features Info */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5 text-slate-300 font-mono">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>X Card Preview Ready:</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            When posted, X will automatically crawl your public link and render your high-resolution HH Goa 2026 graphic as a large Twitter card preview!
          </p>
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
            <span>Download PNG</span>
          </button>

          <button
            onClick={handlePostToX}
            disabled={isProcessing}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 disabled:opacity-50 text-white font-display font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{statusText || 'Preparing...'}</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Post to X (#FrameInGoa)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
