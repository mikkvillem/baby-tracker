import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [TanStackRouterVite(), preact(), cloudflare(), tailwindcss()],
});
