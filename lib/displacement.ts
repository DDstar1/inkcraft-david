// Computes a Sobel-gradient displacement map from a garment image.
// Output encodes horizontal gradient in the R channel and vertical gradient
// in the G channel (128 = neutral / no displacement).
// The SVG feDisplacementMap filter reads R for X-shift and G for Y-shift.

const SIZE = 256; // process at reduced resolution for speed

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    // Cache-bust so the browser re-requests with CORS headers if needed
    img.src = src.includes("?") ? src : `${src}?_cors=1`;
  });
}

export async function computeDisplacementMap(garmentUrl: string): Promise<string> {
  const img = await loadImg(garmentUrl);

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const w = SIZE, h = SIZE;

  // Luminance grayscale
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    gray[i] =
      (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
  }

  // Sobel operator
  const sobelX = new Float32Array(w * h);
  const sobelY = new Float32Array(w * h);
  let maxX = 0.001, maxY = 0.001;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const sx =
        -gray[(y - 1) * w + (x - 1)] + gray[(y - 1) * w + (x + 1)] +
        -2 * gray[y * w + (x - 1)]   + 2 * gray[y * w + (x + 1)]   +
        -gray[(y + 1) * w + (x - 1)] + gray[(y + 1) * w + (x + 1)];
      const sy =
        -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)] +
         gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];
      sobelX[i] = sx;
      sobelY[i] = sy;
      if (Math.abs(sx) > maxX) maxX = Math.abs(sx);
      if (Math.abs(sy) > maxY) maxY = Math.abs(sy);
    }
  }

  // Encode: 128 = neutral, <128 = negative shift, >128 = positive shift
  const out = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    out[i * 4]     = Math.round((sobelX[i] / maxX) * 127 + 128); // R → X
    out[i * 4 + 1] = Math.round((sobelY[i] / maxY) * 127 + 128); // G → Y
    out[i * 4 + 2] = 128;
    out[i * 4 + 3] = 255;
  }

  ctx.putImageData(new ImageData(out, w, h), 0, 0);
  return canvas.toDataURL("image/png");
}
