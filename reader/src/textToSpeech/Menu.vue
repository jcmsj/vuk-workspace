<template>
  <!-- play/pause button -->
  <div class="w-full flex justify-center sticky bottom-28 md:bottom-12 xl:bottom-12">
    <div class="join bg-base-200 gap-x-2">
      <!-- voice rate -->
      <button class="join-item">
        <mdi-speedometer class="tts-icon" onclick="speechRateDialog.showModal()" />
      </button>
      <!-- previous -->
      <button class="join-item">
        <mdi-skip-previous class="tts-icon" />
      </button>
      <button class="join-item">
        <mdi-pause class="tts-icon" v-if="isReading" @click="$emit('pause')" />
        <mdi-play v-else @click="$emit('play')" class="tts-icon" />
      </button>
      <!-- next -->
      <button class="join-item">
        <mdi-skip-next class="tts-icon" />
      </button>
      <!-- voice menu -->
      <button class="join-item">
        <mdi-dots-vertical class="tts-icon" />
      </button>
    </div>
    <!-- dialog -->
    <dialog id="speechRateDialog" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">
          <mdi-speedometer class="tts-icon inline" />
          Set speech rate
        </h3>
        <div class="flex join justify-center">
          <!-- minus -->
          <button class="join-item" @click="decrement(step)">
            <mdi-minus class="tts-icon" />
          </button>
          <NumberSpinner :min :max :step :precision="2" v-model:value="speechRate" />
          <!-- plus -->
          <button class="join-item" @click="increment(step)">
            <mdi-plus class="tts-icon" />
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
import { matchMediaSources } from '@jcsj/epub/lib/sanitize/matchSource';
defineProps<{
  isReading: boolean
}>()
defineEmits(["play", "pause"])
const step = useLocalStorage('speechStepRate', 0.05)
const { speechRate, decrement, increment, max, min } = useSpeechRate()

</script>
<style scoped>
.tts-icon {
  @apply h-8 w-8;
}
</style>
