import { Directive } from "vue"
import { RendererElement } from "./r"

/**
 * When using regular click events on a custom element, 
 * the currentTarget or srcElement becomes the custom element instead of the element inside the shadowRoot. 
 * This directive allows listening to click events on the shadowRoot of a custom element.
 * Could be improved to allow any event type. in the future
 */
export const vShadowClick:Directive<InstanceType<typeof RendererElement>,{
    value:  (e:MouseEvent) => void
}> = {
        mounted(el, binding) {
            el.shadowRoot?.addEventListener("click", binding.value as any)
        },
        unmounted(el, binding) {
            el.shadowRoot?.removeEventListener("click", binding.value as any)
        }
}
