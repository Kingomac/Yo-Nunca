import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
  root: "./public",
  build: {
    outDir: "../dist",
  },
  server: {
    port: 8080,
  },
  plugins: [
    svelte({
      preprocess: [sveltePreprocess({ typescript: true })],
    }),
  ],
});
