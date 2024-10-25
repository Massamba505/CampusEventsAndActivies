import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

// Import the configuration to test
import postcssConfig from "/postcss.config.js";

describe("PostCSS Configuration", () => {
  it("should include tailwindcss plugin", () => {
    expect(postcssConfig.plugins).toHaveProperty("tailwindcss");
    expect(postcssConfig.plugins.tailwindcss).toBeDefined();
  });

  it("should include autoprefixer plugin", () => {
    expect(postcssConfig.plugins).toHaveProperty("autoprefixer");
    expect(postcssConfig.plugins.autoprefixer).toBeDefined();
  });
});
