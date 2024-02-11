<template>
<div class="w-full md:w-[50vw] h-max sticky top-14 z-10 p-2">
    <input class="input-primary p-2 w-full" placeholder="Search" v-model="target" clearable autofocus  />
</div>
<ul class=" w-full md:w-[50vw] h-[80vh] overflow-auto">
    <VItem v-if="!fs.inRoot" @click="fs.goto(fs.root)">
        /
    </VItem>
    <VItem v-if="!fs.inRoot" @click="fs.moveUp()">
        ../
    </VItem>
    <VItem v-for="(item, dirname) of sorter.dirs" :key="dirname" @item-click="fs.goto(item)"
    :class="{hidden:shouldHide(item)}"
    >
        {{ dirname }}
    </VItem>
    <VItem item_name="book" v-for="(item, name) of sorter.books" :key="name" @item-click="$emit('open-book', item)"
    :class="{hidden:shouldHide(item)}"
    >
        {{ name }}
    </VItem>
</ul>
</template>
<script setup lang=ts>
import { FS, Item, Librarian, Handle } from '@vuk/fs';
import VItem from "./Item.vue"
import { computed, ref } from 'vue';
defineEmits<{
    (event: "open-book", item: Item): void
}>();
const target = ref("")
const lower = computed(() => target.value?.toLocaleLowerCase())
const { sorter, fs } = defineProps<{
    sorter: Librarian,
    fs: FS
}>()

function shouldHide(h:Handle) {
    return lower.value?.length && !h.name.toLocaleLowerCase().includes(lower.value)
}
</script>
