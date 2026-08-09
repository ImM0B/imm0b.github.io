import type MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import type StateCore from 'markdown-it/lib/rules_core/state_core';

/**
 * Obsidian tags: letters, digits, `_`, `-`, `/`, at least one letter, so `#1`
 * and `#2024` (issue numbers, dates) stay plain text. The tag must start at a
 * boundary, which keeps `C#`, `foo#bar` and URL fragments out.
 */
const HASHTAG_RE = /(^|[\s(\[{>«"'*_])#([\p{L}\p{N}_/-]*[\p{L}][\p{L}\p{N}_/-]*)/gu;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function splitHashtags(state: StateCore, token: Token): Token[] | null {
  const text = token.content;
  const out: Token[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  const push = (type: string, content: string) => {
    const next = new state.Token(type, '', 0);
    next.content = content;
    next.level = token.level;
    out.push(next);
  };

  HASHTAG_RE.lastIndex = 0;
  while ((match = HASHTAG_RE.exec(text)) !== null) {
    const [full, lead, tag] = match;
    const start = match.index + lead.length;

    if (start > last) push('text', text.slice(last, start));
    push(
      'html_inline',
      `<a class="vp-hashtag" role="button" tabindex="0" data-tag="${escapeHtml(tag)}">` +
        `#${escapeHtml(tag)}</a>`
    );
    last = match.index + full.length;
  }

  if (!out.length) return null;
  if (last < text.length) push('text', text.slice(last));
  return out;
}

/**
 * Turns `#tag` in prose into a clickable chip that opens VitePress' local
 * search prefilled with the tag (click handler lives in theme/hashtags.ts).
 *
 * Only inline `text` tokens are rewritten, so fenced blocks, indented code and
 * inline code are untouched by construction. Text inside a link is skipped as
 * well — nested anchors are invalid HTML.
 */
const hashtagPlugin = (md: MarkdownIt) => {
  md.core.ruler.push('obsidian-hashtags', (state) => {
    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue;

      let linkDepth = 0;
      const children: Token[] = [];

      for (const child of token.children) {
        if (child.type === 'link_open') linkDepth++;
        else if (child.type === 'link_close') linkDepth--;

        if (child.type !== 'text' || linkDepth > 0 || !child.content.includes('#')) {
          children.push(child);
          continue;
        }

        const parts = splitHashtags(state, child);
        children.push(...(parts ?? [child]));
      }

      token.children = children;
    }
  });
};

export default hashtagPlugin;
