export function classifyTiers(colors) {
  if (colors.length === 0) return [];
  const total = colors.reduce((sum, c) => sum + c.count, 0);
  const withPct = colors.map((c) => ({
    ...c,
    percentage: (c.count / total) * 100,
  }));
  const maxPct = withPct[0].percentage;
  const minPct = withPct[withPct.length - 1].percentage;
  const isEven = maxPct < minPct * 1.5 || maxPct - minPct < 5;
  if (isEven && colors.length >= 3) {
    const third = Math.max(1, Math.floor(colors.length / 3));
    return withPct.map((c, i) => ({
      ...c,
      tier: i < third ? "dominant" : i < third * 2 ? "supporting" : "accent",
    }));
  }
  let dominantCount = 0;
  let cumulativePct = 0;
  for (let i = 0; i < withPct.length && dominantCount < 2; i++) {
    const pct = withPct[i].percentage;
    if (pct >= 20) {
      if (dominantCount === 1 && withPct[0].percentage / pct > 2) break;
      dominantCount++;
      cumulativePct += pct;
    } else {
      break;
    }
  }
  if (dominantCount === 0) {
    dominantCount = 1;
    cumulativePct = withPct[0].percentage;
  }
  let supportingCount = 0;
  const maxSupporting = Math.min(4, withPct.length - dominantCount);
  for (let i = dominantCount; i < withPct.length && supportingCount < maxSupporting; i++) {
    supportingCount++;
    cumulativePct += withPct[i].percentage;
    if (cumulativePct >= 85 && supportingCount >= 1) break;
  }
  if (supportingCount === 0 && withPct.length > dominantCount) {
    supportingCount = 1;
  }
  return withPct.map((c, i) => ({
    ...c,
    tier: i < dominantCount ? "dominant" : i < dominantCount + supportingCount ? "supporting" : "accent",
  }));
}
