import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { loadImageSource, ImageLoadResult } from '../utils/imageUtils';
import { SampleAvatar } from '../constants/samplePhotos';

interface ImageUploaderProps {
  onImageLoaded: (result: ImageLoadResult, fileOrUrl: File | string, sampleInfo?: SampleAvatar) => void;
  isLoading: boolean;
  currentImageLoaded: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageLoaded,
  isLoading,
  currentImageLoaded
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    try {
      const result = await loadImageSource(file);
      onImageLoaded(result, file);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load photo. Please try a valid image file (JPG, PNG, WEBP, HEIC, GIF, SVG, AVIF, BMP).');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      
      {/* Main Drag & Drop / Tap Box */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all cursor-pointer group ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : currentImageLoaded
            ? 'border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-400'
            : 'border-white/20 hover:border-amber-500/50 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        {/* Support any type of image extension */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileInputChange}
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.heic,.heif,.avif,.bmp,.tiff,.tif,.ico,.dng,.cr2,.nef"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
            currentImageLoaded
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-gradient-to-br from-amber-500/20 to-pink-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {currentImageLoaded ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-white mb-1">
              {currentImageLoaded ? 'Change Photo' : 'Upload Your Photo'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Drag & drop here, or tap to choose any photo from your device (JPG, PNG, WEBP, HEIC, GIF, SVG, AVIF, BMP, etc.)
            </p>
          </div>

          {currentImageLoaded && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Photo Loaded Successfully
            </span>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mt-3 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <span>{errorMessage}</span>
        </div>
      )}

    </div>
  );
};
