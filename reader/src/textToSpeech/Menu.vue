<template>
  <!-- play/pause button -->
  <div class="w-full flex justify-center absolute bottom-[8vh] lg:sticky lg:bottom-[4vh]">
    <div class="join bg-base-200">
      <!-- previous -->
      <button class="join-item">
        <mdi-skip-previous />
      </button>
      <button class="join-item">
        <mdi-pause v-if="isReading" @click="$emit('pause')" />
        <mdi-play v-else @click="$emit('play')" />
      </button>
      <!-- next -->
      <button class="join-item">
        <mdi-skip-next />
      </button>
      <!-- voice menu -->
      <button class="join-item" onclick="speechRateDialog.showModal()">
        <mdi-dots-vertical />
      </button>
    </div>
    <!-- dialog -->
    <dialog id="speechRateDialog" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          <mdi-cog class="inline !w-10 !h-10" />
          Text-to-Speech Settings
        </h3>
        <h4 class="text-md font-bold">
          <mdi-speedometer class="inline !w-8 !h-8" />
          Set speech rate
        </h4>
        <div class="flex join justify-center items-center gap-x-2">
          <!-- minus -->
          <button class="btn btn-circle btn-ghost" @click="decrement(step)">
            <mdi-minus />
          </button>
          <NumberSpinner :min :max :step :precision="2" v-model:value="speechRate" valueClass="text-4xl" class="text-3xl" />
          <!-- plus -->
          <button class="btn btn-circle btn-ghost" @click="increment(step)">
            <mdi-plus />
          </button>
        </div>
        <!-- <SpeechRateController /> -->
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
<script setup lang="ts">
import { useSpeechRate } from './useSpeechSynthesis';
import { useLocalStorage } from '@vueuse/core';
import NumberSpinner from './NumberSpinner.vue';
defineProps<{
  isReading: boolean
}>()
defineEmits(["play", "pause"])
const step = useLocalStorage('speechStepRate', 0.05)
const { speechRate, decrement, increment, max, min } = useSpeechRate()

</script>
<style scoped>
.mdi {
  @apply h-full w-full;
}

.join-item {
  @apply btn btn-ghost;
}
</style>
