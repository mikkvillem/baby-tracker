import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		preact(),
		cloudflare(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["logo.svg"],
			manifest: {
				name: "Baby Tracker",
				short_name: "Baby Tracker",
				description: "Track feedings, sleep, and diaper changes for your baby.",
				theme_color: "#fce7f3",
				background_color: "#fce7f3",
				display: "standalone",
				start_url: "/",
				scope: "/",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
					{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
					{
						src: "/icons/icon-192-maskable.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable",
					},
					{
						src: "/icons/icon-512-maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "google-fonts-stylesheets",
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-webfonts",
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
		}),
	],
});
