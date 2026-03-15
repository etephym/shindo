<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { useData } from 'vitepress'

// ---------------------------------------------------------------------------
// Page data — used to hide the block on non-doc pages (e.g. home, 404)
// ---------------------------------------------------------------------------

const { page } = useData()
</script>

<template>
  <!-- Only rendered on actual doc pages that have a source file path -->
  <div v-if="page.filePath" class="copyright-block">
    <div class="copyright-inner">
      <span>
        <a href="https://github.com/etephym/shindo">Shindo Life Docs</a>
        © 2024–2026 by
        <a href="https://github.com/ezrqq">ezrqq / lewisky</a>
        is licensed under
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>
        <!-- CC license icons -->
        <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" />
        <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" />
        <img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC" />
        <img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="SA" />
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── Outer wrapper — sits below the doc content with a divider ───────────── */
.copyright-block {
  margin-top:  48px;
  padding-top: 20px;
  border-top:  1px solid var(--vp-c-divider);
}

/* ── Inner text ──────────────────────────────────────────────────────────── */
.copyright-inner {
  font-size:   13px;
  color:       var(--vp-c-text-2);
  line-height: 1.6;
}

/* ── Links ───────────────────────────────────────────────────────────────── */
.copyright-inner a {
  color:                 var(--vp-c-text-2);
  text-decoration:       underline;
  text-underline-offset: 2px;
}
.copyright-inner a:hover { color: var(--vp-c-brand); }

/* ── CC icons — displayed inline next to the license name ───────────────── */
.copyright-inner img {
  display:        inline-block;
  max-width:      1em;
  max-height:     1em;
  margin-left:    0.2em;
  vertical-align: middle;
  opacity:        0.7;
}
</style>
