<template>
    <renderer-element class="max-w-full lg:w-[60vw] resize-x self-center p-2" style="height: 100vh; overflow:auto" :file=file v-if="file" ref="root" @click="emit('click',$event)">
    </renderer-element>
</template>
<script setup lang="ts">
// Must use inline style, tailwind doesnt work on this one
import { file } from "../renderer/file";
import { RendererElement } from "../renderer/r.ts";
import {root} from "../renderer/root";
const emit = defineEmits<{
    click: [e:MouseEvent]
}>()

</script>
