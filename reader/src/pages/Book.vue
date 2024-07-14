<template>
    <!-- @vue-ignore -->
    <renderer-element class="max-w-full lg:w-[60vw] resize-x self-center p-2" style="height: 100vh; overflow:auto" :file=file v-if="file" ref="root" v-shadow-click="e => emit('click',e)">
    </renderer-element>
</template>
<script setup lang="ts">
// Must use inline style, tailwind doesnt work on this one
import { file } from "../renderer/file";
import { RendererElement } from "../renderer/r";
import {root} from "../renderer/root";
import { vShadowClick } from "../renderer/shadowRootEvents";
const emit = defineEmits<{
    click: [e:MouseEvent]
}>()

</script>
