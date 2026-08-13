import React from 'react';
import { Sliders, RotateCw, ZoomIn, Move, RefreshCw, Sun } from 'lucide-react';
import { ImageTransform } from '../types/frame';

interface PhotoAdjusterProps {
  transform: ImageTransform;
  onChange: (tr: ImageTransform) => void;
  onReset: () => void;
}

export const PhotoAdjuster: React.FC<PhotoAdjusterProps> = ({
  transform,
  onChange,
  onReset
}) => {
  const updateField = (field: keyof ImageTransform, value: number) => {
    onChange({
      ...transform,
      [field]: value
    });
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h4 className="font-display text-sm font-bold text-white">Fine-Tune Photo Fit</h4>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 font-mono transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset Fit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Zoom Slider */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" /> Zoom
            </span>
            <span>{Math.round(transform.scale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.05"
            value={transform.scale}
            onChange={(e) => updateField('scale', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Rotation Slider */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-pink-400" /> Rotate
            </span>
            <span>{transform.rotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={transform.rotation}
            onChange={(e) => updateField('rotation', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Horizontal Position X */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-cyan-400" /> Position X
            </span>
            <span>{Math.round(transform.x)}px</span>
          </div>
          <input
            type="range"
            min="-300"
            max="300"
            step="5"
            value={transform.x}
            onChange={(e) => updateField('x', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Vertical Position Y */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-emerald-400" /> Position Y
            </span>
            <span>{Math.round(transform.y)}px</span>
          </div>
          <input
            type="range"
            min="-300"
            max="300"
            step="5"
            value={transform.y}
            onChange={(e) => updateField('y', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Brightness
            </span>
            <span>{transform.brightness}%</span>
          </div>
          <input
            type="range"
            min="70"
            max="130"
            step="2"
            value={transform.brightness}
            onChange={(e) => updateField('brightness', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-purple-400" /> Contrast
            </span>
            <span>{transform.contrast}%</span>
          </div>
          <input
            type="range"
            min="70"
            max="130"
            step="2"
            value={transform.contrast}
            onChange={(e) => updateField('contrast', parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>

      </div>
    </div>
  );
};
