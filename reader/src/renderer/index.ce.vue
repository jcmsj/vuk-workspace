<template>
    <EpubStyle :epub="epub" v-if="epub" />
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
import { Book, db } from '../db/dexie';
import { book } from '../bookmarks';

defineOptions({
    inheritAttrs: false,
})

async function registerBook(title: string):Promise<Book> {
    const existing = await db.books.where("title")
        .equalsIgnoreCase(title)
        .first()
    if (existing) {
        console.log("Book already exists")
        return existing
    }
    const id = await db.books.add({
        title,
    })

    return {
        id,
        title
    }
}
const withLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        console.log("Meta:", metadata);
        const title = useTitle(metadata.title)
        book.value = await registerBook(metadata.title!)
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
        book.value = await registerBook(metadata.title!)

    },
    toc(toc) {
        TOC.items = toc
    }
}
const props = defineProps<{
    file: File
}>()
const epub = asyncComputed(() => Enhanced({
    blob: props.file,
    events: DevMode.value ? withLogs : noLogs
}))
const pages = asyncComputed(() => epub.value?.loadAll())



</script>
<style src="./src/css/tailwind.css"></style>
<style scoped>
/**
 * @see ../bookmarks/index
 */
 :global(.vuk-bookmark) {
  @apply bg-base-200;
}
</style>
