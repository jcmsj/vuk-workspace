import { createApp } from 'vue'
import './css/tailwind.css'
import App from './App.vue'
import { router } from './routes'
import { RendererElement } from './renderer/r'
import { register as registerTranscriptElement } from '@jcsj/transcript'
const app = createApp(App)
customElements.define('renderer-element', RendererElement)
registerTranscriptElement()
app.use(router)
app.mount('#app')
