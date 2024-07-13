import {getCurrentInstance, onMounted, onUnmounted, ref} from "vue"

export function useCeTextContent(debugOptions?:{enabled?:boolean}) {
    const instance = getCurrentInstance()
    if (!instance) {
        throw new Error("useCeTextContent must be used within a component")
    }
    const text = ref<string>()
    const observer = new MutationObserver(muts => {
        text.value = muts[0].target.textContent ?? ''
        if (debugOptions?.enabled){
            console.log(muts);
        }
    })
    onMounted(() => {
        const root = instance.root.vnode.el
        const hasShadowRoot = root?.parentNode instanceof ShadowRoot
        if (!hasShadowRoot)  {
            throw new Error("useCeTextContent must be used in a web component")
        }
        const customElement = root.parentNode.host
        if (debugOptions?.enabled){
            console.log(customElement);
        }

        text.value = customElement.textContent ?? ''
        // childList:true will allow text content tracking
        observer.observe(customElement, { childList: true}) 
        if (debugOptions?.enabled){
            console.log("observer connected");
        }
    })
    onUnmounted(() => {
        observer.disconnect()
        if (debugOptions?.enabled){
            console.log("observer disconnected");
        }
    })

    return text
}

export function useCeSlots() {
    const instance = getCurrentInstance()
    const slots = ref<HTMLCollection>()
    if (instance) {
        onMounted(() => {
            const root = instance.root.vnode.el
            const hasShadowRoot = root?.parentNode instanceof ShadowRoot
            console.log(root);
            
            if (!hasShadowRoot) {
                throw new Error("useCeSlots must be used in a web component")
            }
            const host = root?.parentNode.host as HTMLElement
         
            slots.value = host.children

        })
    }

    return slots
}
