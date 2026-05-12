export function samplePixels(pixels, maxSamples) {
  if (pixels.length <= maxSamples) return pixels;
  const stride = pixels.length / maxSamples;
  const sampled = [];
  for (let i = 0; i < maxSamples; i++) {
    sampled.push(pixels[Math.floor(i * stride)]);
  }
  return sampled;
}

function distanceSquared(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

function initCenters(pixels, k) {
  const centers = [pixels[Math.floor(Math.random() * pixels.length)]];
  for (let c = 1; c < k; c++) {
    const distances = pixels.map((p) => {
      let minDist = Infinity;
      for (const center of centers) {
        minDist = Math.min(minDist, distanceSquared(p, center));
      }
      return minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    if (totalDist === 0) break;
    let threshold = Math.random() * totalDist;
    for (let i = 0; i < pixels.length; i++) {
      threshold -= distances[i];
      if (threshold <= 0) {
        centers.push(pixels[i]);
        break;
      }
    }
  }
  return centers;
}

export function kMeansClustering(pixels, k, options = {}) {
  const { maxIterations = 20, tolerance = 1 } = options;
  if (pixels.length === 0) return [];
  const uniqueSet = new Set(pixels.map((p) => p.join(",")));
  const effectiveK = Math.min(k, uniqueSet.size);
  if (effectiveK <= 0) return [];
  let centers = initCenters(pixels, effectiveK);
  let assignments = new Array(pixels.length);
  for (let iter = 0; iter < maxIterations; iter++) {
    for (let i = 0; i < pixels.length; i++) {
      let minDist = Infinity;
      let minIdx = 0;
      for (let c = 0; c < centers.length; c++) {
        const dist = distanceSquared(pixels[i], centers[c]);
        if (dist < minDist) {
          minDist = dist;
          minIdx = c;
        }
      }
      assignments[i] = minIdx;
    }
    const newCenters = centers.map(() => [0, 0, 0]);
    const counts = new Array(centers.length).fill(0);
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      newCenters[c][0] += pixels[i][0];
      newCenters[c][1] += pixels[i][1];
      newCenters[c][2] += pixels[i][2];
      counts[c]++;
    }
    let maxShift = 0;
    for (let c = 0; c < centers.length; c++) {
      if (counts[c] === 0) {
        newCenters[c] = centers[c];
      } else {
        newCenters[c] = [
          Math.round(newCenters[c][0] / counts[c]),
          Math.round(newCenters[c][1] / counts[c]),
          Math.round(newCenters[c][2] / counts[c]),
        ];
      }
      const shift = Math.sqrt(distanceSquared(centers[c], newCenters[c]));
      maxShift = Math.max(maxShift, shift);
    }
    centers = newCenters;
    if (maxShift <= tolerance) break;
  }
  const counts = new Array(centers.length).fill(0);
  for (let i = 0; i < assignments.length; i++) {
    counts[assignments[i]]++;
  }
  return centers
    .map((color, i) => ({ color, count: counts[i] }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}
