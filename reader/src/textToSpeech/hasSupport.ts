import { ref } from "vue";

export enum TTSSupport {
    Supported,
    Unsupported
};

export function hasSupport(): TTSSupport {
    return window.speechSynthesis ? TTSSupport.Supported : TTSSupport.Unsupported
}

export function useTTSSupport() {
    const ttsSupport = ref(hasSupport());

    return ttsSupport;
}
