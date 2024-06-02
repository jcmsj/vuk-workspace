<template>
    <renderer-element class="max-w-full lg:w-[60vw] overflow-auto resize-x self-center" style="height: 100vh;" :file=file v-if="file" ref="root" />
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
