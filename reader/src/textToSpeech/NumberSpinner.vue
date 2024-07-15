<template>
  <div  class="hover:cursor-pointer">
    <div v-if="state.atMin">
      &nbsp;
    </div>
    <div class="text-center" v-else @click="$emit('update:value', state.previousStep)">
      {{ label.previousStep }}
    </div>
    <div :class="valueClass">{{ label.value }}</div>
    <div v-if="state.atMax">
      &nbsp;
    </div>
    <div class="text-center" v-else @click="$emit('update:value', state.nextStep)">
      {{ label.nextStep }}
    </div>
  </div>
</template>
<script setup lang="ts">
// import { useEventListener } from '@vueuse/core';
import { ref, computed } from 'vue';

const model = defineModel<number>('value', { required: true });
const props = defineProps<{
  min: number
  max: number
  step: number
  precision: number
  valueClass?: string
}>();

const state = computed(() => {
  const nextStep = model.value + props.step
  const previousStep = model.value - props.step
  return {
    atMax: model.value >= props.max,
    atMin: model.value <= props.min,
    nextStep,
    previousStep,
  }
})


const label = computed(() => {
  return {
    value: model.value.toFixed(props.precision),
    nextStep: (model.value + props.step).toFixed(props.precision),
    previousStep: (model.value - props.step).toFixed(props.precision),
  }
})

// function increment(step: number) {
//   model.value = Math.min(
//     parseInt((model.value + step).toFixed(props.precision)),
//     props.max
//   )
// }

// function decrement(step: number) {
//   model.value = Math.max(
//     parseInt((model.value - step).toFixed(props.precision)),
//     props.min
//   )
// }

// const spinner = ref<HTMLDivElement>()
// TODO: handle touch
// useEventListener(spinner, 'wheel', (e) => {
//   if (e.deltaY > 0) {
//     decrement(props.step)
//   } else {
//     increment(props.step)
//   }
// })

</script>
