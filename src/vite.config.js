import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// __dirname isn't available in ESM (package.json sets "type": "module"),
// so it has to be derived from import.meta.url instead.
const __dirname = dirname(fileURLToPath(import.meta.url));

// IMPORTANT for GitHub Pages: a project site (not a username.github.io
// user site) is served from https://<username>.github.io/<repo-name>/,
// not from the domain root. Vite needs to know that sub-path so it can
// correctly prefix the script/css/asset URLs it generates at build time.
// Replace "sleepoutside" below with your actual repo name.
const repoName = "wdd330";

export default defineConfig(({ command }) => ({
  // use "/" for local dev (npm run dev) and "/repo-name/" for the
  // production build (npm run build) that gets deployed to GitHub Pages.
  base: command === "build" ? `/${repoName}/` : "/",
  root: "src",
  publicDir: "public",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        product_listing: resolve(__dirname, "src/product_listing/index.html"),
        product_pages: resolve(__dirname, "src/product_pages/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
      },
    },
  },
}));
