// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { qrcode } from 'vite-plugin-qrcode';
import { VitePWA } from 'vite-plugin-pwa'
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
      defaultClass: 'mdi',
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
        name: 'Vuk',
        short_name: 'Vuk',
        display: 'standalone',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: "#8250d2",
        description: "Vuk is an Epub Reader for the Web",
        lang: 'en',
        scope: '/',
        icons: [
          {
            "src": "pwa-64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "maskable-icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],

      }
    }),
    basicSsl({
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      // domains: ['*.custom.com'],
      /** custom certification directory */
      certDir: '/Users/.../.devServer/cert'
    }),
    qrcode() // only applies in dev mode
  ],
})
