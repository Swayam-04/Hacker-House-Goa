import React from 'react';
import { Palmtree, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#060910] py-10 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-pink-500 p-0.5">
            <div className="w-full h-full bg-[#080c14] rounded-[6px] flex items-center justify-center">
              <Palmtree className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-sm text-white block">
              FrameInGoa — HH Goa 2026
            </span>
            <span className="text-[11px] text-slate-400">
              Official Builder Identity & Social Overlay Generator
            </span>
          </div>
        </div>

        {/* Center Privacy Guarantee */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-[11px] font-mono text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Client-Side Canvas Engine • No Login • Zero Data Stored</span>
        </div>

        {/* Right Hashtag & Credits */}
        <div className="text-center md:text-right font-mono">
          <span className="text-amber-400 font-bold block mb-0.5">#FrameInGoa</span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-center md:justify-end">
            Built with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> for Hackerhouse Goa 2026
          </span>
        </div>

      </div>
    </footer>
  );
};
