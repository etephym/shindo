<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { nextTick, onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vitepress'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Average adult reading speed in words per minute. */
const WORDS_PER_MINUTE = 200

// ---------------------------------------------------------------------------
// Reactive state
// ---------------------------------------------------------------------------

const wordCount   = ref(0)
const readingTime = ref(0)

// ---------------------------------------------------------------------------
// Route & locale
// ---------------------------------------------------------------------------

const route = useRoute()

const isEn       = computed(() => route.path.startsWith('/en/'))
const labelWords = computed(() => isEn.value ? 'words'    : 'слов')
const labelMin   = computed(() => isEn.value ? 'min read' : 'мин. чтения')

// ---------------------------------------------------------------------------
// Word count calculation
// ---------------------------------------------------------------------------

function calculate(): void {
  const el = document.querySelector('.vp-doc')
  if (!el) {
    wordCount.value   = 0
    readingTime.value = 0
    return
  }

  // Clone the element to strip UI-only nodes (copy buttons etc.) before counting
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.copy-heading-btn').forEach(b => b.remove())

  const words       = (clone.textContent ?? '').trim().split(/\s+/).filter(Boolean).length
  wordCount.value   = words
  readingTime.value = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

/** Waits for Vue + browser paint before measuring, so content is fully rendered. */
function scheduleCalculate(): void {
  nextTick(() => requestAnimationFrame(calculate))
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(scheduleCalculate)
watch(() => route.path, scheduleCalculate) // recalculate on SPA navigation
</script>

<template>
  <!-- Hidden when word count is zero (e.g. home page or empty doc) -->
  <div v-if="wordCount > 0" class="reading-meta">
    <!-- Word count with book icon -->
    <span class="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      {{ wordCount }} {{ labelWords }}
    </span>

    <span class="sep" aria-hidden="true">·</span>

    <!-- Reading time with clock icon -->
    <span class="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      {{ readingTime }} {{ labelMin }}
    </span>
  </div>
</template>

<style scoped>
/* ── Container ───────────────────────────────────────────────────────────── */
.reading-meta {
  display:       inline-flex;
  align-items:   center;
  gap:           8px;
  font-size:     13px;
  color:         var(--vp-c-text-2);
  margin-bottom: 20px;
  padding:       6px 14px;
  background:    var(--vp-c-bg-soft);
  border-radius: 8px;
  border:        1px solid var(--vp-c-divider);
}

/* ── Individual stat item (icon + text) ──────────────────────────────────── */
.meta-item { display: flex; align-items: center; gap: 5px; }

/* ── Dot separator ───────────────────────────────────────────────────────── */
.sep { opacity: 0.3; }
</style>
