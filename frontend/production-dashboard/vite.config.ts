import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Ignorer les dossiers volumineux pour éviter de surcharger chokidar
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
    }
  }
})

