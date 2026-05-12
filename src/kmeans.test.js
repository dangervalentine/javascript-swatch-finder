import { describe, it, expect } from "vitest";
import { kMeansClustering, samplePixels } from "./kmeans";

describe("samplePixels", () => {
  it("returns all pixels when under the cap", () => {
    const pixels = Array.from({ length: 50 }, (_, i) => [i, i, i]);
    const result = samplePixels(pixels, 500);
    expect(result).toHaveLength(50);
  });
  it("caps at maxSamples", () => {
    const pixels = Array.from({ length: 1000 }, (_, i) => [i % 256, 0, 0]);
    const result = samplePixels(pixels, 100);
    expect(result).toHaveLength(100);
  });
  it("returns valid RGB tuples", () => {
    const pixels = Array.from({ length: 1000 }, (_, i) => [i % 256, 128, 64]);
    const result = samplePixels(pixels, 50);
    result.forEach((p) => {
      expect(p).toHaveLength(3);
      p.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(255);
      });
    });
  });
});

describe("kMeansClustering", () => {
  it("returns k clusters", () => {
    const pixels = [[255,0,0],[250,5,5],[0,0,255],[5,5,250],[0,255,0],[5,250,5]];
    const result = kMeansClustering(pixels, 3);
    expect(result).toHaveLength(3);
  });
  it("each cluster has color and count", () => {
    const pixels = [[255,0,0],[0,255,0]];
    const result = kMeansClustering(pixels, 2);
    result.forEach((cluster) => {
      expect(cluster).toHaveProperty("color");
      expect(cluster).toHaveProperty("count");
      expect(cluster.color).toHaveLength(3);
      expect(cluster.count).toBeGreaterThanOrEqual(1);
    });
  });
  it("counts sum to total pixel count", () => {
    const pixels = Array.from({ length: 100 }, (_, i) => [i % 256, 128, 64]);
    const result = kMeansClustering(pixels, 5);
    const totalCount = result.reduce((sum, c) => sum + c.count, 0);
    expect(totalCount).toBe(100);
  });
  it("clusters similar colors together", () => {
    const reds = Array.from({ length: 50 }, () => [240 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 15), Math.floor(Math.random() * 15)]);
    const blues = Array.from({ length: 50 }, () => [Math.floor(Math.random() * 15), Math.floor(Math.random() * 15), 240 + Math.floor(Math.random() * 15)]);
    const result = kMeansClustering([...reds, ...blues], 2);
    const sorted = result.sort((a, b) => b.color[0] - a.color[0]);
    expect(sorted[0].color[0]).toBeGreaterThan(200);
    expect(sorted[1].color[2]).toBeGreaterThan(200);
  });
  it("returns sorted by count descending", () => {
    const pixels = [...Array.from({ length: 80 }, () => [255, 0, 0]), ...Array.from({ length: 20 }, () => [0, 0, 255])];
    const result = kMeansClustering(pixels, 2);
    expect(result[0].count).toBeGreaterThanOrEqual(result[1].count);
  });
  it("handles k larger than unique colors", () => {
    const pixels = [[255,0,0],[0,255,0]];
    const result = kMeansClustering(pixels, 5);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.length).toBeLessThanOrEqual(5);
  });
});
