import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "src/routes",
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  define: {
    "import.meta.env.VITE_OFFICIAL_ORIGIN": JSON.stringify(
      process.env.VITE_OFFICIAL_ORIGIN || "coldvault.dev",
    ),
    "import.meta.env.VITE_BUILD_COMMIT": JSON.stringify(
      process.env.VITE_BUILD_COMMIT || process.env.GITHUB_SHA || "dev",
    ),
    "import.meta.env.VITE_BUILD_REPO": JSON.stringify(
      process.env.VITE_BUILD_REPO || process.env.GITHUB_REPOSITORY || "local",
    ),
  },
  server: {
    host: "::",
    port: 8080,
  },
});
