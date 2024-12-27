import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  publicDir: "public", // Ensure public directory is configured correctly
  build: {
    outDir: "dist", // Ensure build output goes to the "dist" directory
    emptyOutDir: true, // Clean the output directory before building
  },
  resolve: {
    alias: {
      "@": "/src", // Optional: Alias for cleaner imports
    },
  },
});
