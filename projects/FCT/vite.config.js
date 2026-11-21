import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: '/FCT/',
  build: {
    rolldownOptions: { input: {
      classic: fileURLToPath(new URL('./index.html', import.meta.url)),
      tactics: fileURLToPath(new URL('./tactics.html', import.meta.url)),
    } },
    outDir: '../../FCT',
    emptyOutDir: true,
  },
});
