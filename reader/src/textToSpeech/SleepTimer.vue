<template>
    <div class="flex flex-col w-max items-center m-auto gap-y-2">
        <label class="input input-bordered flex items-center gap-2">
            <input class="text-center w-16" type="number" name="tts-sleep-timer" :min="1" :max="60 * 24"
                v-model="duration">
            <span>minutes</span>
        </label>
        <div class="join">
            <!-- start -->
            <button class="btn join-item" :class="{'btn-disabled': isPending}" @click="startTimeout">
                <mdi-play />
            </button>

            <!-- stop -->
            <button class="btn join-item" :class="{'btn-disabled': ready}" @click="stopTimer">
                <mdi-stop />
            </button>
        </div>
        <!-- time end -->
        <div v-if="isPending" class="text-center">
            <span>Ends in</span>
            &nbsp;
            <span class="text-2xl">{{ timeRemaining}}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useLocalStorage, useNow, useTimeout } from '@vueuse/core';
import { useSpeechSynthesis } from './useSpeechSynthesis';
import { rootTreeWalker } from '../renderer/root';
import { useVoice } from './useVoice';
import { computed } from 'vue';
const duration = useLocalStorage('sleepDurationInMinutes', 60)
const durationMs = computed(() => duration.value * 60 * 1000)
const { voice } = useVoice()
const { stop: stopReading } = useSpeechSynthesis({
    key: {
        speechRate: 'speechRate',
    },
    voice,
    treeWalker: rootTreeWalker,
})

const { start:startTimeout, stop: stopTimer, isPending,ready } = useTimeout(
    durationMs,
    {
        controls: true,
        callback: stopReading,
        immediate: false,
    })

const timerInfo = computed(() => {
    if (isPending.value) {
        const start = Date.now()
        return {
            duration: durationMs.value,
            start,
            end: start + durationMs.value,
        }
    }

    return undefined
})

const now = useNow()
const timeRemaining = computed(() => {
    if (timerInfo.value) {
        // show hh:mm remaining
        const remaining = timerInfo.value.end - now.value.getTime()
        const minutes = Math.floor(remaining / 1000 / 60)
        const seconds = Math.floor((remaining / 1000) % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    return undefined
})
</script>
