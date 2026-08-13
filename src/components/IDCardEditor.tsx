import React from 'react';
import { IDCardConfig } from '../types/frame';
import { IDCARD_THEMES } from '../constants/frameStyles';
import { DEFAULT_ROLES, PRESET_TEAMS } from '../constants/builderTitles';
import { BuilderTitleGenerator } from './BuilderTitleGenerator';
import { User, Code2, Palette, MessageSquare, Users } from 'lucide-react';

interface IDCardEditorProps {
  config: IDCardConfig;
  onChange: (newConfig: IDCardConfig) => void;
}

export const IDCardEditor: React.FC<IDCardEditorProps> = ({ config, onChange }) => {
  const updateConfig = (key: keyof IDCardConfig, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Name Input */}
      <div>
        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Full Name</span>
        </label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => updateConfig('name', e.target.value)}
          placeholder="e.g. Swayam Dev"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder:text-slate-600 text-sm font-sans focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* 2. Team Name Input */}
      <div>
        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Team Name</span>
        </label>
        <input
          type="text"
          value={config.teamName}
          onChange={(e) => updateConfig('teamName', e.target.value)}
          placeholder="e.g. Team NeuralSurf"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder:text-slate-600 text-sm font-sans focus:outline-none focus:border-cyan-400 mb-2"
        />

        <div className="flex flex-wrap gap-2">
          {PRESET_TEAMS.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => updateConfig('teamName', team)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                config.teamName === team
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Builder Title Generator */}
      <BuilderTitleGenerator
        currentTitle={config.builderTitle}
        onSelectTitle={(title) => updateConfig('builderTitle', title)}
      />

      {/* 4. Stack / Role */}
      <div>
        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          <span>Stack / Specialty Role</span>
        </label>
        <input
          type="text"
          value={config.role}
          onChange={(e) => updateConfig('role', e.target.value)}
          placeholder="e.g. Full Stack & AI"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder:text-slate-600 text-sm font-sans focus:outline-none focus:border-cyan-400 mb-2"
        />

        <div className="flex flex-wrap gap-2">
          {DEFAULT_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => updateConfig('role', role)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                config.role === role
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Motto / Slogan */}
      <div>
        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span>Short Motto / Bio (Optional)</span>
        </label>
        <input
          type="text"
          value={config.motto}
          onChange={(e) => updateConfig('motto', e.target.value)}
          placeholder='e.g. "Shipped in Goa 🌴"'
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder:text-slate-600 text-sm font-sans focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* 6. Card Theme Picker */}
      <div>
        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span>Card Theme</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {IDCARD_THEMES.map((theme) => {
            const isSelected = config.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => updateConfig('theme', theme.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                    : 'border-white/10 bg-slate-900/60 hover:bg-slate-800 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/30"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
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

    </div>
  );
};
