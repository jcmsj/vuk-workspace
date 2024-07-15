import { defineCustomElement } from "vue";
import TranscriptSFC from './Transcript.ce.vue'
// convert into custom element constructor
export const TranscriptElement = defineCustomElement(TranscriptSFC)

export interface Split {
    text:string;
    isWord:boolean;
    index:number;
  }
export function register() {
    customElements.define('transcript-element', TranscriptElement)
}
