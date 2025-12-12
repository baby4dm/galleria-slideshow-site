import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import htmlInject from "vite-plugin-html-inject";

export default defineConfig({
  base: "/galleria-slideshow-site/",
  plugins: [
    tailwindcss(),
    htmlInject({
      injectData: {
        header: "/src/components/Header.html",
      },
    }),
  ],
});
