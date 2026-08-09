/**
 * Click handler for the `#tag` chips emitted by plugins/hashtagPlugin.
 *
 * Clicking a chip opens VitePress' local search modal with the tag already
 * typed, which lists every note mentioning it. The chip carries no href, so
 * nothing happens without JS beyond the tag rendering as styled text.
 */

const SEARCH_INPUT = '#localsearch-input'

/** VitePress' input is bound with v-model, so bypass the React-style setter. */
function typeQuery(input: HTMLInputElement, value: string) {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    setter ? setter.call(input, value) : (input.value = value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.focus()
}

/** The search box is lazy-loaded on first open, so poll briefly for it. */
function waitForInput(deadline = 3000): Promise<HTMLInputElement | null> {
    const started = Date.now()
    return new Promise((resolve) => {
        const tick = () => {
            const input = document.querySelector<HTMLInputElement>(SEARCH_INPUT)
            if (input) return resolve(input)
            if (Date.now() - started > deadline) return resolve(null)
            requestAnimationFrame(tick)
        }
        tick()
    })
}

async function searchTag(tag: string) {
    const existing = document.querySelector<HTMLInputElement>(SEARCH_INPUT)
    if (!existing) {
        // Nav bar button when it is rendered, keyboard shortcut otherwise
        // (mobile layouts hide the button behind the hamburger menu).
        const button = document.querySelector<HTMLElement>('#local-search button')
        if (button) button.click()
        else
            window.dispatchEvent(
                new KeyboardEvent('keydown', {
                    key: 'k',
                    ctrlKey: true,
                    metaKey: true,
                    bubbles: true
                })
            )
    }

    const input = await waitForInput()
    // Nested tags (`parent/child`) tokenize badly; search the leaf-most words.
    if (input) typeQuery(input, tag.replace(/\//g, ' '))
}

export function setupHashtags() {
    if (typeof window === 'undefined') return
    if ((window as any).__vpHashtags) return
    ;(window as any).__vpHashtags = true

    const tagOf = (target: EventTarget | null) =>
        (target as HTMLElement | null)?.closest?.<HTMLElement>('.vp-hashtag')?.dataset.tag

    document.addEventListener('click', (event) => {
        const tag = tagOf(event.target)
        if (!tag) return
        event.preventDefault()
        searchTag(tag)
    })

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        const tag = tagOf(event.target)
        if (!tag) return
        event.preventDefault()
        searchTag(tag)
    })
}
