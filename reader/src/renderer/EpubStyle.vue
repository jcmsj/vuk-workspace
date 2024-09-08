<template>
    <component is="style" v-for="scope of scopes" :key="scope.id">
        {{ scope.style }}
    </component>
    <component is="style">
        img {
            /* Sizing */
            max-width: 95vw !important;
            max-height: 80vh !important;
            object-fit: contain;
            /* Aligns center */
            margin-inline: auto;
        }

        div[ch] {
            min-height: 110vh;

            /* Uses is to increase specificity due to chrome vs firefox 
            * :deep doesnt work https://github.com/vuejs/core/issues/6605
            */
            :is(img, svg:has(image)) {
                /* Sizing */
                object-fit: contain;
                max-height: 80vh !important;
                max-width: 95% !important;
                /* Aligns center */
                margin-inline: auto;
                display: block;
            }

            :is(h1, h2, h3, h4, h5, h6) {
                align-self: center;

                /* Patch for stylized chapter titles for now */
                img {
                    display: inline;
                }
            }
        }
    </component>
</template>
<script setup lang=ts>
import { EnhancedEpub } from './EnhancedEpub';
import { asyncComputed } from '@vueuse/core';

const props = defineProps<{
    epub:EnhancedEpub
}>()
interface Scope {
    style: string;
    id: string;
}
const scopes = asyncComputed<Scope[]>(async () => loadAllCSS(props.epub), []);
async function loadAllCSS(epub: EnhancedEpub): Promise<Scope[]> {
    const styles = epub.matchAll(/style|css/)
    // log(styles)
    return Promise.all(
        styles.map(async (s) => ({
            style: await props.epub?.getContentRaw(s.id ?? ""),
            id: s.id})))
}

</script>
<style>

</style>
