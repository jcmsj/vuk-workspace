<template>
    <EpubStyle :epub="epub" v-if="epub" />
    <div v-for="page in pages.pages" v-html="page.html" :ch="page.id" :id="page.id" :key="page.id">
    </div>
</template>
<script setup lang="ts">
import { Enhanced, EnhancedEpub, LoadedChapter } from './EnhancedEpub';
import { asyncComputed } from '@vueuse/core';
import EpubStyle from "./EpubStyle.vue"
import { ProgressEvents } from "@jcsj/epub/lib/Parts";
import { useTitle } from "@vueuse/core";
import TOC from "../TOC";
import {settings, SETTINGS_ID} from "../settings";
import { Book, db } from '../db/dexie';
import { book } from '../bookmarks';
import { reactive, watch } from 'vue';

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
async function addToCache(bookId:number,data:File) {
    let settings = await db.settings.get(SETTINGS_ID)
    
    if (settings?.cacheSize == null) {
        await db.settings.update(SETTINGS_ID, {
            cacheSize: 3
        })
    }
    if (!settings) {
       await db.settings.add({
            id: SETTINGS_ID,
            devMode: false,
            theme: "light",
            cacheSize: 3,
            speechRate: 1,
            speechPanel: false,
        })
        settings = await db.settings.get(SETTINGS_ID)
    }

    if (!settings) {
        throw Error("Settings not found")
    }

    // check if book is already in cache
    const existing = await db.cache.get(bookId)
    if (existing) {
        console.log("Book already in cache")
        // update last accessed
        await db.cache.update(bookId, {
            lastAccessed: new Date()
        })
        return
    }
    // check if cache is full
    const count = await db.cache.count()
    if (count >= settings.cacheSize) {
        // remove oldest
        const oldest = await db.cache.orderBy("lastAccessed")
            .first()
        if (oldest) {
            await db.cache.delete(oldest.bookId)
        }
    }

    await db.cache.put({
        bookId,
        data,
        lastAccessed: new Date(),
    })
}

const withLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        console.log("Meta:", metadata);
        // const title = useTitle(metadata.title)
        book.value = await registerBook(metadata.title!)
        await addToCache(book.value.id,props.file)
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
    },
}

const noLogs: ProgressEvents = {
    async root() {
        TOC.items.clear()
    },
    async metadata(metadata) {
        useTitle(metadata.title)
        book.value = await registerBook(metadata.title!)
        await addToCache(book.value.id,props.file)

    },
    toc(toc) {
        TOC.items = toc
    },
}
const props = defineProps<{
    file: File
}>()

const emit = defineEmits<{
    epubLoaded: [epub:EnhancedEpub]
    epubRendered: [epub:EnhancedEpub]
}>()
const epub = asyncComputed(() => Enhanced({
    blob: props.file,
    events: settings.value?.devMode ? withLogs : noLogs
}))

const pages = reactive<{pages:LoadedChapter[]}>({
    pages:[]
}) 
watch(epub, async(epub) => {
    if (epub) {
        pages.pages = (await epub.loadAll()) ?? []
        emit("epubLoaded", epub)
    }
})
watch(pages, ()=> {
    if (epub.value) {
        emit("epubRendered", epub.value) 
    }
})

</script>
<style scoped>
/**
 * @see ../bookmarks/index
 */
 :global(.vuk-bookmark) {
    background-color: var(--color-base-200);
}
</style>
