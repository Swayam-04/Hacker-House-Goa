import React from 'react';
import { Download, Share2 } from 'lucide-react';

interface MobileActionBarProps {
  onDownload: () => void;
  onShare: () => void;
  hasResult: boolean;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onDownload,
  onShare,
  hasResult
}) => {
  if (!hasResult) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 glass-panel border-t border-white/15 backdrop-blur-xl bg-slate-950/95 shadow-2xl flex items-center gap-2">
      <button
        onClick={onDownload}
        className="flex-1 py-3.5 px-4 rounded-xl bg-slate-900 border border-white/20 text-white font-display font-extrabold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Download className="w-4 h-4 text-amber-400" />
        <span>Download PNG</span>
      </button>

      <button
        onClick={onShare}
        className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 text-white font-display font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span>Share #FrameInGoa</span>
      </button>
    </div>
  );
};
