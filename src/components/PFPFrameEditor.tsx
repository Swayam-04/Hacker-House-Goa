import React from 'react';
import { PFPFrameConfig, PFPShape } from '../types/frame';
import { PFP_THEMES } from '../constants/frameStyles';
import { PRESET_TEAMS } from '../constants/builderTitles';
import { Palette, Circle, Square, MapPin, Users } from 'lucide-react';

interface PFPFrameEditorProps {
  config: PFPFrameConfig;
  onChange: (newConfig: PFPFrameConfig) => void;
}

export const PFPFrameEditor: React.FC<PFPFrameEditorProps> = ({ config, onChange }) => {
  const updateConfig = (key: keyof PFPFrameConfig, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Theme Selector */}
      <div>
        <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span>1. Select Frame Theme</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {PFP_THEMES.map((theme) => {
            const isSelected = config.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateConfig('theme', theme.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-800 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/30"
                    style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }}
                  />
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                    {theme.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                  {theme.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Team Name Input */}
      <div>
        <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>2. Team Name (Optional)</span>
        </label>
        <input
          type="text"
          value={config.teamName}
          onChange={(e) => updateConfig('teamName', e.target.value)}
          placeholder="e.g. Team NeuralSurf"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder:text-slate-600 text-sm font-sans focus:outline-none focus:border-amber-400 mb-2"
        />

        <div className="flex flex-wrap gap-2">
          {PRESET_TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => updateConfig('teamName', team)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                config.teamName === team
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Shape Selector */}
      <div>
        <label className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
          <Circle className="w-4 h-4" />
          <span>3. Profile Frame Shape</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['circle', 'rounded-square', 'square'] as PFPShape[]).map((shape) => {
            const isSelected = config.shape === shape;
            return (
              <button
                key={shape}
                type="button"
                onClick={() => updateConfig('shape', shape)}
                className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {shape === 'circle' && <Circle className="w-5 h-5" />}
                {shape === 'rounded-square' && <Square className="w-5 h-5 rounded-lg" />}
                {shape === 'square' && <Square className="w-5 h-5" />}
                <span className="capitalize">{shape.replace('-', ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Options Toggle */}
      <div className="pt-2 border-t border-white/10">
        <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-white/10 hover:bg-slate-900">
          <span className="text-xs font-medium text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Show Goa Geo Coordinates (15.2993° N, 74.1240° E)</span>
          </span>
          <input
            type="checkbox"
            checked={config.showCoordinates}
            onChange={(e) => updateConfig('showCoordinates', e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};
