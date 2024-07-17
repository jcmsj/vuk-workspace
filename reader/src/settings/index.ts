import { liveQuery } from "dexie";
import { useObservable,from } from "@vueuse/rxjs";
import { db } from '../db/dexie';
import { computed, watch } from "vue";
import { file } from "../renderer/file";
export const SETTINGS_ID=1

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
