import React, { useRef } from 'react';
import { ImageTransform } from '../types/frame';
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Upload } from 'lucide-react';
import { loadImageSource, ImageLoadResult } from '../utils/imageUtils';

interface EditorToolbarProps {
  transform: ImageTransform;
  onChangeTransform: (newTransform: ImageTransform) => void;
  onResetTransform: () => void;
  onReplaceImage: (result: ImageLoadResult) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  transform,
  onChangeTransform,
  onResetTransform,
  onReplaceImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoomChange = (newScale: number) => {
    const clamped = Math.min(Math.max(0.5, newScale), 4.0);
    onChangeTransform({
      ...transform,
      scale: parseFloat(clamped.toFixed(2))
    });
  };

  const handleRotateStep = () => {
    const nextAngle = (transform.rotation + 90) % 360;
    onChangeTransform({
      ...transform,
      rotation: nextAngle > 180 ? nextAngle - 360 : nextAngle
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const loaded = await loadImageSource(e.target.files[0]);
        onReplaceImage(loaded);
      } catch (err) {
        console.error('Failed to replace image:', err);
      }
    }
  };

  return (
    <div className="w-full glass-panel p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Hidden file input for Replace Image */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
      />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleZoomChange(transform.scale - 0.15)}
          className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.05"
          value={transform.scale}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-24 sm:w-32 accent-amber-500 cursor-pointer"
        />

        <button
          type="button"
          onClick={() => handleZoomChange(transform.scale + 0.15)}
          className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] text-slate-400 min-w-[40px]">
          {Math.round(transform.scale * 100)}%
        </span>
      </div>

      {/* Action Buttons: Rotate, Reset, Replace */}
      <div className="flex items-center gap-2">
        
        {/* Rotate Button */}
        <button
          type="button"
          onClick={handleRotateStep}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-amber-400 font-mono font-semibold flex items-center gap-1.5 transition-colors"
          title="Rotate 90°"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{transform.rotation}°</span>
        </button>

        {/* Reset Transform */}
        <button
          type="button"
          onClick={onResetTransform}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400 hover:text-white font-mono flex items-center gap-1.5 transition-colors"
          title="Reset Image Fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        {/* Replace Image */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-mono font-bold flex items-center gap-1.5 transition-colors"
          title="Replace Photo"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Replace</span>
        </button>

      </div>

    </div>
  );
};
