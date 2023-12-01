import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";
import node from "@astrojs/node";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  server: {
    port: 3000,
  },
  vite: {
    optimizeDeps: {
      exclude: ["crypto"],
    },
  },
  adapter: netlify(),
  ssr: true,
  integrations: [react()],
});
