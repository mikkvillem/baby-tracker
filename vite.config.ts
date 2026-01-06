import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    preact(),
    cloudflare()

  ],
})
