/**
 * Utility functions for client-side image compression and Base64 conversion
 * prior to uploading to RevalueIQ backend APIs.
 */

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let result = reader.result as string;
      // Ensure data URI has valid image MIME format
      if (result.startsWith("data:application/octet-stream;") || result.startsWith("data:;")) {
        result = result.replace(/^data:[^;]*/, "data:image/jpeg");
      }
      resolve(result);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const compressImage = async (file: File, maxDimension: number = 1200): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width || 800;
        canvas.height = height || 600;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        
        // Fill white background for transparent images
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const fileName = (file.name || "device_photo").replace(/\.[^/.]+$/, "") + ".jpg";
            const compressedFile = new File([blob], fileName, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          0.82
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
