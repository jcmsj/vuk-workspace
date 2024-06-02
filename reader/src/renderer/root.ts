import {ref, watch} from "vue";
export const root = ref<{shadowRoot:ShadowRoot}>();

watch(root, (newVal, oldVal) => {
  console.log("root changed", newVal, oldVal);
});
