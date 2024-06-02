<template>
    <div>
        <Suspense v-if=book>
            <Bookmark v-bind="book">

            </Bookmark>
        </Suspense>
    </div>
</template>
<script setup lang="ts">
import Bookmark from "../bookmarks/Bookmark.vue";
import { book } from "../bookmarks";

</script>
