<template>
  <span>
    <component is="style">
    :host {
      display: inline;
      --bg-color: aqua;
      --word-color: yellow;
      background-color: var(--bg-color);
    }
    span[active="true"] { 
      background-color: var(--word-color); 
    }
  </component>
    <template v-for="split in splits" >
      <span v-if="split.isWord" :active="split.index == highlightedIndex">
        {{ split.text }}
      </span>
      <template v-else>
        {{ split.text }}
      </template>
    </template>
  </span>
</template>
<script setup lang="ts">
import { computed, provide } from 'vue';
import { useCeTextContent } from './useCeSlot';
import { type Split } from '.';

withDefaults(defineProps<{
  highlightedIndex:number
}>(), {
  highlightedIndex: 0
});

const wordBreaks = /(?!['’-])(\W+|\\n|\\r)/;

const text = useCeTextContent()


// TODO: somehow expose splits
const splits = computed<Split[]>(() => {
  let index = 0; // exclude non-word characters when counting the index
  return text.value
    ?.split(wordBreaks)
    .map((text) => {
      if (/\w/.test(text)) {
        return {
            text,
            isWord: true,
            index: index++
        };
      }
      return {
        text,
        isWord: false,
        index: -1
      };
  }) ?? [];
});
// Hack so splits can be accessed during runtime, especially in the build version
provide("splits",splits)
</script>

<style scoped>
:host {
  display: inline;
  --bg-color: aqua;
  --word-color: yellow;
  background-color: var(--bg-color);
}
span[active="true"] { 
  background-color: var(--word-color); 
}
</style>
