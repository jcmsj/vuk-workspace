<template>
    <!-- create a menu -->
    <!-- toggle for devmode -->
    <div class="w-full flex flex-col items-center">
        <div class="subsection">Settings</div>
        <!-- theme -->
        <!-- @vue-ignore -->
        <select class="select self-center w-full max-w-52" :value="theme"
            @change="v => setTheme(v.currentTarget.value)">
            <option value="light">Light</option>
            <option value="night">Night</option>
        </select>
        <div @click="updateDevMode" class="self-center">
            <div class="fieldset w-52">
                <label class="fieldset-label cursor-pointer">
                    Dev mode
                    <input type="checkbox" class="toggle" :checked="settings?.devMode" />
                </label>
            </div>
        </div>
        <!-- Book Cache -->
        <fieldset class="fieldset w-52">
            <legend class="fieldset-legend">Book Cache</legend>
            <!-- TODO: warnings, for now limit to 10 -->
            <label class="fieldset-label cursor-pointer">
                Cache Size
                <input type="number" name="bookCache" v-model="cacheSize" class="input w-16 text-end" :min="0" :max="10">
            </label>
            <!-- in use -->
            <label class="fieldset-label cursor-pointer">
                <span class="text-lg">In Use:</span>
                <span class="text-lg">
                    {{ cache?.count }}/{{ settings?.cacheSize }}
                </span>
            </label>
            <!-- delete cache -->
            <!-- <label class="label cursor-pointer justify-center"> -->
            <button @click="db.cache.clear()" class="btn btn-error btn-sm">
                <mdi-trash-can class="w-6 h-6" />
                Delete Cache
            </button>
            <!-- </label> -->
        </fieldset>
        <!-- version -->
        <div class="subsection">Version</div>
        <!-- app -->
        <div class="text-center">
            <span class="text-lg">{{ packageJson.name }}</span>
            {{ packageJson.version }}
        </div>
        <!-- vue -->
        <div class="text-center">
            <span class="text-lg">Vue</span>
            {{ packageJson.dependencies.vue }}
        </div>
        <!-- daisyui -->
        <div class="text-center">
            <span class="text-lg">DaisyUI</span>
            {{ packageJson.devDependencies.daisyui }}
        </div>
        <!-- dexie -->
        <div class="text-center">
            <span class="text-lg">Dexie</span>
            {{ packageJson.dependencies.dexie }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { db } from '../db/dexie';
import { SETTINGS_ID } from "../settings";
import { settings, theme } from '../settings';
import packageJson from '../../package.json';
import { from, useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';
import { computed } from 'vue';
// get settings

function updateDevMode() {
    db.settings.update(SETTINGS_ID, { devMode: !settings?.value?.devMode })
}

async function setTheme(theme: string) {
    await db.settings.update(SETTINGS_ID, { theme })
}

const cache = useObservable(from(liveQuery(async () => {
    const count = await db.cache.count()
    return { count }
})))
const cacheSize = computed({
    get: () => settings?.value?.cacheSize!,
    set: async (n: number | string) => {
        if (typeof n === "string") {
            n = parseInt(n)
        }

        // if NaN
        if (Number.isNaN(n)) {
            throw Error("Invalid number")
        }
        await db.settings.update(SETTINGS_ID, { cacheSize: n })
    }
})

</script>
<style scoped>
@reference "../css/tailwind.css";

.subsection {
    @apply divider divider-primary text-lg w-full;
}
</style>
