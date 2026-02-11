export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => reject(error);
    image.src = url;
  });
}

export async function resizeImage(file, maxSize = 800, quality = 0.85) {
  const image = await loadImage(file);
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/jpeg", quality);
  });

  return blob;
}

export function getStoragePathFromUrl(url) {
  if (!url) return null;
  const match = url.match(/\/o\/([^?]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}
