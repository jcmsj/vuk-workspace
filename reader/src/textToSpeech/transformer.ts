import TranscriptText from "transcript-text";
export {walker, setWalker} from "./walker"

customElements.define("transcript-text", TranscriptText);

/**
 * Transforms the words in a readable element into indexible span tags.
 */
export default class Transformer {
    public node:Node|null = null;
    public elem:TranscriptText|null = null;
    public readonly className:string;
    constructor(className:string) {
        this.className = className;
    }
    /**
     * @param {Number} wordIndex last word read by TTS. It is >= 0 
     * @returns char index to resume speaking.
     */
    transform(n:Node, wordIndex:number) {
        const resumed = n.isSameNode(this.node)

        let charIndex:number = 0;
        if (resumed) { //Find the absolute position
            charIndex = this.elem?.indices[this.elem.index - 1] || 0; //negative offset
        } else {
            //Actual transformation
            this.elem = new TranscriptText(n);
            this.node = n.parentNode?.replaceChild(this.elem, n)||null;
        }
        
        return charIndex;
    }

    revert() {
        if (this.elem instanceof TranscriptText && this.node) {
            this.elem.parentElement?.replaceChild(this.node, this.elem);
        }
    }
}
