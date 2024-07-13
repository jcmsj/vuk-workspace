function skipEmpty(n:Node) {
    return n.textContent && 
        /\w/g.test(n.textContent) ? 
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
