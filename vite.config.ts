import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// `npm run build` creates:
// - dist/chatbot.js: the widget, a single file any website can load
// - dist/admin/: the admin dashboard page
export default defineConfig(({ mode }) => {
  if (mode === 'admin') {
    return {
      plugins: [react(), tailwindcss()],
      base: './',
      build: { outDir: 'dist/admin', rollupOptions: { input: 'admin.html' } },
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
    build: {
      lib: {
        entry: 'src/main.tsx',
        name: 'AIChatbot',
        formats: ['iife'],
        fileName: () => 'chatbot.js',
      },
    },
  }
})
