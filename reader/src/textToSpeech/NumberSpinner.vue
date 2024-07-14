<template>
  <div ref="spinner">
    <div v-if="state.atMin">
      &nbsp;
    </div>
    <div class="text-center" v-else @click="$emit('update:value', state.previousStep)">
      {{ state.label.previousStep }}
    </div>
    <div class="text-xl">{{ state.label.value }}</div>
    <div v-if="state.atMax">
      &nbsp;
    </div>
    <div class="text-center" v-else @click="$emit('update:value', state.nextStep)">
      {{ state.label.nextStep }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { ref, computed } from 'vue';

const model = defineModel<number>('value', { required: true });
const props = defineProps<{
  min: number
  max: number
  step: number
  precision: number
}>();

const state = computed(() => {
  const nextStep = model.value + props.step
  const previousStep = model.value - props.step
  return {
    atMax: model.value >= props.max,
    atMin: model.value <= props.min,
    nextStep: nextStep,
    previousStep: previousStep,
    label: {
      value: model.value.toFixed(props.precision),
      nextStep: nextStep.toFixed(props.precision),
      previousStep: previousStep.toFixed(props.precision),
    },
  }
})

function increment(step: number) {
  model.value = Math.min(parseInt((model.value + step).toFixed(props.precision))), props.max
}

function decrement(step: number) {
  model.value = Math.max(parseInt((model.value - step).toFixed(props.precision))), props.min
}

const spinner = ref<HTMLDivElement>()
useEventListener(spinner, 'wheel', (e) => {
  e.preventDefault()
  if (e.deltaY > 0) {
    increment(props.step)
  } else {
    decrement(props.step)
  }
})
</script>
