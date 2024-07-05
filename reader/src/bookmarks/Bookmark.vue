<template>
    <div class="flex flex-col p-2 ">
        <ul class="menu menu-lg rounded-box self-center max-w-[36rem]">
            <h2 class="menu-title">
                Bookmarks
            </h2>
            <BookmarkItem v-for="bookmark in bookmarks" :bookmark @click="focus" @remove="removeBookmark(bookmark)" />
        </ul>
    </div>
</template>
<script setup lang="ts">
import { Book, BookmarkTable, db } from '../db/dexie';
import { liveQuery } from "dexie";
import { useObservable,from } from "@vueuse/rxjs";
import BookmarkItem from './BookmarkItem.vue';
import { useRouter } from 'vue-router';
import { BOOKMARK_CLASS, Bookmark } from '.';
const props = defineProps<Book>()
const bookmarks  = useObservable<BookmarkTable[]>(
    from(liveQuery(async() => {
        return await db.bookmarks
            .where("bookId").equals(props.id)
            // https://dexie.org/docs/Collection/Collection.sortBy()
            .sortBy("percentage")
    }))
)

const router = useRouter()
async function focus(b:Bookmark) {
    await router.push({
        path: '/'
    })

    const elem = document.querySelector("renderer-element")
    if (!elem) {
        throw Error("Renderer element not found")
    }
    const target = elem?.shadowRoot?.querySelector(b.selector)
    if (target) {
        target.classList.add(BOOKMARK_CLASS)
        target.scrollIntoView({
            behavior: "smooth",
            block: "center",
        })
    } else {
        throw Error(`Bookmark target not found ${b}`)
    }
}

async function removeBookmark(b:BookmarkTable) {
    await db.bookmarks.delete(b.id)
}
</script>
