import { BOOKMARK_CLASS } from "../bookmarks";

function skipEmpty(n:Node) {

    return n.textContent && 
        /\w/g.test(n.textContent) && 
        // Skip bookmarked element, but its child will still be checked
        !(n as HTMLElement)?.classList?.contains(BOOKMARK_CLASS) ? 
        NodeFilter.FILTER_ACCEPT: 
        NodeFilter.FILTER_SKIP
}

export function createTextTreeWalker(root:Element): TreeWalker {
    return document.createTreeWalker(
        root, 
        NodeFilter.SHOW_TEXT, 
        skipEmpty
    );
}
