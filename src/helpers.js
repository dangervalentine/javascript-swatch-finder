export { kMeansClustering, samplePixels } from "./kmeans";
export { classifyTiers } from "./tierClassifier";
export { rgbToHex, rgbToHsl, formatColor } from "./colorUtils";

export const copyToClipboard = (str) => {
  navigator.clipboard.writeText(str);
};

export const changeBackground = (str) => {
  document.body.style.backgroundColor = str;
};
