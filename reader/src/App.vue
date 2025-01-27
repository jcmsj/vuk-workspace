<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { loadBookFromCache, watchTheme, initSettingsIfNotExist } from './settings';

watchTheme()
onMounted(async () => {
  await initSettingsIfNotExist()
  await loadBookFromCache()
})
</script>
<style>
body {
  overflow: hidden;
}

#app {
  min-height: 100vh;
  overflow: hidden;
}
</style>
