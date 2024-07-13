<template>
  <div class="flex flex-col">
    <h2>Trascript Element Demo:</h2>
    <transcript-element :highlightedIndex>
        {{ text }}
    </transcript-element>
    <div class="flex">
      <button @click="highlightedIndex--">-</button>
      <input type="number" v-model="highlightedIndex">
      <button @click="highlightedIndex++">+</button>
    </div>
    <input type="text" v-model="text">
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { TranscriptElement } from '.';
const highlightedIndex = ref(-1);
const text = ref('The quick brown fox jumps over the lazy dog.');
</script>.
<style scoped>
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}

.align-center {
  align-items: center;
}

</style>
