<template>
<div class="root items-center w-full md:justify-items-center p-2 [&_*]:text-2xl ">
    <template v-if="isSupported">
        <div class="bg-base-100 sticky top-2 flex justify-center z-10">
            <div class="join">
                <LibraryBtn class="join-item" @click="setLibrary" />
                <RestoreBtn  class="join-item" @click="restoreLibrary" />
            </div>
        </div>
        <VListing
        v-if="library"
        :fs="library" 
        :sorter="librarian" 
        @open-book="openBook"
        >
    </VListing>
    </template>
    <div v-else>
        <div class="form-control text-center">
            <h2 class="text-2xl">
                <!-- icon -->
                 <mdi-alert-circle class="w-8 h-8 inline-block" />
                Setting a library is not supported
            </h2>
            <!-- https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#browser_compatibility -->
             <!-- learnmore -->
            <a class="link" href="https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker#browser_compatibility" target="_blank" rel="noopener noreferrer">
                Learn more
            </a>

        </div>
    </div>
</div>
</template>
<script setup lang=ts>
import { onMounted, ref } from "vue"
import { onKeyUp } from "@vueuse/core"
// import { loadBook } from "./fileReader"
import { aDirHandle } from "../library/util"
// import BaseActions from "../library/BaseActions.vue"
import VListing from "../fs/Listing.vue"
import LibraryBtn from "../library/LibraryBtn.vue"
import RestoreBtn from "../library/RestoreBtn.vue"
import { FileSystemDirectoryHandleToDir, getLastWorkingDir, isSupported,  } from "@vuk/fs/lib/web"
import { Item, Status } from "@vuk/fs"
import { library, librarian, createFs } from "../library"
import { file } from "../renderer/file"
import {watch} from "vue"
import { router } from "../routes"
import { db } from "../db/dexie"
import { SETTINGS_ID } from "../settings"
let handle = ref(null as FileSystemDirectoryHandle | null)

async function openBook(item:Item) {
    file.value = await item.get()
}

watch(file, book => {
    if (book) {
        router.push("/")
    }
})
async function setLibrary() {
    try {
        const _handle = await window.showDirectoryPicker({
            mode: "read",
        });

        if (!aDirHandle(_handle))
            throw Error("Not a directory.")
        handle.value = _handle
    } catch (e) {
        console.log(e);
        return
    }
    await db.settings.update(SETTINGS_ID, {
        id: SETTINGS_ID,
        lastDir: handle.value,
        // speechRate: 0 //TODO migrate settings to dexie
    })
    restoreLibrary();
}
async function restoreLibIfUnset() {
    if (library.value)
        return;

    return restoreLibrary()
}
async function restoreLibrary() {
    const res = await getLastWorkingDir(async() => {
        const settings = await db.settings.get(SETTINGS_ID)
        return settings?.lastDir ?? handle.value ?? undefined
    });
    if (!res.handle)
        return;

    const dir = await FileSystemDirectoryHandleToDir(res.handle);
    if (!dir)
        return;

    library.value = await createFs(dir);
    await librarian.sort(dir);

    switch (res.status) {
        case Status.denied:
            alert("Please allow the e-reader to READ the contents of the directory.")
            console.log("Failed to get directory permission");
            break;
        case Status.unset:
            //Maybe new user
            //TODO: Show Get started
            break;
    }
}

onKeyUp(
    "f",
    restoreLibIfUnset,
    { target: document }
)

onMounted(() => {
    restoreLibIfUnset()
})


</script>
<style scoped>
.root {
    @apply grid grid-rows-3;
    grid-template-rows: auto auto 8fr;
}
</style>
