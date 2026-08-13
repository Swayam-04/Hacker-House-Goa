import React from 'react';
import { Palmtree, Frame, CreditCard, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AppFormat } from '../types/frame';

interface LandingHeroProps {
  onStartFormat: (format: AppFormat) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartFormat }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-dark-mesh">
      {/* Background Decorative Lighting Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium shadow-lg shadow-amber-500/10">
            <Palmtree className="w-4 h-4 text-amber-400" />
            <span>HACKERHOUSE GOA 2026 OFFICIAL TOOL</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            FrameIn<span className="text-gradient-goa">Goa</span>
          </h1>
          <p className="text-lg sm:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Turn your photo into your <span className="text-amber-400 font-bold">HH Goa 2026</span> builder identity.
          </p>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-normal">
            Generate custom PFP frames & digital event cards. 100% private, instant client-side rendering, downloadable PNGs ready to share on X with <span className="text-cyan-400 font-mono font-semibold">#FrameInGoa</span>.
          </p>
        </div>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onStartFormat('PFP_FRAME')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 text-white font-display font-extrabold text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
          >
            <Frame className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Create My Frame</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onStartFormat('ID_CARD')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-display font-bold text-lg hover:border-cyan-400 shadow-xl shadow-cyan-500/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
          >
            <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Create Builder Card</span>
          </button>
        </div>

        {/* Format Feature Cards Grid (Interactive Previews) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Format A Card */}
          <div 
            onClick={() => onStartFormat('PFP_FRAME')}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500/20 text-amber-400 font-mono text-xs font-bold rounded-bl-2xl border-l border-b border-amber-500/30">
              FORMAT A
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                <Frame className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                  PFP Profile Overlay
                </h3>
                <p className="text-xs text-slate-400">Square social media profile picture graphic</p>
              </div>
            </div>

            {/* Visual Example Mockup */}
            <div className="my-6 relative aspect-square max-w-[240px] mx-auto rounded-full p-2 bg-gradient-to-br from-amber-500 via-pink-500 to-cyan-500 shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden relative border-4 border-[#080c14] flex items-center justify-center">
                {/* Mock avatar SVG */}
                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-2">
                    <span className="text-3xl">🌴</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300">GOA 2026</span>
                </div>
                
                <div className="absolute bottom-2 px-3 py-1 bg-amber-500 text-black font-mono text-[10px] font-black rounded-full shadow-lg">
                  BUILDER 2026
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 mb-4 font-medium">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Intelligent auto-cropping for portrait, landscape & square</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>4 Goa cyber-tropical themes & custom badge sticker</span>
              </li>
            </ul>

            <div className="text-amber-400 text-xs font-bold font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>SELECT FORMAT A</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Format B Card */}
          <div 
            onClick={() => onStartFormat('ID_CARD')}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold rounded-bl-2xl border-l border-b border-cyan-500/30">
              FORMAT B
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  Digital Builder ID Card
                </h3>
                <p className="text-xs text-slate-400">Event-style 4:5 social pass badge</p>
              </div>
            </div>

            {/* Visual Example Mockup */}
            <div className="my-6 relative aspect-[4/5] max-w-[200px] mx-auto rounded-2xl p-2 bg-gradient-to-br from-cyan-500 via-pink-500 to-amber-500 shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-xl bg-slate-950 p-3 flex flex-col justify-between border border-white/20 text-left">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-[10px] font-extrabold text-cyan-400 font-mono">HH GOA 2026</span>
                  <span className="text-[8px] font-mono text-slate-400">PASS #0492</span>
                </div>
                <div className="my-2 aspect-square rounded-lg bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[8px] font-bold block mb-1">
                    AI ARCHITECT
                  </span>
                  <span className="text-xs font-extrabold text-white block">Alex Rivera</span>
                  <span className="text-[9px] text-slate-400 block">Full Stack & Agents</span>
                </div>
              </div>
            </div>

            <ul className="text-xs text-slate-300 space-y-2 mb-4 font-medium">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Custom Title Generator (AI Architect, Code Voyager, etc.)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Event security barcode & Goa venue coordinates</span>
              </li>
            </ul>

            <div className="text-cyan-400 text-xs font-bold font-mono flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>SELECT FORMAT B</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

          </div>

        </div>

        {/* Zero Friction Highlights */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>No Signup / No Auth Required</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Client-Side Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>100% Free & Open For All Builders</span>
          </div>
        </div>

      </div>
    </section>
  );
};
