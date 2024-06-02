import generateSelector from "@jcsj/generate-selector"
import getScrollPercentage from "../renderer/getScrollPercentage";
import { Book, db } from "../db/dexie";
import { useTitle } from "@vueuse/core";
import { ref } from "vue";
export interface Progress extends Object {
    elem: Element,
    percentage: number
}

export interface Bookmark extends Object {
    percentage: number,
    selector: string,
    text: string
}

// first target to have a scroll percentage greater than 0
function calcScrollPercentage(composedPath: EventTarget[]): number {
    return composedPath.reduce((percentageCandidate, target) => {
        if (percentageCandidate) return percentageCandidate;
        if (target instanceof HTMLElement) {
            const percentage = getScrollPercentage(target);
            if (percentage > 0) {
                console.log("Found", target, percentage);
                return percentage;
            }
        }
        return percentageCandidate;
    }, 0)
}
export const trimLength = ref<number>(64)
export async function onClick(composedPath: EventTarget[]) {
    const target: EventTarget = composedPath[0];
    console.log(composedPath)

    if (target instanceof HTMLElement) {
        const selector = generateSelector(target);
        target.classList.add(BOOKMARK_CLASS);
        const percentage = calcScrollPercentage(composedPath);
        // const percentage = getScrollPercentage(target);
        const bookmark: Bookmark = {
            percentage,
            selector,
            text: target.textContent?.substring(0,trimLength.value) || ""
        }
        const title = useTitle()
        if (!title.value) {
            throw new Error("No title found");
        };
        if (book.value) {
            db.bookmarks.add({
                ...bookmark,
                bookId: book.value.id,
            })
        } else {
            throw new Error("No book found");
        }
        console.log(bookmark);
    }
}

export const book = ref<Book>()

export const BOOKMARK_CLASS = "vuk-bookmark"
