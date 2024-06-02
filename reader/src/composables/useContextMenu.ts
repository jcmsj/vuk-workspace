import { useMouse } from "@vueuse/core";
import { ref } from "vue";

export function useContextMenu() {
    const {x,y} = useMouse()
    const desiredLocation = ref<{
      x: number,
      y: number,
    } | undefined>()
    const lastMouseEvent = ref<EventTarget[]>()
    function show(e: MouseEvent) {
      desiredLocation.value = {
        x: x.value,
        y: y.value,
      }
        lastMouseEvent.value = e.composedPath()
      e.preventDefault()
    }
    function hide() {
      desiredLocation.value = undefined
    }
    return {
        show,
        desiredLocation,
        hide,
        mouseEvent: lastMouseEvent,
    }
}
