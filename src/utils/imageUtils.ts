import heic2any from 'heic2any';

export interface ImageLoadResult {
  image: HTMLImageElement;
  bitmap?: ImageBitmap;
  originalFile?: File;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: 'portrait' | 'landscape' | 'square';
}

/**
 * Reads a File object into a Data URL string as a fallback for any non-standard image extension
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('FileReader result is empty'));
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Universal Image Loader — Supports JPG, PNG, WEBP, HEIC, HEIF, GIF, SVG, AVIF, BMP, TIFF, ICO, and all standard/custom image file extensions.
 */
export async function loadImageSource(source: File | string): Promise<ImageLoadResult> {
  let objectUrl: string = '';
  let originalFile: File | undefined = undefined;

  if (source instanceof File) {
    originalFile = source;
    const fileNameLower = source.name.toLowerCase();
    const isHeic = fileNameLower.endsWith('.heic') || fileNameLower.endsWith('.heif') || source.type.includes('heic') || source.type.includes('heif');

    if (isHeic) {
      try {
        const convertedBlob = await heic2any({
          blob: source,
          toType: 'image/jpeg',
          quality: 0.95
        });
        const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        objectUrl = URL.createObjectURL(blobToUse);
      } catch (err) {
        console.warn('HEIC client-side conversion fallback:', err);
        try {
          objectUrl = await readFileAsDataURL(source);
        } catch (e) {
          objectUrl = URL.createObjectURL(source);
        }
      }
    } else {
      try {
        objectUrl = URL.createObjectURL(source);
      } catch (e) {
        objectUrl = await readFileAsDataURL(source);
      }
    }
  } else {
    objectUrl = source;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // SVG or vector image fallback bounds
      if (!width || width <= 0) width = 1200;
      if (!height || height <= 0) height = 1200;

      const aspectRatio = width / height;
      let orientation: 'portrait' | 'landscape' | 'square' = 'square';
      if (aspectRatio > 1.05) orientation = 'landscape';
      else if (aspectRatio < 0.95) orientation = 'portrait';

      let bitmap: ImageBitmap | undefined = undefined;
      if (typeof createImageBitmap === 'function') {
        try {
          bitmap = await createImageBitmap(img);
        } catch (e) {
          // ignore bitmap fallback
        }
      }

      resolve({
        image: img,
        bitmap,
        originalFile,
        width,
        height,
        aspectRatio,
        orientation
      });
    };

    img.onerror = async () => {
      // Secondary fallback attempt using FileReader DataURL if objectUrl failed
      if (source instanceof File && !objectUrl.startsWith('data:')) {
        try {
          const dataUrl = await readFileAsDataURL(source);
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';

          fallbackImg.onload = () => {
            let width = fallbackImg.naturalWidth || fallbackImg.width || 1200;
            let height = fallbackImg.naturalHeight || fallbackImg.height || 1200;
            const aspectRatio = width / height;

            resolve({
              image: fallbackImg,
              originalFile,
              width,
              height,
              aspectRatio,
              orientation: aspectRatio > 1.05 ? 'landscape' : aspectRatio < 0.95 ? 'portrait' : 'square'
            });
          };

          fallbackImg.onerror = () => {
            reject(new Error('Failed to parse image file. Please select a valid photo file (JPG, PNG, WEBP, HEIC, GIF, SVG, AVIF, BMP, TIFF).'));
          };

          fallbackImg.src = dataUrl;
          return;
        } catch (e) {
          // ignore fallback
        }
      }

      reject(new Error('Failed to parse image file. Please select a valid photo file (JPG, PNG, WEBP, HEIC, GIF, SVG, AVIF, BMP, TIFF).'));
    };

    img.src = objectUrl;
  });
}

/**
 * Calculates cover-crop destination coordinates on target canvas
 */
export function calculateCoverCrop(
  imgWidth: number,
  imgHeight: number,
  targetWidth: number,
  targetHeight: number,
  scale: number = 1,
  offsetX: number = 0,
  offsetY: number = 0
) {
  const imgRatio = imgWidth / imgHeight;
  const targetRatio = targetWidth / targetHeight;

  let drawW: number;
  let drawH: number;

  if (imgRatio > targetRatio) {
    drawH = targetHeight * scale;
    drawW = drawH * imgRatio;
  } else {
    drawW = targetWidth * scale;
    drawH = drawW / imgRatio;
  }

  const cropX = (targetWidth - drawW) / 2 + offsetX;
  const cropY = (targetHeight - drawH) / 2 + offsetY;

  return {
    x: cropX,
    y: cropY,
    width: drawW,
    height: drawH
  };
}
