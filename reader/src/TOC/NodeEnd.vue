<template>
    <li @click="toggleChild" :data-id="item.id" class="flex p-2 hover:bg-base-200 rounded-lg hover:cursor-pointer">
        <span class="p-1">
            <mdi-caret class="rotatable" />
            <!-- rotate element 180 degrees -->
        </span>
        {{ item.title }}
    </li>
    <NodeStart :items="item.navPoint" :active="isChildActive" :level="level" />
</template>
<script setup lang="ts">
import { computed, ref } from "vue"
import NodeStart from "./NodeStart.vue";
import { Chapter } from "@jcsj/epub/lib/traits";

const isChildActive = ref(false)

defineProps<{
    readonly item: Required<Chapter>,
    readonly level: number
}>();
const flip = computed(() => isChildActive.value ? "180deg" : "90deg")
function toggleChild() {
    isChildActive.value = !isChildActive.value
}
</script>
<style scoped>
.rotatable {
    rotate: v-bind(flip);
    transition: rotate 0.2s;
}
li {
    text-indent: v-bind(level + "em");
}
</style>
