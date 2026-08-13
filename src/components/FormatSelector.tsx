import React from 'react';
import { Frame, CreditCard } from 'lucide-react';
import { AppFormat } from '../types/frame';

interface FormatSelectorProps {
  currentFormat: AppFormat;
  onSelectFormat: (format: AppFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ currentFormat, onSelectFormat }) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8 p-1.5 glass-panel rounded-2xl border border-white/10 flex items-center gap-2">
      <button
        onClick={() => onSelectFormat('PFP_FRAME')}
        className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all ${
          currentFormat === 'PFP_FRAME'
            ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg shadow-amber-500/25 scale-[1.02]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Frame className="w-4 h-4" />
        <span>Format A: PFP Overlay</span>
      </button>

      <button
        onClick={() => onSelectFormat('ID_CARD')}
        className={`flex-1 py-3 px-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2.5 transition-all ${
          currentFormat === 'ID_CARD'
            ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-lg shadow-pink-500/25 scale-[1.02]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <CreditCard className="w-4 h-4" />
        <span>Format B: Builder ID Card</span>
      </button>
    </div>
  );
};
