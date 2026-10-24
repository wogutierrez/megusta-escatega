// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough', // 👈 Prevents auto-generating invalid IMAGES/ASSETS bindings
    session: false               // 👈 Disables auto-generating empty KV SESSION binding
  }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});