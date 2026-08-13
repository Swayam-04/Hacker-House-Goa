import React from 'react';
import { Download, Share2, Sparkles, Sliders, Maximize2 } from 'lucide-react';
import { AppFormat, PFPFrameConfig, IDCardConfig, ImageTransform } from '../types/frame';
import { InteractiveCanvasPreview } from './InteractiveCanvasPreview';
import { EditorToolbar } from './EditorToolbar';
import { ImageLoadResult } from '../utils/imageUtils';

interface PreviewPanelProps {
  userImg: HTMLImageElement | null;
  format: AppFormat;
  pfpConfig: PFPFrameConfig;
  idCardConfig: IDCardConfig;
  onChangeTransform: (newTransform: ImageTransform) => void;
  onResetTransform: () => void;
  onReplaceImage: (result: ImageLoadResult) => void;
  onDownload: () => void;
  onOpenShareModal: () => void;
  onToggleAdjuster: () => void;
  onOpenFullScreen: () => void;
  showAdjuster: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  userImg,
  format,
  pfpConfig,
  idCardConfig,
  onChangeTransform,
  onResetTransform,
  onReplaceImage,
  onDownload,
  onOpenShareModal,
  onToggleAdjuster,
  onOpenFullScreen,
  showAdjuster
}) => {
  const formatTitle = format === 'PFP_FRAME' ? 'Format A — Profile Overlay' : 'Format B — Builder ID Card';
  const currentTransform = format === 'PFP_FRAME' ? pfpConfig.transform : idCardConfig.transform;

  return (
    <div className="w-full glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col items-center">
      
      {/* Header Info */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
            Live Interactive Editor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {userImg && (
            <button
              onClick={onOpenFullScreen}
              className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
              title="Full Screen Preview"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 font-mono text-xs font-bold text-slate-300">
            {formatTitle}
          </span>
        </div>
      </div>

      {/* Interactive Live Canvas Viewport */}
      <div className="w-full relative">
        <InteractiveCanvasPreview
          userImg={userImg}
          format={format}
          pfpConfig={pfpConfig}
          idCardConfig={idCardConfig}
          onTransformChange={onChangeTransform}
        />
        
        {/* Top-Right Expand Button on Canvas */}
        {userImg && (
          <button
            onClick={onOpenFullScreen}
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/75 backdrop-blur-md text-slate-300 hover:text-amber-400 border border-white/20 shadow-lg hover:scale-105 transition-all"
            title="Expand to Full Screen Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Compact Canvas Editor Toolbar */}
      {userImg && (
        <EditorToolbar
          transform={currentTransform}
          onChangeTransform={onChangeTransform}
          onResetTransform={onResetTransform}
          onReplaceImage={onReplaceImage}
        />
      )}

      {/* Primary Desktop Action Buttons */}
      {userImg && (
        <div className="w-full pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-3">
          
          <button
            onClick={onToggleAdjuster}
            className={`py-3.5 px-4 rounded-2xl text-xs font-bold font-mono flex items-center justify-center gap-2 border transition-all ${
              showAdjuster
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>{showAdjuster ? 'Hide Sliders' : 'All Sliders'}</span>
          </button>

          <button
            onClick={onDownload}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/20 text-white font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-amber-600 hover:from-amber-600 hover:to-pink-600 text-white font-display font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <Share2 className="w-4 h-4" />
            <span>Share to X (#FrameInGoa)</span>
          </button>

        </div>
      )}

    </div>
  );
};
