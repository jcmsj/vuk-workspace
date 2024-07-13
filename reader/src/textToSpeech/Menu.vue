<template>
  <!-- play/pause button -->
  <div class="card">
    <div class="card-body">
        <div class="join">
          <button class="join-item">
            <mdi-pause v-if="isReading" @click="$emit('pause')" />
            <mdi-play v-else @click="$emit('play')" />
          </button>
        </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  isReading: boolean
}>()
defineEmits(["play", "pause"])
</script>
