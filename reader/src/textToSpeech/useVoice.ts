import { useLocalStorage } from "@vueuse/core";
import { computed, ref } from "vue";

export function useVoice() {
  const voices = ref<SpeechSynthesisVoice[]>([]);
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices.value = speechSynthesis.getVoices()
    }
  }
  const preferredVoice = useLocalStorage("voice", () => {
    // The default in Google's TTS has the country included
    if (navigator.userAgent.includes("Android")) {
      return "English (United States)"
    }
    if (navigator.userAgent.includes("Windows")) {
      return "Microsoft David - English (United States)"
    }

    return "English"
  })
  const voice = computed<SpeechSynthesisVoice | undefined>(() => voices.value.find(it => it.name === preferredVoice.value));

  return { voices, voice };
}
