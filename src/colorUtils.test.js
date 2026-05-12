import { describe, it, expect } from "vitest";
import { rgbToHex, rgbToHsl, formatColor } from "./colorUtils";

describe("rgbToHex", () => {
  it("converts black", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
  });

  it("converts white", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#FFFFFF");
  });

  it("converts a mid-range color", () => {
    expect(rgbToHex(45, 90, 123)).toBe("#2D5A7B");
  });

  it("pads single-digit hex values", () => {
    expect(rgbToHex(1, 2, 3)).toBe("#010203");
  });
});

describe("rgbToHsl", () => {
  it("converts black", () => {
    expect(rgbToHsl(0, 0, 0)).toBe("hsl(0, 0%, 0%)");
  });

  it("converts white", () => {
    expect(rgbToHsl(255, 255, 255)).toBe("hsl(0, 0%, 100%)");
  });

  it("converts pure red", () => {
    expect(rgbToHsl(255, 0, 0)).toBe("hsl(0, 100%, 50%)");
  });

  it("converts a mid-range color", () => {
    const result = rgbToHsl(45, 90, 123);
    expect(result).toMatch(/^hsl\(205, 46%, 33%\)$/);
  });
});

describe("formatColor", () => {
  it("formats as hex", () => {
    expect(formatColor([45, 90, 123], "hex")).toBe("#2D5A7B");
  });

  it("formats as rgb", () => {
    expect(formatColor([45, 90, 123], "rgb")).toBe("rgb(45, 90, 123)");
  });

  it("formats as hsl", () => {
    expect(formatColor([45, 90, 123], "hsl")).toBe("hsl(205, 46%, 33%)");
  });
});
