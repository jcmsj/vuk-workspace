export default function getScrollPercentage(elem?:Element) {
    if (elem instanceof Element)
        return parseInt((elem.scrollTop / elem.scrollHeight * 100).toFixed(2));

    return 0;
}
