import { liveQuery } from "dexie";
import { useObservable,from } from "@vueuse/rxjs";
import { db, Settings } from '../db/dexie';
import { computed, watch } from "vue";
import { file } from "../renderer/file";
export const SETTINGS_ID=1

const DEFAULT_SETTINGS:Settings = {
    id: SETTINGS_ID,
    cacheSize: 3,
    devMode: false,
    theme: 'light',
    speechRate: 1,
    speechPanel: true,
    electronDir: undefined,
    lastDir: undefined,
}
export async function initSettingsIfNotExist() {
    const settings = await db.settings.get(SETTINGS_ID)
    if (!settings) {
        await db.settings.add(DEFAULT_SETTINGS)
    }
}

export const settings = useObservable(
    from(liveQuery(() => {
        return db.settings.where("id").equals(SETTINGS_ID).first()
    }))
)

export const theme = computed(() => settings.value?.theme)

// watchTheme
export function watchTheme() {
    return watch(theme, (name) => {
        document.documentElement.setAttribute("data-theme", name ?? 'light')
    })
}

export async function loadBookFromCache() {
    // get the latest accessed book
    await db.cache.orderBy("lastAccessed").last().then((cache) => {
        if (cache) {
            // load the book from the cache
            file.value = cache.data
        }
    })
}
