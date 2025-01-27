<template>
<div @click="chooser?.click">
    <mdi-upload class="w-6 h-6" title="Open an EPUB"/> 
    <input type=file hidden ref=chooser @change=selectFile :accept="INFO.MIME">
    <span class="dock-label" :class="uploadSpanClass">Upload</span>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { INFO } from '@jcsj/epub/lib/Reader';
import { file } from '../renderer/file';
const chooser = ref<HTMLInputElement>();
defineProps<{
    uploadSpanClass?: string
}>()
async function selectFile(_: any) {
    if (chooser.value?.files?.length) {
        file.value = chooser.value.files[0]
        // loadBookFromFile(chooser.value.files[0])
    }
}
</script>
