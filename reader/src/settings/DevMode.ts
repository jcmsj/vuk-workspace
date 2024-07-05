import { settings } from ".";

export function log(...args:Parameters<typeof console.log>) {
    if (settings.value?.devMode) {
        console.log(...args)
    }
}
