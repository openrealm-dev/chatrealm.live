import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  build: {
    minify: "terser",
    target: "esnext",
  },
  plugins: [
    Icons({
      autoInstall: true,
      compiler: "solid",
    }),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
});
