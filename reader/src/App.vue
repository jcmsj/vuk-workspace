<template>
    <router-view />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { loadBookFromCache, watchTheme } from './settings';

watchTheme()
onMounted(() => {
  loadBookFromCache()
})
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
