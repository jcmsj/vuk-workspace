import { ref } from "vue";
import { LoadedChapter } from "./EnhancedEpub";

export const file = ref<File>();
export const pages = ref<LoadedChapter[]>([])
