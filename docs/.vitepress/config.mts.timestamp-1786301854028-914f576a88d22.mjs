// docs/.vitepress/config.mts
import { defineConfig } from "file:///home/m0b/Insync/darperbal@gmail.com/Google%20Drive/Sites/Vite/M0BNotes/node_modules/vitepress/dist/node/index.js";
import { tabsMarkdownPlugin } from "file:///home/m0b/Insync/darperbal@gmail.com/Google%20Drive/Sites/Vite/M0BNotes/node_modules/vitepress-plugin-tabs/dist/index.js";

// docs/.vitepress/plugins/githubAlertsPlugin.ts
var markerRE = /^\[\!(TIP|NOTE|INFO|IMPORTANT|WARNING|CAUTION|DANGER|SUCCESS)\]([^\n\r]*)/i;
var githubAlertsPlugin = (md, options) => {
  const titleMark = {
    tip: options?.tipLabel || "TIP",
    note: options?.noteLabel || "NOTE",
    info: options?.infoLabel || "INFO",
    important: options?.importantLabel || "IMPORTANT",
    warning: options?.warningLabel || "WARNING",
    caution: options?.cautionLabel || "CAUTION",
    danger: options?.dangerLabel || "DANGER",
    success: options?.successLabel || "SUCCESS"
  };
  md.core.ruler.after("block", "github-alerts", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "blockquote_open") {
        const startIndex = i;
        const open = tokens[startIndex];
        let endIndex = i + 1;
        while (endIndex < tokens.length && (tokens[endIndex].type !== "blockquote_close" || tokens[endIndex].level !== open.level))
          endIndex++;
        if (endIndex === tokens.length) continue;
        const close = tokens[endIndex];
        const firstContent = tokens.slice(startIndex, endIndex + 1).find((token) => token.type === "inline");
        if (!firstContent) continue;
        const match = firstContent.content.match(markerRE);
        if (!match) continue;
        const type = match[1].toLowerCase();
        const title = match[2].trim();
        firstContent.content = firstContent.content.slice(match[0].length).trimStart();
        open.type = "github_alert_open";
        open.tag = "div";
        open.meta = {
          title,
          type
        };
        close.type = "github_alert_close";
        close.tag = "div";
      }
    }
  });
  md.renderer.rules.github_alert_open = function(tokens, idx) {
    const { title, type } = tokens[idx].meta;
    return `<div class="${type} custom-block">${title ? `<p class="custom-block-title">${title}</p>` : ""}
`;
  };
  md.renderer.rules.github_alert_close = function() {
    return "</div>\n";
  };
};
var githubAlertsPlugin_default = githubAlertsPlugin;

// docs/.vitepress/plugins/youtubeEmbedPlugin.ts
var markerRE2 = /^\[\!YOUTUBE\]\s*(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))/i;
var youtubeEmbedPlugin = (md) => {
  md.core.ruler.after("block", "youtube-embed", (state) => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "blockquote_open") {
        const startIndex = i;
        const open = tokens[startIndex];
        let endIndex = i + 1;
        while (endIndex < tokens.length && (tokens[endIndex].type !== "blockquote_close" || tokens[endIndex].level !== open.level))
          endIndex++;
        if (endIndex === tokens.length) continue;
        const close = tokens[endIndex];
        const firstContent = tokens.slice(startIndex, endIndex + 1).find((token) => token.type === "inline");
        if (!firstContent) continue;
        const match = firstContent.content.match(markerRE2);
        if (!match) continue;
        const videoUrl = match[1];
        const videoId = match[2];
        firstContent.content = firstContent.content.slice(match[0].length).trimStart();
        open.type = "youtube_embed_open";
        open.tag = "div";
        open.meta = {
          videoUrl,
          videoId
        };
        close.type = "youtube_embed_close";
        close.tag = "div";
      }
    }
  });
  md.renderer.rules.youtube_embed_open = function(tokens, idx) {
    const { videoId } = tokens[idx].meta;
    return `<div class="youtube-embed">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
`;
  };
  md.renderer.rules.youtube_embed_close = function() {
    return "</div>\n";
  };
};
var youtubeEmbedPlugin_default = youtubeEmbedPlugin;

