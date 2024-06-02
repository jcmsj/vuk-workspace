<template>
<ContextMenu v-model:location="location">
    <li @click="$emit('select', 'read-aloud')">
        <span>
            <mdi:volume class="h-6 w-6"></mdi:volume>
            Read Aloud
        </span>
    </li>
    <!-- bookmark -->
    <li @click="$emit('select', 'bookmark')">
        <span>
            <mdi:bookmark class="h-6 w-6"></mdi:bookmark>
            Bookmark
        </span>
    </li>
    <!-- copy -->
    <li @click="$emit('select', 'read-aloud')">
        <span>
            <mdi:content-copy class="h-6 w-6"></mdi:content-copy>
            Copy
        </span>
    </li>
</ContextMenu>
</template>
<script setup lang="ts">
import { Coord2d } from '.';
import ContextMenu from './ContextMenu.vue';
const location = defineModel<Coord2d>('location')

defineEmits<{
    select: [option: 'read-aloud'|'bookmark'|'copy']
}>()
</script>
