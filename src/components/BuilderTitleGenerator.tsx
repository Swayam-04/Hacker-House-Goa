import React from 'react';
import { Dices, Sparkles } from 'lucide-react';
import { PRESET_BUILDER_TITLES, getRandomBuilderTitle } from '../constants/builderTitles';

interface BuilderTitleGeneratorProps {
  currentTitle: string;
  onSelectTitle: (title: string) => void;
}

export const BuilderTitleGenerator: React.FC<BuilderTitleGeneratorProps> = ({
  currentTitle,
  onSelectTitle
}) => {
  const handleRandomize = () => {
    const random = getRandomBuilderTitle();
    onSelectTitle(random);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Builder Title</span>
        </label>
        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-mono font-bold transition-all shadow-sm group"
        >
          <Dices className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
          <span>Randomize Title</span>
        </button>
      </div>

      {/* Input box */}
      <input
        type="text"
        value={currentTitle}
        onChange={(e) => onSelectTitle(e.target.value)}
        placeholder="e.g. AI Architect"
        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-white placeholder:text-slate-600 text-sm font-mono focus:outline-none focus:border-cyan-400"
      />

      {/* Quick Select Title Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {PRESET_BUILDER_TITLES.slice(0, 8).map((title) => {
          const isSelected = currentTitle === title;
          return (
            <button
              key={title}
              type="button"
              onClick={() => onSelectTitle(title)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-black font-extrabold shadow-md'
                  : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
