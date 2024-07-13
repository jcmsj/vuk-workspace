// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  
  plugins: [
    vue({
      script: {
        propsDestructure:true,
      },
      template: {
        compilerOptions: {
          isCustomElement: tag => ['renderer-element', 'transcript-element'].includes(tag),
        }
      }
    }),
    Components({
      resolvers: [
        IconsResolver({
          componentPrefix: '',
          enabledCollections: ['mdi'],
        }),
      ]
    }),
    Icons({ 
      /* options */ 
      compiler: 'vue3',
    }),
    basicSsl({
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      // domains: ['*.custom.com'],
      /** custom certification directory */
      certDir: '/Users/.../.devServer/cert'
    })
  ],
})
