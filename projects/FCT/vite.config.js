import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: '/FCT/',
  build: {
    // Fetch only the characters used by this match instead of embedding every
    // palette and royal pose in the initial JavaScript download.
    assetsInlineLimit: 0,
    rolldownOptions: { input: {
      classic: fileURLToPath(new URL('./index.html', import.meta.url)),
      tactics: fileURLToPath(new URL('./tactics.html', import.meta.url)),
    } },
    outDir: '../../FCT',
    emptyOutDir: true,
  },
});
