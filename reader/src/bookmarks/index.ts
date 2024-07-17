import generateSelector from "@jcsj/generate-selector"
import getScrollPercentage from "../renderer/getScrollPercentage";
import { Book, BookmarkRow, db } from "../db/dexie";
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

    if (!(target instanceof HTMLElement)) {
        throw new Error("Target is not an HTMLElement");
    }
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

export const book = ref<Book>()

export const BOOKMARK_CLASS = "vuk-bookmark"

export async function removeBookmark(b:BookmarkRow) {
    await db.bookmarks.delete(b.id)
}

function calcScrollPercentageByAscendingDOMTree(elem: Element): number {
    let currentElem: Element | null = elem;
    while (currentElem) {
        // Attempt to calculate the scroll percentage at this level
        const percentage = getScrollPercentage(currentElem);
        if (percentage > 0) {
            return percentage;
        }
        // If the current element is inside a shadow DOM
        if (currentElem.parentNode instanceof ShadowRoot) {
            // Use the host as the next element to check
            currentElem = currentElem.parentNode.host;
        } else {
            // Otherwise, move to the parent element
            currentElem = currentElem.parentElement;
        }
    }
    return 0;
}

export function fromElement(elem: Element): Bookmark {
    const selector = generateSelector(elem);
    const percentage = calcScrollPercentageByAscendingDOMTree(elem)
    const text = elem.textContent?.substring(0,trimLength.value) || "";
    return {
        percentage,
        selector,
        text,
    }
}
export async function addTTsBookmark(n:Element) {
    // delete tts bookmark for this book
    if (!book.value) throw new Error("No book found")
    const bookmark = fromElement(n)
    await db.tts.put({
        ...bookmark,
        id: book.value.id,
        bookId: book.value.id,
    }, book.value.id)
}
