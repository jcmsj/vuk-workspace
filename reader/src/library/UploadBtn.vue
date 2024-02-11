<template>
<div @click="chooser?.click">
    <mdi-upload class="w-6 h-6" title="Open an EPUB"/> 
    <input type=file hidden ref=chooser @change=selectFile :accept="INFO.MIME">
    <span class="hidden 2xl:block">Upload</span>
</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { INFO } from '@jcsj/epub/lib/Reader';
import { file } from '../renderer/file';
const chooser = ref<HTMLInputElement>();

async function selectFile(e: any) {
    if (chooser.value?.files?.length) {
        file.value = chooser.value.files[0]
        // loadBookFromFile(chooser.value.files[0])
    }
}
</script>
