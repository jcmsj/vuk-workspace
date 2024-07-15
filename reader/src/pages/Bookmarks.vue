<template>
    <div>
        <Bookmark v-if=book v-bind="book">

        </Bookmark>
    </div>
</template>
<script setup lang="ts">
import Bookmark from "../bookmarks/Bookmark.vue";
import { book } from "../bookmarks";

</script>
