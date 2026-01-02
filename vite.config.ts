import { defineConfig } from 'vite'
// Fix: Import `dirname` from `path` and `fileURLToPath` from `url` to define `__dirname` in an ES module context.
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url';

// Fix: Define `__dirname` as it is not available in ES modules by default.
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
