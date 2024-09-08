<template>
    <ul class="menu bg-base-200 w-48 rounded-box absolute" :class="hidden" :style v-on-click-outside="dismiss"
        ref="contextMenu" @click="dismiss()">
        <slot></slot>
    </ul>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components'
import { Coord2d } from '.';
const location = defineModel<Coord2d>('location')
const contextMenu = ref<HTMLElement>()
const safeLocation = computed(() => location.value && contextMenu.value ? toSafeBounds(location.value, contextMenu.value) : undefined)
function px(n?: number) {
    return n == undefined ? undefined : `${n}px`
}
const style = computed(() => ({
    left: px(safeLocation.value?.x),
    top: px(safeLocation.value?.y),
}))
const hidden = computed(() => location.value == undefined ? 'hidden' : '')
function toSafeBounds(mouse: Coord2d, elem: HTMLElement) {
    // Get mouse position
    // Get context menu dimensions
    const menuWidth = elem.offsetWidth;
    const menuHeight = elem.offsetHeight;
    // Check for bottom collision
    let topPosition = mouse.y;
    if (mouse.y + menuHeight > window.innerHeight) {
        topPosition = mouse.y - menuHeight;
    }

    // Check for right collision
    let leftPosition = mouse.x;
    if (mouse.x + menuWidth > window.innerWidth) {
        leftPosition = mouse.x - menuWidth;
    }

    // Set safe styles
    return {
        x: leftPosition,
        y: topPosition,
    }
}

function dismiss() {
    location.value = undefined
}
</script>
