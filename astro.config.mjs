// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',

  // Disable automatic KV session storage
  session: false,

  adapter: cloudflare({
    imageService: 'passthrough'
  }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});