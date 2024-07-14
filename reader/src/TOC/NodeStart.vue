<template>
    <li :active="active" class="node">
        <div v-if="level > maxDepth"></div>
        <template v-else v-for="[_, item] of items">
            <NodeEnd v-if="item.navPoint" :item="item as Required<Chapter>" :level="level + 1" />
            <ItemLink v-bind="item" />
        </template>
    </li>
</template>
<script setup lang="ts">
import { Chapter } from "@jcsj/epub/lib/traits";
import NodeEnd from "./NodeEnd.vue";
import ItemLink from "./ItemLink.vue"
import { maxDepth } from ".";

defineProps<{
    readonly items: Map<string, Chapter>;
    readonly active: boolean;
    readonly level: number;
}>();

</script>
<style scoped>
.node {
    display: none;
    &[active="true"] {
        display: block;
    }
}
</style>
