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
import { root } from "../renderer/root";
import { vShadowClick } from "../renderer/shadowRootEvents";
const emit = defineEmits<{
    click: [e: MouseEvent]
}>()
// scroll to latest position
async function scrollToLatestBookmark() {
    if (!book.value)  {
        console.error("Book not found")
        return
    }

    const bookmarks = await db.bookmarks
        .where("bookId")
        .equals(book.value.id)
        .sortBy("percentage")
    console.log("bookmarks", bookmarks)
    if (bookmarks.length == 0) {
        return
    }

    const latest = bookmarks[bookmarks.length - 1]

    const elem = root.value?.shadowRoot.querySelector(latest.selector)
    if (elem) {
        elem.classList.add(BOOKMARK_CLASS)
        // Note: block:center is not working
        elem.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
        // ALTERNATIVE:
        // scroll to percentage, calculate the correct position
        // workaround since scrollIntoView is not working
        // const px = latest.percentage/100 * root.value?.shadowRoot.host.scrollHeight!
        // root.value?.shadowRoot.host.scrollTo(0, px)
    } else {
        console.error("Bookmark not found", latest)
    }
}
</script>
