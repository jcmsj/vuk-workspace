import { defineCustomElement } from "vue";
import TranscriptSFC from './Transcript.ce.vue'
// convert into custom element constructor
export const TranscriptElement = defineCustomElement(TranscriptSFC)

export function register() {
    customElements.define('transcript-element', TranscriptElement)
}
