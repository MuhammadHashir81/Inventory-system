import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createRequire } from 'module';
import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const require = createRequire(import.meta.url);

// https://vite.dev/config/
export default defineConfig({
  server:{
    "port":3004
  },
  plugins: [
    react(),
    tailwindcss()

  ],
});