// docs/.vitepress/plugins/lineNumbers.ts
var lineNumberPlugin = (md, enable = false) => {
  const fence = md.renderer.rules.fence;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);
    const [tokens, idx] = args;
    const info = tokens[idx].info;
    if (!enable && !/:line-numbers($| |=)/.test(info) || enable && /:no-line-numbers($| )/.test(info)) {
      return rawCode;
    }
    let startLineNumber = 1;
    const matchStartLineNumber = info.match(/=(\d*)/);
    if (matchStartLineNumber && matchStartLineNumber[1]) {
      startLineNumber = parseInt(matchStartLineNumber[1]);
    }
    const code = rawCode.slice(
      rawCode.indexOf("<code>"),
      rawCode.indexOf("</code>")
    );
    const lines = code.split("\n");
    const lineNumbersCode = [...Array(lines.length)].map(
      (_, index) => `<span class="line-number">${index + startLineNumber}</span><br>`
    ).join("");
    const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`;
    const finalCode = rawCode.replace(/<\/div>$/, `${lineNumbersWrapperCode}</div>`).replace(/"(language-[^"]*?)"/, '"$1 line-numbers-mode"').replace("<pre", '<pre style="white-space: pre;"').replace("<code", '<code style="white-space: pre;"');
    return finalCode;
  };
};
var lineNumbers_default = lineNumberPlugin;

// docs/.vitepress/plugins/inlineCodeVPre.ts
var inlineCodeVPre = (md) => {
  md.renderer.rules.code_inline = (tokens, idx) => `<code v-pre>${md.utils.escapeHtml(tokens[idx].content)}</code>`;
};
var inlineCodeVPre_default = inlineCodeVPre;

// docs/.vitepress/config.mts
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///home/m0b/Insync/darperbal@gmail.com/Google%20Drive/Sites/Vite/M0BNotes/docs/.vitepress/config.mts";
var navigation = JSON.parse(
  readFileSync(fileURLToPath(new URL("./navigation.json", __vite_injected_original_import_meta_url)), "utf-8")
);
var config_default = defineConfig({
  title: "M0B Notes",
  srcDir: "src",
  description: "Notas t\xE9cnicas de pentesting, red team y seguridad ofensiva de Dar\xEDo P\xE9rez (M0B)",
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  appearance: "force-dark",
  sitemap: {
    hostname: "https://imm0b.github.io"
  },
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/images/m0b2.svg" }],
    ["link", { rel: "alternate icon", type: "image/png", href: "/images/m0b.png" }],
    ["link", { rel: "apple-touch-icon", href: "/images/m0b.png" }],
    ["meta", { name: "theme-color", content: "#000000" }],
    ["meta", { name: "color-scheme", content: "dark" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,1,0"
      }
    ]
  ],
  transformHead: ({ pageData }) => {
    const pageTitle = pageData.title ? `${pageData.title} | M0B Notes` : "M0B Notes";
    const pageDescription = pageData.description || "Notas t\xE9cnicas de pentesting, red team y seguridad ofensiva de Dar\xEDo P\xE9rez (M0B)";
    return [
      ["meta", { property: "og:title", content: pageTitle }],
      ["meta", { property: "og:description", content: pageDescription }],
      ["meta", { name: "twitter:title", content: pageTitle }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:description", content: pageDescription }]
    ];
  },
  themeConfig: {
    search: {
      provider: "local"
    },
    nav: navigation.nav,
    outline: "deep",
    sidebar: navigation.sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/ImM0B" },
      { icon: "linkedin", link: "https://www.linkedin.com/in/dar%C3%ADo-p%C3%A9rez/" },
      { icon: "youtube", link: "https://www.youtube.com/@dariooperez" }
    ],
    docFooter: {
      prev: "Anterior",
      next: "Siguiente"
    },
    darkModeSwitchLabel: "Tema",
    sidebarMenuLabel: "Men\xFA",
    returnToTopLabel: "Volver arriba",
    outlineTitle: "En esta p\xE1gina",
    lastUpdatedText: "Actualizado",
    footer: {
      message: "Notas personales de seguridad ofensiva.",
      copyright: "Dar\xEDo P\xE9rez Ballesteros \u2014 M0B"
    }
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(githubAlertsPlugin_default);
      md.use(youtubeEmbedPlugin_default);
      md.use(lineNumbers_default);
      md.use(inlineCodeVPre_default);
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiLCAiZG9jcy8udml0ZXByZXNzL3BsdWdpbnMvZ2l0aHViQWxlcnRzUGx1Z2luLnRzIiwgImRvY3MvLnZpdGVwcmVzcy9wbHVnaW5zL3lvdXR1YmVFbWJlZFBsdWdpbi50cyIsICJkb2NzLy52aXRlcHJlc3MvcGx1Z2lucy9saW5lTnVtYmVycy50cyIsICJkb2NzLy52aXRlcHJlc3MvcGx1Z2lucy9pbmxpbmVDb2RlVlByZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL20wYi9JbnN5bmMvZGFycGVyYmFsQGdtYWlsLmNvbS9Hb29nbGUgRHJpdmUvU2l0ZXMvVml0ZS9NMEJOb3Rlcy9kb2NzLy52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL20wYi9JbnN5bmMvZGFycGVyYmFsQGdtYWlsLmNvbS9Hb29nbGUgRHJpdmUvU2l0ZXMvVml0ZS9NMEJOb3Rlcy9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9tMGIvSW5zeW5jL2RhcnBlcmJhbEBnbWFpbC5jb20vR29vZ2xlJTIwRHJpdmUvU2l0ZXMvVml0ZS9NMEJOb3Rlcy9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBEZWZhdWx0VGhlbWUgfSBmcm9tICd2aXRlcHJlc3MnXG5pbXBvcnQgeyB0YWJzTWFya2Rvd25QbHVnaW4gfSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLXRhYnMnXG5pbXBvcnQgZ2l0aHViQWxlcnRzUGx1Z2luIGZyb20gJy4vcGx1Z2lucy9naXRodWJBbGVydHNQbHVnaW4nXG5pbXBvcnQgeW91dHViZUVtYmVkUGx1Z2luIGZyb20gJy4vcGx1Z2lucy95b3V0dWJlRW1iZWRQbHVnaW4nXG5pbXBvcnQgbGluZU51bWJlclBsdWdpbiBmcm9tICcuL3BsdWdpbnMvbGluZU51bWJlcnMnXG5pbXBvcnQgaW5saW5lQ29kZVZQcmUgZnJvbSAnLi9wbHVnaW5zL2lubGluZUNvZGVWUHJlJ1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnbm9kZTpmcydcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCdcblxuLy8gR2VuZXJhdGVkIGJ5IGBucG0gcnVuIGltcG9ydGAgZnJvbSB0aGUgT2JzaWRpYW4gRGlnaXRhbCBHYXJkZW4gdmF1bHQuXG5jb25zdCBuYXZpZ2F0aW9uID0gSlNPTi5wYXJzZShcbiAgICByZWFkRmlsZVN5bmMoZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL25hdmlnYXRpb24uanNvbicsIGltcG9ydC5tZXRhLnVybCkpLCAndXRmLTgnKVxuKSBhcyB7XG4gICAgbmF2OiBEZWZhdWx0VGhlbWUuTmF2SXRlbVtdXG4gICAgc2lkZWJhcjogRGVmYXVsdFRoZW1lLlNpZGViYXJJdGVtW11cbn1cblxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICB0aXRsZTogJ00wQiBOb3RlcycsXG4gICAgc3JjRGlyOiAnc3JjJyxcbiAgICBkZXNjcmlwdGlvbjogJ05vdGFzIHRcdTAwRTljbmljYXMgZGUgcGVudGVzdGluZywgcmVkIHRlYW0geSBzZWd1cmlkYWQgb2ZlbnNpdmEgZGUgRGFyXHUwMEVEbyBQXHUwMEU5cmV6IChNMEIpJyxcbiAgICBjbGVhblVybHM6IHRydWUsXG4gICAgbGFzdFVwZGF0ZWQ6IHRydWUsXG4gICAgaWdub3JlRGVhZExpbmtzOiB0cnVlLFxuICAgIGFwcGVhcmFuY2U6ICdmb3JjZS1kYXJrJyxcbiAgICBzaXRlbWFwOiB7XG4gICAgICAgIGhvc3RuYW1lOiAnaHR0cHM6Ly9pbW0wYi5naXRodWIuaW8nXG4gICAgfSxcbiAgICBoZWFkOiBbXG4gICAgICAgIFsnbGluaycsIHsgcmVsOiAnaWNvbicsIHR5cGU6ICdpbWFnZS9zdmcreG1sJywgaHJlZjogJy9pbWFnZXMvbTBiMi5zdmcnIH1dLFxuICAgICAgICBbJ2xpbmsnLCB7IHJlbDogJ2FsdGVybmF0ZSBpY29uJywgdHlwZTogJ2ltYWdlL3BuZycsIGhyZWY6ICcvaW1hZ2VzL20wYi5wbmcnIH1dLFxuICAgICAgICBbJ2xpbmsnLCB7IHJlbDogJ2FwcGxlLXRvdWNoLWljb24nLCBocmVmOiAnL2ltYWdlcy9tMGIucG5nJyB9XSxcbiAgICAgICAgWydtZXRhJywgeyBuYW1lOiAndGhlbWUtY29sb3InLCBjb250ZW50OiAnIzAwMDAwMCcgfV0sXG4gICAgICAgIFsnbWV0YScsIHsgbmFtZTogJ2NvbG9yLXNjaGVtZScsIGNvbnRlbnQ6ICdkYXJrJyB9XSxcbiAgICAgICAgW1xuICAgICAgICAgICAgJ2xpbmsnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlbDogJ3N0eWxlc2hlZXQnLFxuICAgICAgICAgICAgICAgIGhyZWY6ICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PU1hdGVyaWFsK1N5bWJvbHMrT3V0bGluZWQ6b3Bzeix3Z2h0LEZJTEwsR1JBREAyNCw0MDAsMSwwJ1xuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgXSxcbiAgICB0cmFuc2Zvcm1IZWFkOiAoeyBwYWdlRGF0YSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHBhZ2VUaXRsZSA9IHBhZ2VEYXRhLnRpdGxlID8gYCR7cGFnZURhdGEudGl0bGV9IHwgTTBCIE5vdGVzYCA6ICdNMEIgTm90ZXMnXG4gICAgICAgIGNvbnN0IHBhZ2VEZXNjcmlwdGlvbiA9XG4gICAgICAgICAgICBwYWdlRGF0YS5kZXNjcmlwdGlvbiB8fFxuICAgICAgICAgICAgJ05vdGFzIHRcdTAwRTljbmljYXMgZGUgcGVudGVzdGluZywgcmVkIHRlYW0geSBzZWd1cmlkYWQgb2ZlbnNpdmEgZGUgRGFyXHUwMEVEbyBQXHUwMEU5cmV6IChNMEIpJ1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgWydtZXRhJywgeyBwcm9wZXJ0eTogJ29nOnRpdGxlJywgY29udGVudDogcGFnZVRpdGxlIH1dLFxuICAgICAgICAgICAgWydtZXRhJywgeyBwcm9wZXJ0eTogJ29nOmRlc2NyaXB0aW9uJywgY29udGVudDogcGFnZURlc2NyaXB0aW9uIH1dLFxuICAgICAgICAgICAgWydtZXRhJywgeyBuYW1lOiAndHdpdHRlcjp0aXRsZScsIGNvbnRlbnQ6IHBhZ2VUaXRsZSB9XSxcbiAgICAgICAgICAgIFsnbWV0YScsIHsgbmFtZTogJ3R3aXR0ZXI6Y2FyZCcsIGNvbnRlbnQ6ICdzdW1tYXJ5X2xhcmdlX2ltYWdlJyB9XSxcbiAgICAgICAgICAgIFsnbWV0YScsIHsgbmFtZTogJ3R3aXR0ZXI6ZGVzY3JpcHRpb24nLCBjb250ZW50OiBwYWdlRGVzY3JpcHRpb24gfV1cbiAgICAgICAgXVxuICAgIH0sXG4gICAgdGhlbWVDb25maWc6IHtcbiAgICAgICAgc2VhcmNoOiB7XG4gICAgICAgICAgICBwcm92aWRlcjogJ2xvY2FsJ1xuICAgICAgICB9LFxuICAgICAgICBuYXY6IG5hdmlnYXRpb24ubmF2LFxuICAgICAgICBvdXRsaW5lOiAnZGVlcCcsXG4gICAgICAgIHNpZGViYXI6IG5hdmlnYXRpb24uc2lkZWJhcixcbiAgICAgICAgc29jaWFsTGlua3M6IFtcbiAgICAgICAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vSW1NMEInIH0sXG4gICAgICAgICAgICB7IGljb246ICdsaW5rZWRpbicsIGxpbms6ICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vZGFyJUMzJUFEby1wJUMzJUE5cmV6LycgfSxcbiAgICAgICAgICAgIHsgaWNvbjogJ3lvdXR1YmUnLCBsaW5rOiAnaHR0cHM6Ly93d3cueW91dHViZS5jb20vQGRhcmlvb3BlcmV6JyB9XG4gICAgICAgIF0sXG4gICAgICAgIGRvY0Zvb3Rlcjoge1xuICAgICAgICAgICAgcHJldjogJ0FudGVyaW9yJyxcbiAgICAgICAgICAgIG5leHQ6ICdTaWd1aWVudGUnXG4gICAgICAgIH0sXG4gICAgICAgIGRhcmtNb2RlU3dpdGNoTGFiZWw6ICdUZW1hJyxcbiAgICAgICAgc2lkZWJhck1lbnVMYWJlbDogJ01lblx1MDBGQScsXG4gICAgICAgIHJldHVyblRvVG9wTGFiZWw6ICdWb2x2ZXIgYXJyaWJhJyxcbiAgICAgICAgb3V0bGluZVRpdGxlOiAnRW4gZXN0YSBwXHUwMEUxZ2luYScsXG4gICAgICAgIGxhc3RVcGRhdGVkVGV4dDogJ0FjdHVhbGl6YWRvJyxcbiAgICAgICAgZm9vdGVyOiB7XG4gICAgICAgICAgICBtZXNzYWdlOiAnTm90YXMgcGVyc29uYWxlcyBkZSBzZWd1cmlkYWQgb2ZlbnNpdmEuJyxcbiAgICAgICAgICAgIGNvcHlyaWdodDogJ0Rhclx1MDBFRG8gUFx1MDBFOXJleiBCYWxsZXN0ZXJvcyBcdTIwMTQgTTBCJ1xuICAgICAgICB9XG4gICAgfSxcbiAgICBtYXJrZG93bjoge1xuICAgICAgICBjb25maWcobWQpIHtcbiAgICAgICAgICAgIG1kLnVzZSh0YWJzTWFya2Rvd25QbHVnaW4pXG4gICAgICAgICAgICBtZC51c2UoZ2l0aHViQWxlcnRzUGx1Z2luKVxuICAgICAgICAgICAgbWQudXNlKHlvdXR1YmVFbWJlZFBsdWdpbilcbiAgICAgICAgICAgIG1kLnVzZShsaW5lTnVtYmVyUGx1Z2luKVxuICAgICAgICAgICAgbWQudXNlKGlubGluZUNvZGVWUHJlKVxuICAgICAgICB9XG4gICAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvbTBiL0luc3luYy9kYXJwZXJiYWxAZ21haWwuY29tL0dvb2dsZSBEcml2ZS9TaXRlcy9WaXRlL00wQk5vdGVzL2RvY3MvLnZpdGVwcmVzcy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tMGIvSW5zeW5jL2RhcnBlcmJhbEBnbWFpbC5jb20vR29vZ2xlIERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnMvZ2l0aHViQWxlcnRzUGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL20wYi9JbnN5bmMvZGFycGVyYmFsQGdtYWlsLmNvbS9Hb29nbGUlMjBEcml2ZS9TaXRlcy9WaXRlL00wQk5vdGVzL2RvY3MvLnZpdGVwcmVzcy9wbHVnaW5zL2dpdGh1YkFsZXJ0c1BsdWdpbi50c1wiO2ltcG9ydCB0eXBlIE1hcmtkb3duSXQgZnJvbSAnbWFya2Rvd24taXQnO1xuXG5jb25zdCBtYXJrZXJSRSA9IC9eXFxbXFwhKFRJUHxOT1RFfElORk98SU1QT1JUQU5UfFdBUk5JTkd8Q0FVVElPTnxEQU5HRVJ8U1VDQ0VTUylcXF0oW15cXG5cXHJdKikvaTtcblxuY29uc3QgZ2l0aHViQWxlcnRzUGx1Z2luID0gKG1kOiBNYXJrZG93bkl0LCBvcHRpb25zPzogYW55KSA9PiB7XG4gIGNvbnN0IHRpdGxlTWFyayA9IHtcbiAgICB0aXA6IG9wdGlvbnM/LnRpcExhYmVsIHx8IFwiVElQXCIsXG4gICAgbm90ZTogb3B0aW9ucz8ubm90ZUxhYmVsIHx8IFwiTk9URVwiLFxuICAgIGluZm86IG9wdGlvbnM/LmluZm9MYWJlbCB8fCBcIklORk9cIixcbiAgICBpbXBvcnRhbnQ6IG9wdGlvbnM/LmltcG9ydGFudExhYmVsIHx8IFwiSU1QT1JUQU5UXCIsXG4gICAgd2FybmluZzogb3B0aW9ucz8ud2FybmluZ0xhYmVsIHx8IFwiV0FSTklOR1wiLFxuICAgIGNhdXRpb246IG9wdGlvbnM/LmNhdXRpb25MYWJlbCB8fCBcIkNBVVRJT05cIixcbiAgICBkYW5nZXI6IG9wdGlvbnM/LmRhbmdlckxhYmVsIHx8IFwiREFOR0VSXCIsXG4gICAgc3VjY2Vzczogb3B0aW9ucz8uc3VjY2Vzc0xhYmVsIHx8IFwiU1VDQ0VTU1wiXG4gIH07XG5cbiAgbWQuY29yZS5ydWxlci5hZnRlcihcImJsb2NrXCIsIFwiZ2l0aHViLWFsZXJ0c1wiLCAoc3RhdGUpID0+IHtcbiAgICBjb25zdCB0b2tlbnMgPSBzdGF0ZS50b2tlbnM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0b2tlbnNbaV0udHlwZSA9PT0gXCJibG9ja3F1b3RlX29wZW5cIikge1xuICAgICAgICBjb25zdCBzdGFydEluZGV4ID0gaTtcbiAgICAgICAgY29uc3Qgb3BlbiA9IHRva2Vuc1tzdGFydEluZGV4XTtcbiAgICAgICAgbGV0IGVuZEluZGV4ID0gaSArIDE7XG4gICAgICAgIHdoaWxlIChlbmRJbmRleCA8IHRva2Vucy5sZW5ndGggJiYgKHRva2Vuc1tlbmRJbmRleF0udHlwZSAhPT0gXCJibG9ja3F1b3RlX2Nsb3NlXCIgfHwgdG9rZW5zW2VuZEluZGV4XS5sZXZlbCAhPT0gb3Blbi5sZXZlbCkpXG4gICAgICAgICAgZW5kSW5kZXgrKztcbiAgICAgICAgaWYgKGVuZEluZGV4ID09PSB0b2tlbnMubGVuZ3RoKSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY2xvc2UgPSB0b2tlbnNbZW5kSW5kZXhdO1xuICAgICAgICBjb25zdCBmaXJzdENvbnRlbnQgPSB0b2tlbnMuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXggKyAxKS5maW5kKCh0b2tlbikgPT4gdG9rZW4udHlwZSA9PT0gXCJpbmxpbmVcIik7XG4gICAgICAgIGlmICghZmlyc3RDb250ZW50KSBjb250aW51ZTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBmaXJzdENvbnRlbnQuY29udGVudC5tYXRjaChtYXJrZXJSRSk7XG4gICAgICAgIGlmICghbWF0Y2gpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCB0eXBlID0gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBtYXRjaFsyXS50cmltKCk7XG4gICAgICAgIGZpcnN0Q29udGVudC5jb250ZW50ID0gZmlyc3RDb250ZW50LmNvbnRlbnQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKS50cmltU3RhcnQoKTtcbiAgICAgICAgb3Blbi50eXBlID0gXCJnaXRodWJfYWxlcnRfb3BlblwiO1xuICAgICAgICBvcGVuLnRhZyA9IFwiZGl2XCI7XG4gICAgICAgIG9wZW4ubWV0YSA9IHtcbiAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICB0eXBlXG4gICAgICAgIH07XG4gICAgICAgIGNsb3NlLnR5cGUgPSBcImdpdGh1Yl9hbGVydF9jbG9zZVwiO1xuICAgICAgICBjbG9zZS50YWcgPSBcImRpdlwiO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgbWQucmVuZGVyZXIucnVsZXMuZ2l0aHViX2FsZXJ0X29wZW4gPSBmdW5jdGlvbih0b2tlbnMsIGlkeCkge1xuICAgIGNvbnN0IHsgdGl0bGUsIHR5cGUgfSA9IHRva2Vuc1tpZHhdLm1ldGE7XG4gICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiJHt0eXBlfSBjdXN0b20tYmxvY2tcIj4ke3RpdGxlID8gYDxwIGNsYXNzPVwiY3VzdG9tLWJsb2NrLXRpdGxlXCI+JHt0aXRsZX08L3A+YCA6ICcnfVxcbmA7XG4gIH07XG5cbiAgbWQucmVuZGVyZXIucnVsZXMuZ2l0aHViX2FsZXJ0X2Nsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICc8L2Rpdj5cXG4nO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2l0aHViQWxlcnRzUGx1Z2luO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9tMGIvSW5zeW5jL2RhcnBlcmJhbEBnbWFpbC5jb20vR29vZ2xlIERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL20wYi9JbnN5bmMvZGFycGVyYmFsQGdtYWlsLmNvbS9Hb29nbGUgRHJpdmUvU2l0ZXMvVml0ZS9NMEJOb3Rlcy9kb2NzLy52aXRlcHJlc3MvcGx1Z2lucy95b3V0dWJlRW1iZWRQbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbTBiL0luc3luYy9kYXJwZXJiYWxAZ21haWwuY29tL0dvb2dsZSUyMERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnMveW91dHViZUVtYmVkUGx1Z2luLnRzXCI7aW1wb3J0IHR5cGUgTWFya2Rvd25JdCBmcm9tICdtYXJrZG93bi1pdCc7XG5cbmNvbnN0IG1hcmtlclJFID0gL15cXFtcXCFZT1VUVUJFXFxdXFxzKihodHRwczpcXC9cXC93d3dcXC55b3V0dWJlXFwuY29tXFwvd2F0Y2hcXD92PShbYS16QS1aMC05Xy1dKykpL2k7XG5cbmNvbnN0IHlvdXR1YmVFbWJlZFBsdWdpbiA9IChtZDogTWFya2Rvd25JdCkgPT4ge1xuICBtZC5jb3JlLnJ1bGVyLmFmdGVyKFwiYmxvY2tcIiwgXCJ5b3V0dWJlLWVtYmVkXCIsIChzdGF0ZSkgPT4ge1xuICAgIGNvbnN0IHRva2VucyA9IHN0YXRlLnRva2VucztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRva2Vuc1tpXS50eXBlID09PSBcImJsb2NrcXVvdGVfb3BlblwiKSB7XG4gICAgICAgIGNvbnN0IHN0YXJ0SW5kZXggPSBpO1xuICAgICAgICBjb25zdCBvcGVuID0gdG9rZW5zW3N0YXJ0SW5kZXhdO1xuICAgICAgICBsZXQgZW5kSW5kZXggPSBpICsgMTtcbiAgICAgICAgd2hpbGUgKGVuZEluZGV4IDwgdG9rZW5zLmxlbmd0aCAmJiAodG9rZW5zW2VuZEluZGV4XS50eXBlICE9PSBcImJsb2NrcXVvdGVfY2xvc2VcIiB8fCB0b2tlbnNbZW5kSW5kZXhdLmxldmVsICE9PSBvcGVuLmxldmVsKSlcbiAgICAgICAgICBlbmRJbmRleCsrO1xuICAgICAgICBpZiAoZW5kSW5kZXggPT09IHRva2Vucy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBjbG9zZSA9IHRva2Vuc1tlbmRJbmRleF07XG4gICAgICAgIGNvbnN0IGZpcnN0Q29udGVudCA9IHRva2Vucy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCArIDEpLmZpbmQoKHRva2VuKSA9PiB0b2tlbi50eXBlID09PSBcImlubGluZVwiKTtcbiAgICAgICAgaWYgKCFmaXJzdENvbnRlbnQpIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBtYXRjaCA9IGZpcnN0Q29udGVudC5jb250ZW50Lm1hdGNoKG1hcmtlclJFKTtcbiAgICAgICAgaWYgKCFtYXRjaCkgY29udGludWU7XG4gICAgICAgIGNvbnN0IHZpZGVvVXJsID0gbWF0Y2hbMV07XG4gICAgICAgIGNvbnN0IHZpZGVvSWQgPSBtYXRjaFsyXTtcbiAgICAgICAgZmlyc3RDb250ZW50LmNvbnRlbnQgPSBmaXJzdENvbnRlbnQuY29udGVudC5zbGljZShtYXRjaFswXS5sZW5ndGgpLnRyaW1TdGFydCgpO1xuICAgICAgICBvcGVuLnR5cGUgPSBcInlvdXR1YmVfZW1iZWRfb3BlblwiO1xuICAgICAgICBvcGVuLnRhZyA9IFwiZGl2XCI7XG4gICAgICAgIG9wZW4ubWV0YSA9IHtcbiAgICAgICAgICB2aWRlb1VybCxcbiAgICAgICAgICB2aWRlb0lkXG4gICAgICAgIH07XG4gICAgICAgIGNsb3NlLnR5cGUgPSBcInlvdXR1YmVfZW1iZWRfY2xvc2VcIjtcbiAgICAgICAgY2xvc2UudGFnID0gXCJkaXZcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIG1kLnJlbmRlcmVyLnJ1bGVzLnlvdXR1YmVfZW1iZWRfb3BlbiA9IGZ1bmN0aW9uKHRva2VucywgaWR4KSB7XG4gICAgY29uc3QgeyB2aWRlb0lkIH0gPSB0b2tlbnNbaWR4XS5tZXRhO1xuICAgIHJldHVybiBgPGRpdiBjbGFzcz1cInlvdXR1YmUtZW1iZWRcIj5cbiAgPGlmcmFtZSB3aWR0aD1cIjU2MFwiIGhlaWdodD1cIjMxNVwiIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyR7dmlkZW9JZH1cIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvdz1cImFjY2VsZXJvbWV0ZXI7IGF1dG9wbGF5OyBlbmNyeXB0ZWQtbWVkaWE7IGd5cm9zY29wZTsgcGljdHVyZS1pbi1waWN0dXJlXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPlxcbmA7XG4gIH07XG5cbiAgbWQucmVuZGVyZXIucnVsZXMueW91dHViZV9lbWJlZF9jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnPC9kaXY+XFxuJztcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHlvdXR1YmVFbWJlZFBsdWdpbjtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvbTBiL0luc3luYy9kYXJwZXJiYWxAZ21haWwuY29tL0dvb2dsZSBEcml2ZS9TaXRlcy9WaXRlL00wQk5vdGVzL2RvY3MvLnZpdGVwcmVzcy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tMGIvSW5zeW5jL2RhcnBlcmJhbEBnbWFpbC5jb20vR29vZ2xlIERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnMvbGluZU51bWJlcnMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbTBiL0luc3luYy9kYXJwZXJiYWxAZ21haWwuY29tL0dvb2dsZSUyMERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnMvbGluZU51bWJlcnMudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gJ21hcmtkb3duLWl0J1xuXG5leHBvcnQgY29uc3QgbGluZU51bWJlclBsdWdpbiA9IChtZDogTWFya2Rvd25JdCwgZW5hYmxlID0gZmFsc2UpID0+IHtcbiAgY29uc3QgZmVuY2UgPSBtZC5yZW5kZXJlci5ydWxlcy5mZW5jZSFcbiAgbWQucmVuZGVyZXIucnVsZXMuZmVuY2UgPSAoLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IHJhd0NvZGUgPSBmZW5jZSguLi5hcmdzKVxuXG4gICAgY29uc3QgW3Rva2VucywgaWR4XSA9IGFyZ3NcbiAgICBjb25zdCBpbmZvID0gdG9rZW5zW2lkeF0uaW5mb1xuXG4gICAgaWYgKFxuICAgICAgKCFlbmFibGUgJiYgIS86bGluZS1udW1iZXJzKCR8IHw9KS8udGVzdChpbmZvKSkgfHxcbiAgICAgIChlbmFibGUgJiYgLzpuby1saW5lLW51bWJlcnMoJHwgKS8udGVzdChpbmZvKSlcbiAgICApIHtcbiAgICAgIHJldHVybiByYXdDb2RlXG4gICAgfVxuXG4gICAgbGV0IHN0YXJ0TGluZU51bWJlciA9IDFcbiAgICBjb25zdCBtYXRjaFN0YXJ0TGluZU51bWJlciA9IGluZm8ubWF0Y2goLz0oXFxkKikvKVxuICAgIGlmIChtYXRjaFN0YXJ0TGluZU51bWJlciAmJiBtYXRjaFN0YXJ0TGluZU51bWJlclsxXSkge1xuICAgICAgc3RhcnRMaW5lTnVtYmVyID0gcGFyc2VJbnQobWF0Y2hTdGFydExpbmVOdW1iZXJbMV0pXG4gICAgfVxuXG4gICAgY29uc3QgY29kZSA9IHJhd0NvZGUuc2xpY2UoXG4gICAgICByYXdDb2RlLmluZGV4T2YoJzxjb2RlPicpLFxuICAgICAgcmF3Q29kZS5pbmRleE9mKCc8L2NvZGU+JylcbiAgICApXG5cbiAgICBjb25zdCBsaW5lcyA9IGNvZGUuc3BsaXQoJ1xcbicpXG5cbiAgICBjb25zdCBsaW5lTnVtYmVyc0NvZGUgPSBbLi4uQXJyYXkobGluZXMubGVuZ3RoKV1cbiAgICAgIC5tYXAoXG4gICAgICAgIChfLCBpbmRleCkgPT5cbiAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJsaW5lLW51bWJlclwiPiR7aW5kZXggKyBzdGFydExpbmVOdW1iZXJ9PC9zcGFuPjxicj5gXG4gICAgICApXG4gICAgICAuam9pbignJylcblxuICAgIGNvbnN0IGxpbmVOdW1iZXJzV3JhcHBlckNvZGUgPSBgPGRpdiBjbGFzcz1cImxpbmUtbnVtYmVycy13cmFwcGVyXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+JHtsaW5lTnVtYmVyc0NvZGV9PC9kaXY+YFxuXG4gICAgY29uc3QgZmluYWxDb2RlID0gcmF3Q29kZVxuICAgICAgLnJlcGxhY2UoLzxcXC9kaXY+JC8sIGAke2xpbmVOdW1iZXJzV3JhcHBlckNvZGV9PC9kaXY+YClcbiAgICAgIC5yZXBsYWNlKC9cIihsYW5ndWFnZS1bXlwiXSo/KVwiLywgJ1wiJDEgbGluZS1udW1iZXJzLW1vZGVcIicpXG4gICAgICAvL0Rpc2FibGUgd3JhcHBpbmcgd2hlbiB0cmlnZ2VyZWRcbiAgICAgIC5yZXBsYWNlKCc8cHJlJywgJzxwcmUgc3R5bGU9XCJ3aGl0ZS1zcGFjZTogcHJlO1wiJylcbiAgICAgIC5yZXBsYWNlKCc8Y29kZScsICc8Y29kZSBzdHlsZT1cIndoaXRlLXNwYWNlOiBwcmU7XCInKVxuXG4gICAgcmV0dXJuIGZpbmFsQ29kZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxpbmVOdW1iZXJQbHVnaW5cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvbTBiL0luc3luYy9kYXJwZXJiYWxAZ21haWwuY29tL0dvb2dsZSBEcml2ZS9TaXRlcy9WaXRlL00wQk5vdGVzL2RvY3MvLnZpdGVwcmVzcy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9tMGIvSW5zeW5jL2RhcnBlcmJhbEBnbWFpbC5jb20vR29vZ2xlIERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnMvaW5saW5lQ29kZVZQcmUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvbTBiL0luc3luYy9kYXJwZXJiYWxAZ21haWwuY29tL0dvb2dsZSUyMERyaXZlL1NpdGVzL1ZpdGUvTTBCTm90ZXMvZG9jcy8udml0ZXByZXNzL3BsdWdpbnMvaW5saW5lQ29kZVZQcmUudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gJ21hcmtkb3duLWl0J1xuXG4vKipcbiAqIFZpdGVQcmVzcyBtYXJrcyBmZW5jZWQgY29kZSBibG9ja3MgYHYtcHJlYCBidXQgbGVhdmVzIGlubGluZSBjb2RlIGFsb25lLCBzb1xuICogYSBzbmlwcGV0IHN1Y2ggYXMgYCR7ezwlWyUnXCJ9fSVgIGluIGEgU1NUSSBub3RlIHJlYWNoZXMgdGhlIFZ1ZSBjb21waWxlciBhc1xuICogYW4gaW50ZXJwb2xhdGlvbiBhbmQgYnJlYWtzIHRoZSBidWlsZC4gUmVuZGVyaW5nIGlubGluZSBjb2RlIHdpdGggYHYtcHJlYFxuICoga2VlcHMgdGhlIHBheWxvYWQgdmVyYmF0aW0uXG4gKi9cbmNvbnN0IGlubGluZUNvZGVWUHJlID0gKG1kOiBNYXJrZG93bkl0KSA9PiB7XG4gICAgbWQucmVuZGVyZXIucnVsZXMuY29kZV9pbmxpbmUgPSAodG9rZW5zLCBpZHgpID0+XG4gICAgICAgIGA8Y29kZSB2LXByZT4ke21kLnV0aWxzLmVzY2FwZUh0bWwodG9rZW5zW2lkeF0uY29udGVudCl9PC9jb2RlPmBcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5saW5lQ29kZVZQcmVcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMmEsU0FBUyxvQkFBdUM7QUFDM2QsU0FBUywwQkFBMEI7OztBQ0NuQyxJQUFNLFdBQVc7QUFFakIsSUFBTSxxQkFB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
