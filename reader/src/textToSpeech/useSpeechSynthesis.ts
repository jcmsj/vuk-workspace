import { type Split, TranscriptElement } from "@jcsj/transcript";
import { useLocalStorage } from "@vueuse/core";
import { computed, ref, Ref, shallowRef } from "vue";
import { scrollIfUnseen } from "../lib/"

/**
 * Replace the child node with a TranscriptElement
 */
function transform(n: ChildNode, wordIndex: number = -1): InstanceType<typeof TranscriptElement> {
  const transcriptElement = new TranscriptElement({
    highlightedIndex: wordIndex,
  })
  const old = n.parentNode!.replaceChild(transcriptElement, n)
  transcriptElement.appendChild(old)
  return transcriptElement
}

function revert(elem: InstanceType<typeof TranscriptElement>) {
  // replace elem with its first child
  const old = elem.firstChild!
  elem.replaceWith(old)
  return old
}

export function useSpeechRate(key: string = "speechRate") {
  const speechRate = useLocalStorage(key, 1)
  const max = 2
  const min = 0.5
  const speechRateLabel = computed(() => {
    return speechRate.value.toFixed(2)
  })
  const increment = (step: number) => {
    if (speechRate.value >= max) {
      speechRate.value = max
      return
    }
    speechRate.value += step
  }

  const decrement = (step: number) => {
    if (speechRate.value <= min) {
      speechRate.value = min
      return
    }
    speechRate.value -= step
  }
  return {
    speechRate,
    increment,
    decrement,
    max,
    min,
    speechRateLabel,
  }
}
let forceStopFlag = ref(false)
/**
 * TODO: accept event handlers to implement features like bookmarking
 */
export function useSpeechSynthesis({ key, treeWalker, voice, onRead }: {
  key: {
    speechRate: string
  },
  treeWalker: Ref<TreeWalker | undefined>,
  voice: { value?: SpeechSynthesisVoice },
  onRead?: (n: ChildNode) => void
}) {
  const transcriptElem = shallowRef<InstanceType<typeof TranscriptElement>>()
  const { speechRate } = useSpeechRate(key.speechRate)
  const isReading = ref(false)
  function onTranscriptEnd() {
    if (forceStopFlag.value) {
      console.log('TTS: Force stopped')
      isReading.value = false
    }
    if (isReading.value == true) {
      next()
    }
  }
  function speak(txt: string) {
    const utt = new SpeechSynthesisUtterance(txt)
    utt.rate = speechRate.value
    utt.voice = voice.value ?? null
    utt.onboundary = onBoundary
    utt.onend = onTranscriptEnd
    speechSynthesis.speak(utt)
  }

  function stop() {
    console.log('TTS: Stopping')
    forceStopFlag.value = true
    isReading.value = false
    speechSynthesis.cancel()
  }

  function onBoundary(e: SpeechSynthesisEvent) {
    if (e.name != "word")
      return;

    if (transcriptElem.value) {
      transcriptElem.value.highlightedIndex++;
    }
  }

  function setTranscriptFromEvent(composedPath: EventTarget[]) {
    const target = composedPath[0]
    if (!(target instanceof HTMLElement)) {
      console.log('TTS: Not an HTMLElement')
      return
    }
    if (!target.firstChild) {
      console.log('TTS: No first child')
      return
    }
    // override
    if (!treeWalker.value) {
      return
    }

    if (isReading.value) {
      // revert
      if (transcriptElem.value) {
        treeWalker.value.currentNode = revert(transcriptElem.value)
      }
      stop()
    }
    treeWalker.value.currentNode = target.firstChild
    forceStopFlag.value = false;
    readAloud(target.firstChild)
    console.log("TTS: Overriden")
  }

  function follow() {
    if (transcriptElem.value) {
      scrollIfUnseen(transcriptElem.value)
    }
  }

  function next() {
    if (transcriptElem.value == undefined) {
      console.log('TTS: No transcriptElem')
      return
    }

    if (treeWalker.value == undefined) {
      console.log('TTS: No treeWalker')
      return
    }
    treeWalker.value.currentNode = revert(transcriptElem.value)
    const n = treeWalker.value.nextNode()
    if (n) {
      console.log("TTS: NEXT")
      readAloud(n as ChildNode)
    } else {
      console.log('TTS: No next node')
    }
  }

  function readAloud(n: ChildNode): void {
    // Use the first node child
    let text = n.textContent;
    if (n instanceof TranscriptElement) {
      // skip transformation
      const start = n.highlightedIndex + 1 // Plus 1 to skip the current word
      // if ((n as any)._instance == undefined) {
      //   onTranscriptEnd()
      //   return
      // }
      const splits: Split[] = (n as any)._instance.provides.splits._value
      // join from highlightedIndex to the end based on split.index
      text = splits.reduce((acc, split) => {
        // check index == highlightedIndex
        if (acc.found || split.index == start) {
          acc.found = true
          acc.acc += split.text
        }

        return acc
      }, { acc: "", found: false }).acc
    } else {
      transcriptElem.value = transform(n, -1)
    }
    // todo: skip to highlightedIndex by indexing the splits, 
    // see TODO in Transcript.ce.vue
    isReading.value = true
    speak(text ?? "")
    follow()
    onRead?.(n)
  }

  function start() {
    forceStopFlag.value = false
    console.log("TTS: Starting")
    if (treeWalker.value?.currentNode == null) {
      console.log('TTS: No currentNode')
      return
    }
    if (transcriptElem.value) {
      readAloud(transcriptElem.value)
    } else {
      readAloud(treeWalker.value.currentNode as ChildNode)
    }
  }

  function toggle() {
    isReading.value ? stop() : start()
  }
  return {
    transcriptElem,
    speechRate,
    isReading,
    start,
    stop,
    toggle,
    setTranscriptFromEvent,
  }
}
