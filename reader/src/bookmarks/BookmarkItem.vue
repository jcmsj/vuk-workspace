<template>
    <li @click="$emit('click', bookmark)" :data-selector="bookmark.selector">
        <span>
            <span class="">{{ bookmark.percentage }}%</span>
            <span class="truncate w-64">{{ bookmark.text }}</span>
            <span class="btn btn-ghost hover:bg-base-300" @click.stop="$emit('remove', bookmark)">
                <mdi:trash-can class="h-6 w-6" />
            </span>
        </span>
    </li>
</template>
<script setup lang="ts" generic="T">
import { Bookmark } from '.';
defineProps<{ bookmark: Bookmark }>()
defineEmits<{
    click: [bookmark: Bookmark]
    remove: [bookmark: Bookmark]
}>()
</script>
