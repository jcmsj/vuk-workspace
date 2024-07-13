import { TranscriptElement } from "@jcsj/transcript"

export function onStartReadAloud(composedPath: EventTarget[]) {
    const target = composedPath[0]
    if (target instanceof HTMLElement) {
        // replace the first node child of the target with the transcriptElement
        if (target.firstChild) {
            const transcriptElement = new TranscriptElement({
                highlightedIndex: 0,
            })
            const old = target.replaceChild(transcriptElement, target.firstChild)
            transcriptElement.appendChild(old)
        } else {
            console.log('No first child')
        }
    } else {
        console.log('Not an HTMLElement')
    }
}
