// Node/server-side entry: cordis requires the imported module to be a plugin
// (function or object with an `apply` method). This plugin has no server-side
// behavior — all CSS injection happens in the browser half (./client), which
// the web harness loads as a classic <script>. Keep this file ESM-clean and
// keep ./client free of ESM syntax; the two entry points must not cross.
export function apply() {}
