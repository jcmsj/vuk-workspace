<template>
    <EpubStyle :epub="epub" v-if="epub"/>
    <div v-for="page in pages" v-html="page.html" :ch="page.id" :id="page.id">
    </div>
</template>
<script setup lang="ts">
import { Enhanced } from './EnhancedEpub';
import { asyncComputed } from '@vueuse/core';
import EpubStyle from "./EpubStyle.vue"
import { ProgressEvents } from "@jcsj/epub/lib/Parts";
import { useTitle } from "@vueuse/core";
import TOC from "../TOC";
import DevMode from "../settings/DevMode";

defineOptions({
    inheritAttrs: false,
})
const withLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        console.log("Meta:", metadata);
        useTitle(metadata.title)
    },
    manifest(manifest) {
        console.log("manifest: ", manifest);
    },
    spine(spine) {
        console.log("spine:", spine);
    },
    flow(flow) {
        console.log("Flow: ", flow);
    },
    toc(toc) {
        console.log("TOC: ", toc);
        TOC.items = toc
    }
}

const noLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        useTitle(metadata.title)
    },
    toc(toc) {
        TOC.items = toc
    }
}
const props = defineProps<{
    file:File
}>()
const epub = asyncComputed(() => Enhanced({
    blob: props.file,
    events: DevMode.value ? withLogs : noLogs
}))
const pages = asyncComputed(() => epub.value?.loadAll())
</script>
<style src="./src/css/tailwind.css">

</style>
