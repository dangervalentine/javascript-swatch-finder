export function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b].map((v) => v.toString(16).toUpperCase().padStart(2, "0")).join("")
  );
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function formatColor(rgb, format) {
  const [r, g, b] = rgb;
  switch (format) {
    case "hex":
      return rgbToHex(r, g, b);
    case "rgb":
      return `rgb(${r}, ${g}, ${b})`;
    case "hsl":
      return rgbToHsl(r, g, b);
    default:
      return rgbToHex(r, g, b);
  }
}
