<template>
<ul class="card rounded-box text-lg overflow-auto flex flex-col p-4 card-compact h-screen">
    <li class="card-title">
        Table of Contents
    </li>
    <NodeStart
        :active="true"
        :items="TOC.items"
        :level="0"
        class="card-body"
    />
</ul>
</template>
<script setup lang=ts>
import NodeStart from "./NodeStart.vue"
import TOC from "."
</script>
<style scoped>
</style>
