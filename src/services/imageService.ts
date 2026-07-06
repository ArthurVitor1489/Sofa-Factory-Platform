import { supabase } from '@/lib/supabase';

/**
 * Image processing service.
 * Implements client-side image compression and conversion to WebP
 * for thumb.webp, medium.webp, and large.webp variants.
 */

interface ResizeOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

const VARIANTS = {
  thumb: { maxWidth: 150, maxHeight: 150, quality: 0.7 },
  medium: { maxWidth: 600, maxHeight: 600, quality: 0.8 },
  large: { maxWidth: 1200, maxHeight: 1200, quality: 0.85 },
};

/**
 * Resizes and compresses an image file to a WebP blob using Canvas API.
 * This runs on the client-side to minimize upload bandwidth.
 */
export async function resizeImageToWebP(file: File, options: ResizeOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If not running in a browser, return the original file
    if (typeof window === 'undefined') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > options.maxWidth) {
            height = Math.round((height * options.maxWidth) / width);
            width = options.maxWidth;
          }
        } else {
          if (height > options.maxHeight) {
            width = Math.round((width * options.maxHeight) / height);
            height = options.maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export canvas to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob returned null'));
            }
          },
          'image/webp',
          options.quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image element'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

/**
 * Generates all WebP variants (thumb, medium, large) for a single image file.
 */
export async function generateImageVariants(file: File): Promise<{
  thumb: Blob;
  medium: Blob;
  large: Blob;
}> {
  try {
    const thumb = await resizeImageToWebP(file, VARIANTS.thumb);
    const medium = await resizeImageToWebP(file, VARIANTS.medium);
    const large = await resizeImageToWebP(file, VARIANTS.large);

    return { thumb, medium, large };
  } catch (error) {
    console.error('Error generating image variants, falling back to original file:', error);
    // Fallback to original file for robustness
    return { thumb: file, medium: file, large: file };
  }
}

/**
 * Helper to upload image variants to Supabase Storage (or fallback to a mock URL)
 */
export async function uploadProductImage(
  productId: string,
  imageFile: File
): Promise<{ thumbUrl: string; mediumUrl: string; largeUrl: string }> {
  // If in mock mode, return local asset references or object URLs
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mockproject');

  if (isMock) {
    // Generate a temporary browser URL for live previews, or fallback to default
    if (typeof window !== 'undefined') {
      const previewUrl = URL.createObjectURL(imageFile);
      return {
        thumbUrl: previewUrl,
        mediumUrl: previewUrl,
        largeUrl: previewUrl,
      };
    }
    return {
      thumbUrl: '/images/sofa_retratil.png',
      mediumUrl: '/images/sofa_retratil.png',
      largeUrl: '/images/sofa_retratil.png',
    };
  }

  // Production Supabase storage upload code
  try {
    const { thumb, medium, large } = await generateImageVariants(imageFile);
    const timestamp = Date.now();
    const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9]/g, '_');

    // Upload Large
    const largePath = `products/${productId}/${timestamp}_large.webp`;
    const { data: largeData, error: largeErr } = await supabase.storage
      .from('imagens')
      .upload(largePath, large, { contentType: 'image/webp' });
    if (largeErr) throw largeErr;

    // Upload Medium
    const mediumPath = `products/${productId}/${timestamp}_medium.webp`;
    const { error: mediumErr } = await supabase.storage
      .from('imagens')
      .upload(mediumPath, medium, { contentType: 'image/webp' });
    if (mediumErr) throw mediumErr;

    // Upload Thumb
    const thumbPath = `products/${productId}/${timestamp}_thumb.webp`;
    const { error: thumbErr } = await supabase.storage
      .from('imagens')
      .upload(thumbPath, thumb, { contentType: 'image/webp' });
    if (thumbErr) throw thumbErr;

    // Retrieve public URLs
    const getPublicUrl = (path: string) => supabase.storage.from('imagens').getPublicUrl(path).data.publicUrl;

    return {
      largeUrl: getPublicUrl(largePath),
      mediumUrl: getPublicUrl(mediumPath),
      thumbUrl: getPublicUrl(thumbPath),
    };
  } catch (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
}
