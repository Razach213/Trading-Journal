// Utility functions for image handling and compression

export const compressImage = (file: File, maxSizeKB: number = 500): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const maxWidth = 1200;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      // Try different quality levels to meet size requirement
      let quality = 0.8;
      let compressedDataUrl = '';

      const tryCompress = () => {
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeKB = (compressedDataUrl.length * 3) / 4 / 1024;

        if (sizeKB <= maxSizeKB || quality <= 0.1) {
          resolve(compressedDataUrl);
        } else {
          quality -= 0.1;
          setTimeout(tryCompress, 10);
        }
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): string | null => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeMB = 10;

  if (!validTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, or WebP)';
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size must be less than ${maxSizeMB}MB`;
  }

  return null;
};

export const getImageMetadata = (file: File, compressedDataUrl: string) => {
  return {
    originalName: file.name,
    size: file.size,
    type: file.type,
    compressedSize: (compressedDataUrl.length * 3) / 4 // Approximate size in bytes
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};