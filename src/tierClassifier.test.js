import { describe, it, expect } from "vitest";
import { classifyTiers } from "./tierClassifier";

describe("classifyTiers", () => {
  it("assigns tiers to a typical 8-color palette", () => {
    const colors = [
      { color: [0,0,0], count: 420 },
      { color: [50,50,50], count: 280 },
      { color: [100,0,0], count: 120 },
      { color: [0,100,0], count: 80 },
      { color: [0,0,100], count: 50 },
      { color: [200,200,0], count: 30 },
      { color: [200,0,200], count: 15 },
      { color: [0,200,200], count: 5 },
    ];
    const result = classifyTiers(colors);
    expect(result.filter((c) => c.tier === "dominant").length).toBeGreaterThanOrEqual(1);
    expect(result.filter((c) => c.tier === "dominant").length).toBeLessThanOrEqual(2);
    expect(result.filter((c) => c.tier === "supporting").length).toBeGreaterThanOrEqual(1);
    result.forEach((c) => {
      expect(["dominant", "supporting", "accent"]).toContain(c.tier);
    });
  });
  it("handles a 3-color palette", () => {
    const colors = [
      { color: [255,0,0], count: 60 },
      { color: [0,255,0], count: 25 },
      { color: [0,0,255], count: 15 },
    ];
    const result = classifyTiers(colors);
    expect(result).toHaveLength(3);
    expect(result[0].tier).toBe("dominant");
    expect(result[1].tier).toBe("supporting");
    expect(result[2].tier).toBe("accent");
  });
  it("handles evenly distributed colors", () => {
    const colors = Array.from({ length: 6 }, (_, i) => ({ color: [i*40,0,0], count: 100 }));
    const result = classifyTiers(colors);
    expect(result.filter((c) => c.tier === "dominant").length).toBeGreaterThanOrEqual(1);
    expect(result.filter((c) => c.tier === "supporting").length).toBeGreaterThanOrEqual(1);
    expect(result).toHaveLength(6);
  });
  it("includes percentage field", () => {
    const colors = [
      { color: [255,0,0], count: 75 },
      { color: [0,0,255], count: 25 },
    ];
    const result = classifyTiers(colors);
    expect(result[0].percentage).toBeCloseTo(75, 0);
    expect(result[1].percentage).toBeCloseTo(25, 0);
  });
  it("preserves original color and count", () => {
    const colors = [
      { color: [10,20,30], count: 50 },
      { color: [40,50,60], count: 50 },
    ];
    const result = classifyTiers(colors);
    expect(result[0].color).toEqual([10,20,30]);
    expect(result[0].count).toBe(50);
  });
  it("handles single color", () => {
    const colors = [{ color: [128,128,128], count: 100 }];
    const result = classifyTiers(colors);
    expect(result).toHaveLength(1);
    expect(result[0].tier).toBe("dominant");
    expect(result[0].percentage).toBe(100);
  });
});
