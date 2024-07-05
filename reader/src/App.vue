<template>
    <router-view />
</template>
<script setup lang="ts">
import { watchTheme } from './settings';

watchTheme()
</script>
<style>
body {
  @apply overflow-hidden;
}
#app {
  @apply min-h-screen;
  @apply overflow-hidden;
}

</style>
<style scoped>

</style>
