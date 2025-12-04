import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    // cp ./dist/index.html ./dist/200.html
    // This is needed for client-side routing on static hosts like Surge or Netlify
    {
      name: 'copy-index-to-200',
      apply: 'build',
      closeBundle() {
        fs.copyFileSync(
          path.resolve('dist', 'index.html'),
          path.resolve('dist', '200.html')
        )
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
