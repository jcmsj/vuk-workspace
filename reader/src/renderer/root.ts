import {ref, watch} from "vue";
import {RendererElement} from "./r";
export const root = ref<{shadowRoot:ShadowRoot}>();

watch(root, (newVal, oldVal) => {
  console.log("root changed", newVal, oldVal);
});
