<template>
    <!-- create a menu -->
    <!-- toggle for devmode -->
    <div class="w-full flex flex-col self-center">
        <div class="divider divider-primary text-lg w-full">Settings</div>
        <!-- theme -->
         <!-- @vue-ignore -->
        <select  class="select self-center w-full max-w-52" :value="theme" @change="v => setTheme(v.currentTarget.value)">
            <option value="light">Light</option>
            <option value="night">Night</option>
        </select>
        <div @click="updateDevMode" class="self-center">
            <div class="form-control w-52">
                <label class="label cursor-pointer">
                    <span class="label-text">Dev mode</span>
                    <input type="checkbox" class="toggle" :checked="settings?.devMode" />
                </label>
            </div>
        </div>
        <!-- version -->
        <div class="divider divider-primary text-lg w-full">Version</div>
        <!-- app -->
        <div class="text-center">
            <span class="text-lg">{{packageJson.name}}</span>
            {{packageJson.version}}
        </div>
        <!-- vue -->
        <div class="text-center">
            <span class="text-lg">Vue</span>
            {{packageJson.dependencies.vue}}
        </div>
        <!-- daisyui -->
        <div class="text-center">
            <span class="text-lg">DaisyUI</span>
            {{packageJson.dependencies.daisyui}}
        </div>
        <!-- dexie -->
        <div class="text-center">
            <span class="text-lg">Dexie</span>
            {{packageJson.dependencies.dexie}}
        </div>
    </div>
</template>
<script setup lang="ts">
import { db } from '../db/dexie';
import { SETTINGS_ID } from "../settings";
import { settings,theme } from '../settings';
import packageJson from '../../package.json';
// get settings

function updateDevMode() {
    db.settings.update(SETTINGS_ID, { devMode: !settings?.value?.devMode })
}

async function setTheme(theme: string) {
    await db.settings.update(SETTINGS_ID, { theme })
}
</script>
