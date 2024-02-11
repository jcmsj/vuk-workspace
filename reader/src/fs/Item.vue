<template>
<li class="hover:cursor-pointer hover:bg-base-200" @click="emit('item-click')">
    <div class="flex gap-x-4 p-2" v-if="item_name=='folder'" clickable >
        <mdi-folder  class="w-6 h-6" />
        <slot></slot>
    </div>
    <div class="flex gap-x-4 p-2" v-else-if="item_name=='book'">
        <mdi-book  class="w-6 h-6" />
        <slot></slot>
    </div>
</li>
</template>
<script setup lang="ts">

interface ItemProps {
    item_name?:string
}

const emit = defineEmits(["item-click"])
const {item_name = "folder"} = defineProps<ItemProps>()

</script>
