typeof window !== "undefined" && window.__ModuleLoader__ && window.__ModuleLoader__.load({
  id: "dsh-chat-flow-re-layout",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const css = `
      @supports selector(:has(*)) {
        /* 1. Flow column -> wrapping ROW.
         *    overflow-anchor: none disables the browser's native scroll
         *    anchoring inside the flow: with the assistant-step boxes lifted
         *    via display: contents, the anchoring candidate selection goes
         *    stale and fights the view's own bottom-following, which shows up
         *    as vertical jitter when a tool card appears mid-turn. */
        [data-chat-flow] {
          flex-direction: row;
          flex-wrap: wrap;
          overflow-anchor: none;
        }

        [data-chat-flow] > [data-chat-flow-kind] {
          flex: 1 1 100%;
        }

        /* 1b. The running turn-status strip ("Deep diving...") always takes
         *    its own full line at the end of the flow: flex: 1 1 100% makes
         *    the line-break decision use the FULL column width (never joins a
         *    chip row). No max-width clamp here - a max-width: max-content
         *    would shrink the hypothetical main size and defeat the wrap.
         *    Visually the strip still renders content-sized because its
         *    shimmer uses background-clip: text. Identified via its stable
         *    role="status" attribute - no hashed classes involved. */
        [data-chat-flow] > [role="status"] {
          flex: 1 1 100%;
          min-width: 0;
        }

        /* 2. Settled tool call -> chip. */
        [data-chat-flow] > [data-chat-flow-kind="tool-call"] {
          flex: 0 0 auto;
          max-width: min(340px, 100%);
        }

        /* 3. Full-width exceptions for tool calls: still running, own
         *    disclosure row expanded, Cordis cards. */
        [data-chat-flow] > [data-chat-flow-kind="tool-call"]:has(
          [data-state="running"],
          [data-disclosure-row][aria-expanded="true"],
          [data-sample][aria-expanded="true"],
          [data-tool^="cordis_"]
        ) {
          flex: 1 1 100%;
          max-width: none;
        }

        /* 4. Context chips: title only, expanded returns full width. */
        [data-chat-flow] > [data-chat-flow-kind="context"] {
          flex: 0 0 auto;
          max-width: min(340px, 100%);
        }
        [data-chat-flow] > [data-chat-flow-kind="context"]:has([data-disclosure-row][aria-expanded="true"]) {
          flex: 1 1 100%;
          max-width: none;
        }
        [data-chat-flow] > [data-chat-flow-kind="context"] [data-context-source],
        [data-chat-flow] > [data-chat-flow-kind="context"] [data-context-summary],
        [data-chat-flow] > [data-chat-flow-kind="context"] [class$="_sep"] {
          display: none;
        }

        /* 5. Tool chips show only the tool name: hide summary/separator/
         *    file-link/suffix on every tool row, then restore the original
         *    text on running cards and Cordis cards. */
        [data-chat-flow] > [data-chat-flow-kind="tool-call"] [class$="_summary"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"] [class$="_errorSummary"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"] [class$="_sep"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"] [class$="_fileLink"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"] [class$="_summarySuffix"] {
          display: none;
        }
        [data-chat-flow] > [data-chat-flow-kind="tool-call"]:has([data-state="running"], [data-tool^="cordis_"]) [class$="_summary"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"]:has([data-state="running"], [data-tool^="cordis_"]) [class$="_errorSummary"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"]:has([data-state="running"], [data-tool^="cordis_"]) [class$="_sep"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"]:has([data-state="running"], [data-tool^="cordis_"]) [class$="_fileLink"],
        [data-chat-flow] > [data-chat-flow-kind="tool-call"]:has([data-state="running"], [data-tool^="cordis_"]) [class$="_summarySuffix"] {
          display: revert;
        }

        /* 6. Lift ALL assistant-step boxes into the flow: the node row itself,
         *    then its three wrapper divs (wrapper > markdown-root > body). */
        [data-chat-flow] > [data-chat-flow-kind="assistant-step"],
        [data-chat-flow] > [data-chat-flow-kind="assistant-step"] > div,
        [data-chat-flow] > [data-chat-flow-kind="assistant-step"] > div > div,
        [data-chat-flow] > [data-chat-flow-kind="assistant-step"] > div > div > div {
          display: contents;
        }

        /* 7. Reasoning rows pile as compact chips with tool chips, both when
         *    finished AND while streaming. Streaming and expanded disclosures
         *    return to full width - min-width: 0 is REQUIRED there: the live
         *    one-line preview is white-space:nowrap, and without it the
         *    full-width row overflows the right edge of the screen. */
        div:has(> [data-variant="think"]) > [data-variant="think"] {
          flex: 0 0 auto;
          max-width: min(360px, 100%);
        }
        div:has(> [data-variant="think"]) > [data-variant="think"][data-state="running"],
        div:has(> [data-variant="think"]) > [data-variant="think"]:has([data-disclosure-row][aria-expanded="true"]) {
          flex: 1 1 100%;
          max-width: none;
          min-width: 0;
        }

        /* 8. Assistant text, images and the interrupted marker keep full
         *    width. The exact DOM path is NOT redundant: it also covers
         *    text-only steps, whose body has no think rows and therefore does
         *    not match the structural selector. */
        [data-chat-flow] > [data-chat-flow-kind="assistant-step"] > div > div > div > :not([data-variant="think"]),
        div:has(> [data-variant="think"]) > :not([data-variant="think"]) {
          flex: 1 1 100%;
          min-width: 0;
        }

        /* 9. Finished Think chips show only "Think". The streaming (last)
         *    reasoning keeps its live one-line preview while running. */
        [data-chat-flow] [data-variant="think"]:not([data-state="running"]) [class$="_summary"],
        [data-chat-flow] [data-variant="think"]:not([data-state="running"]) [class$="_separator"] {
          display: none;
        }
      }
    `;

    const tagId = "dsh-chat-flow-re-layout/styles.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=\"" + tagId + "\"]") === null) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-chat-flow-re-layout";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }

    const apply = (ctx) => {};
    exports.apply = apply;
    return module.exports;
  },
});
