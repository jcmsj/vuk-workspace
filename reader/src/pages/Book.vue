<template>
    <!-- @vue-ignore -->
    <renderer-element class="max-w-full lg:w-[60vw] resize-x self-center p-2" style="height: 100vh; overflow:auto"
        :file=file v-if="file" ref="root" v-shadow-click="e => emit('click', e)"
        @epubRendered="scrollToLatestBookmark()">
    </renderer-element>
</template>
<script setup lang="ts">
// Must use inline style, tailwind doesnt work on this one
import { book, BOOKMARK_CLASS } from "../bookmarks";
import { db } from "../db/dexie";
import { file } from "../renderer/file";
import { RendererElement } from "../renderer/r";
import { root, rootTreeWalker } from "../renderer/root";
import { vShadowClick } from "../renderer/shadowRootEvents";
const emit = defineEmits<{
    click: [e: MouseEvent]
}>()
async function scrollToLatestBookmark() {
    if (!book.value)  {
        console.error("Book not found")
        return
    }

    const bookmarks = await db.bookmarks
        .where("bookId")
        .equals(book.value.id)
        .sortBy("percentage")

    // check tts too
    const tts = await db.tts
        .where("bookId")
        .equals(book.value.id)
        .sortBy("percentage")

    bookmarks.push(...tts)
    bookmarks.sort((a, b) => a.percentage - b.percentage)

    console.log("bookmarks", bookmarks)

    // Auto scroll to top in case new book is loaded when an existing book is already scrolled
    root.value?.shadowRoot.host.scrollTo({
        top: 0,
        behavior: "smooth",
    })
    if (bookmarks.length == 0) {
        return
    }

    const latest = bookmarks[bookmarks.length - 1]

    const elem = root.value?.shadowRoot.querySelector(latest.selector)
    if (elem) {
        elem.classList.add(BOOKMARK_CLASS)
        console.log("Bookmark: centering element: ", elem)
        const elemRect = elem.getBoundingClientRect()
        const offset = elemRect.top - (window.innerHeight / 2) + (elemRect.height / 2)
        root.value?.shadowRoot.host.scrollBy({
            top: offset,
            behavior: "smooth",
        })

        // set current node for tts
        if (rootTreeWalker.value) {
            console.log("Bookmark: override tts:", elem)
            rootTreeWalker.value.currentNode = elem
        }
    } else {
        console.error("Bookmark not found", latest)
    }
}
</script>
