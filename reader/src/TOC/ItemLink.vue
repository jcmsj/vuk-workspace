<template>
    <router-link :to="epubId" @click="anchorClicked" class="block rounded-lg p-2 hover:bg-base-200">
        {{ title }}
    </router-link>
</template>
<script setup lang="ts">
import {computed, defineProps} from 'vue'
import { anchorClicked } from "./anchorClicked";

defineOptions({
    inheritAttrs: false
})

const props = defineProps<{
    id:string,
    title:string
}>()
const epubId = computed(() => `/#${props.id}`)

</script>
