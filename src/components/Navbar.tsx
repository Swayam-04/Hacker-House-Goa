import React from 'react';
import { Sparkles, Palmtree, Frame, CreditCard } from 'lucide-react';
import { AppFormat } from '../types/frame';

interface NavbarProps {
  currentFormat: AppFormat;
  onSelectFormat: (format: AppFormat) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentFormat, onSelectFormat, onReset }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button 
          onClick={onReset}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-pink-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
              <Palmtree className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-gradient-goa">
                FrameInGoa
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                2026
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 block -mt-1">
              HH Goa Builder Identity
            </span>
          </div>
        </button>

        {/* Desktop Navigation Format Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => onSelectFormat('PFP_FRAME')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentFormat === 'PFP_FRAME'
                ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Frame className="w-4 h-4" />
            <span>PFP Overlay</span>
          </button>
          
          <button
            onClick={() => onSelectFormat('ID_CARD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentFormat === 'ID_CARD'
                ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Builder ID Card</span>
          </button>
        </div>

        {/* Right Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>#FrameInGoa</span>
          </div>
        </div>

      </div>
    </header>
  );
};
