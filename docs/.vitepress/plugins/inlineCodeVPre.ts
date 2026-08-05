import type MarkdownIt from 'markdown-it'

/**
 * VitePress marks fenced code blocks `v-pre` but leaves inline code alone, so
 * a snippet such as `${{<%[%'"}}%` in a SSTI note reaches the Vue compiler as
 * an interpolation and breaks the build. Rendering inline code with `v-pre`
 * keeps the payload verbatim.
 */
const inlineCodeVPre = (md: MarkdownIt) => {
    md.renderer.rules.code_inline = (tokens, idx) =>
        `<code v-pre>${md.utils.escapeHtml(tokens[idx].content)}</code>`
}

export default inlineCodeVPre
