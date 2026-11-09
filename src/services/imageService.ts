/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProcessedImage {
  dataUrl: string;
  name: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

/**
 * Format bytes into readable KB/MB string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Read and optionally optimize an image file from the user's device
 * Uses HTML5 Canvas for safe in-browser proportional scaling and compression.
 */
export async function processImageFile(
  file: File,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.85
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    // SVG files should be read as-is without canvas rasterization
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          dataUrl: reader.result as string,
          name: file.name,
          width: 800,
          height: 600,
          size: file.size,
          format: 'svg',
        });
      };
      reader.onerror = () => reject(new Error('Failed to read SVG file.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Determine if scaling is needed
        let scale = 1;
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          scale = Math.min(widthRatio, heightRatio);
        }

        const targetWidth = Math.round(width * scale);
        const targetHeight = Math.round(height * scale);

        // If file is already small and does not need downscaling, preserve as is
        if (scale >= 1 && file.size < 400 * 1024) {
          resolve({
            dataUrl: rawDataUrl,
            name: file.name,
            width,
            height,
            size: file.size,
            format: file.type.replace('image/', ''),
          });
          return;
        }

        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({
              dataUrl: rawDataUrl,
              name: file.name,
              width,
              height,
              size: file.size,
              format: file.type.replace('image/', ''),
            });
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Output as JPEG for photographic articles, or PNG if original was PNG with potential transparency
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);

          // Estimate data url size in bytes
          const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
          const estimatedSize = Math.round((base64Length * 3) / 4);

          resolve({
            dataUrl: compressedDataUrl,
            name: file.name,
            width: targetWidth,
            height: targetHeight,
            size: estimatedSize,
            format: mimeType.replace('image/', ''),
          });
        } catch {
          // Fallback to raw data url if canvas has security/taint issues
          resolve({
            dataUrl: rawDataUrl,
            name: file.name,
            width,
            height,
            size: file.size,
            format: file.type.replace('image/', ''),
          });
        }
      };

      img.onerror = () => {
        reject(new Error('Unable to decode image. Please check the file format.'));
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk.'));
    };

    reader.readAsDataURL(file);
  });
}

export const imageService = {
  uploadImage: async (file: File, _category = 'general') => {
    const res = await processImageFile(file, 800, 800, 0.85);
    return {
      url: res.dataUrl,
      name: res.name,
      width: res.width,
      height: res.height,
      size: res.size,
    };
  },
  processImageFile,
  formatBytes,
};

