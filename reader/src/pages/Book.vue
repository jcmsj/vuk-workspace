<template>
    <renderer-element style="height: 100vh; overflow: auto; width: 60vw; align-self:center; resize:horizontal" :file=file v-if="file" ref="root" />
</template>
<script setup lang="ts">
// Must use inline style, tailwind doesnt work on this one
import {onBeforeMount} from "vue"
import { file } from "../renderer/file";
import { RendererElement } from "../renderer/r.ts";
import {root} from "../renderer/root";
onBeforeMount(() => {
  // console.log(window.KtLibrarian);
  // console.log(librarian);
  // console.log(librarian.startIn())
})
</script>
