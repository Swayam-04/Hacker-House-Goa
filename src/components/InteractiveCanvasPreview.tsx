import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppFormat, PFPFrameConfig, IDCardConfig, ImageTransform } from '../types/frame';
import { drawPFPFrameToCanvas } from '../utils/canvas/renderPFPFrame';
import { drawBuilderCardToCanvas } from '../utils/canvas/renderBuilderCard';
import { Loader2 } from 'lucide-react';

interface InteractiveCanvasPreviewProps {
  userImg: HTMLImageElement | null;
  format: AppFormat;
  pfpConfig: PFPFrameConfig;
  idCardConfig: IDCardConfig;
  onTransformChange: (newTransform: ImageTransform) => void;
  isGenerating?: boolean;
}

export const InteractiveCanvasPreview: React.FC<InteractiveCanvasPreviewProps> = ({
  userImg,
  format,
  pfpConfig,
  idCardConfig,
  onTransformChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gesture state tracking
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialTransform = useRef<ImageTransform>({ x: 0, y: 0, scale: 1, rotation: 0, brightness: 100, contrast: 100 });
  const touchPinchDist = useRef<number | null>(null);

  const currentTransform = format === 'PFP_FRAME' ? pfpConfig.transform : idCardConfig.transform;
  const requestRef = useRef<number | null>(null);

  // Single Render Pipeline: Always use full 2048px canvas resolution for internal composition
  const performRender = useCallback(() => {
    if (!canvasRef.current || !userImg) return;

    const renderW = 2048;
    const renderH = format === 'PFP_FRAME' ? 2048 : 2560;

    if (format === 'PFP_FRAME') {
      drawPFPFrameToCanvas(canvasRef.current, userImg, pfpConfig, renderW, renderH);
    } else {
      drawBuilderCardToCanvas(canvasRef.current, userImg, idCardConfig, renderW, renderH);
    }
  }, [userImg, format, pfpConfig, idCardConfig]);

  useEffect(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(() => {
      performRender();
    });

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [performRender]);

  // --- MOUSE HANDLERS FOR DRAG & ZOOM ---

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    initialTransform.current = { ...currentTransform };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const scaleFactor = canvasRect ? 2048 / canvasRect.width : 4;

    onTransformChange({
      ...initialTransform.current,
      x: initialTransform.current.x + dx * scaleFactor,
      y: initialTransform.current.y + dy * scaleFactor
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    const newScale = Math.min(Math.max(0.5, currentTransform.scale + delta), 4.0);

    onTransformChange({
      ...currentTransform,
      scale: parseFloat(newScale.toFixed(2))
    });
  };

  // --- TOUCH HANDLERS FOR MOBILE DRAG & PINCH-ZOOM ---

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialTransform.current = { ...currentTransform };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchPinchDist.current = dist;
      initialTransform.current = { ...currentTransform };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartPos.current.x;
      const dy = e.touches[0].clientY - dragStartPos.current.y;

      const canvasRect = canvasRef.current?.getBoundingClientRect();
      const scaleFactor = canvasRect ? 2048 / canvasRect.width : 4;

      onTransformChange({
        ...initialTransform.current,
        x: initialTransform.current.x + dx * scaleFactor,
        y: initialTransform.current.y + dy * scaleFactor
      });
    } else if (e.touches.length === 2 && touchPinchDist.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const pinchFactor = dist / touchPinchDist.current;
      const newScale = Math.min(Math.max(0.5, initialTransform.current.scale * pinchFactor), 4.0);

      onTransformChange({
        ...currentTransform,
        scale: parseFloat(newScale.toFixed(2))
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchPinchDist.current = null;
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      
      {/* Aspect-Ratio Preserving Fluid Container */}
      <div 
        className={`relative w-full max-w-[480px] flex justify-center items-center overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-slate-950 ${
          format === 'PFP_FRAME' ? 'aspect-square' : 'aspect-[4/5]'
        }`}
      >
        {!userImg ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-500 font-mono text-xs gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <span>Loading photo canvas...</span>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
          />
        )}
      </div>

    </div>
  );
};
