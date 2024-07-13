import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => ['transcript-element', 'speech-element'].indexOf(tag) > -1,
      }
    }
  })],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'transcript',
    }
  }
})
