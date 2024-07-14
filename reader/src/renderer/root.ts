import { ref, watch } from "vue";
import { createTextTreeWalker } from "../textToSpeech/treeWalker";
export const root = ref<{ shadowRoot: ShadowRoot }>();
export const rootTreeWalker = ref<TreeWalker>()

watch(root, (newVal, oldVal) => {
  console.log("root changed", newVal, oldVal);
  if (newVal?.shadowRoot.host) {
    rootTreeWalker.value = createTextTreeWalker(newVal.shadowRoot.host);
    console.log("created walker", rootTreeWalker.value);
  }
});
