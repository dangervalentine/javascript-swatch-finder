export { kMeansClustering, samplePixels } from "./kmeans";
export { classifyTiers } from "./tierClassifier";
export { rgbToHex, rgbToHsl, formatColor } from "./colorUtils";

export const copyToClipboard = (str) => {
  navigator.clipboard.writeText(str);
};

export const changeBackground = (str) => {
  document.body.style.backgroundColor = str;
};

// Legacy export — used by App.jsx until Task 11 rewrites it
export function weighColors(colorArr) {
  for (var i = 0; i < colorArr.length; i++) {
    var color1 = colorArr[i];
    for (var j = i + 1; j < colorArr.length; j++) {
      var color2 = colorArr[j];
      if (colorDelta(color1.color, color2.color) > 0.95) {
        color1.weight++;
        colorArr.splice(j--, 1);
      }
    }
  }
  return colorArr;
}

function colorDelta(color1, color2) {
  var r = 255 - Math.abs(color1[0] - color2[0]);
  var g = 255 - Math.abs(color1[1] - color2[1]);
  var b = 255 - Math.abs(color1[2] - color2[2]);
  r /= 255;
  g /= 255;
  b /= 255;
  return (r + g + b) / 3;
}
