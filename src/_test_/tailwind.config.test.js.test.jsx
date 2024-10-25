// tailwind.config.test.js
import tailwindConfig from "/tailwind.config.js"; // adjust the path if needed
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("Tailwind CSS Configuration", () => {
  it("should include custom infinite-scroll animation", () => {
    const animations = tailwindConfig.theme.extend.animation;
    expect(animations["infinite-scroll"]).toBe(
      "infinite-scroll 25s linear infinite"
    );
  });

  it("should include custom infinite-scroll keyframes", () => {
    const keyframes = tailwindConfig.theme.extend.keyframes["infinite-scroll"];
    expect(keyframes).toEqual({
      from: { transform: "translateX(0)" },
      to: { transform: "translateX(-100%)" },
    });
  });

  it("should have daisyui themes enabled", () => {
    const daisyuiConfig = tailwindConfig.theme.daisyui.themes;
    expect(daisyuiConfig).toContain("light");
    expect(daisyuiConfig).toContain("dark");
    expect(daisyuiConfig).toContain("cupcake");
  });

  it("should include required plugins", () => {
    const plugins = tailwindConfig.plugins;
    expect(plugins.length).toBeGreaterThan(0);
  });

  it("should have correct content paths", () => {
    const contentPaths = tailwindConfig.content;
    expect(contentPaths).toContain("./index.html");
    expect(contentPaths).toContain("./src/**/*.{js,ts,jsx,tsx}");
  });
});
