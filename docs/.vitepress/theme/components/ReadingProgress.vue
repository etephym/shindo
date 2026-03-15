<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vitepress'

// ---------------------------------------------------------------------------
// SVG ring constants — fixed values derived from the component size
// ---------------------------------------------------------------------------

const SIZE   = 48                   // width & height of the SVG in px
const RADIUS = 20                   // circle radius in px
const CIRCUM = 2 * Math.PI * RADIUS // full circumference used for stroke-dasharray

// ---------------------------------------------------------------------------
// Reactive state
// ---------------------------------------------------------------------------

const progress = ref(0)   // 0–100 scroll percentage
const visible  = ref(false) // whether the button is shown
const idle     = ref(false) // true after 3 s of no scrolling → shows arrow icon

// ---------------------------------------------------------------------------
// Route & locale
// ---------------------------------------------------------------------------

const route = useRoute()
const isEn  = computed(() => route.path.includes('/en/'))

/** Tooltip / aria-label text — switches between percentage and "back to top". */
const titleLabel = computed(() =>
  idle.value
    ? (isEn.value ? 'Back to top' : 'Наверх')
    : `${progress.value}% ${isEn.value ? 'read' : 'прочитано'}`
)

// ---------------------------------------------------------------------------
// Scroll tracking state — plain vars (no reactivity overhead needed)
// ---------------------------------------------------------------------------

let idleTimer: ReturnType<typeof setTimeout> | null = null
let total      = 0  // scrollable distance in px
let lastScroll = -1 // previous scrollY value; -1 forces a recalculation

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recalculates the total scrollable distance of the current page. */
function calcTotal(): void {
  const docEl = document.querySelector('.vp-doc')
  total = docEl
    // Accurate formula that accounts for sticky header offset
    ? docEl.scrollHeight - window.innerHeight + docEl.getBoundingClientRect().top + window.scrollY
    : document.documentElement.scrollHeight - window.innerHeight
  lastScroll = -1 // force update on next scroll event
}

/** Called on every scroll event; updates progress and visibility. */
function update(): void {
  const scrollY = window.scrollY
  if (scrollY === lastScroll) return // skip if position hasn't changed
  lastScroll = scrollY

  // Calculate percentage, clamped to [0, 100]
  if      (total <= 0)      progress.value = 0
  else if (scrollY <= 0)    progress.value = 0
  else if (scrollY >= total) progress.value = 100
  else                       progress.value = Math.round((scrollY / total) * 100)

  visible.value = scrollY > 100 // hide near the top of the page
  idle.value    = false          // reset idle on any scroll

  // Switch to arrow icon after 3 s of inactivity
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { idle.value = true }, 3000)
}

/** Recalculates on viewport resize (e.g. rotating phone, opening DevTools). */
function onResize(): void { calcTotal(); update() }

/** Smooth-scrolls back to the top of the page. */
function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ---------------------------------------------------------------------------
// SVG helper — computes the stroke-dashoffset for a given percentage
// ---------------------------------------------------------------------------

const strokeOffset = (pct: number) => CIRCUM - (pct / 100) * CIRCUM

// ---------------------------------------------------------------------------
// Lifecycle — reset state on route change and register scroll/resize listeners
// ---------------------------------------------------------------------------

watch(() => route.path, () => {
  progress.value = 0
  visible.value  = false
  idle.value     = false
  lastScroll     = -1
  if (idleTimer) { clearTimeout(idleTimer); idleTimer = null }
  // Wait for the new page's DOM to settle before measuring
  requestAnimationFrame(() => { calcTotal(); update() })
})

onMounted(() => {
  calcTotal()
  update()
  window.addEventListener('scroll', update,   { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', onResize)
  if (idleTimer) clearTimeout(idleTimer)
})
</script>

<template>
  <Transition name="progress-fade">
    <div
      v-if="visible"
      class="rp-wrap"
      :title="titleLabel"
      :aria-label="titleLabel"
      role="button"
      tabindex="0"
      @click="scrollToTop"
      @keydown.enter.prevent="scrollToTop"
      @keydown.space.prevent="scrollToTop"
    >
      <!-- SVG progress ring -->
      <svg :width="SIZE" :height="SIZE" class="rp-ring" aria-hidden="true">
        <!-- Track circle (background) -->
        <circle
          :cx="SIZE / 2" :cy="SIZE / 2" :r="RADIUS"
          fill="none" stroke="rgba(84,160,255,0.12)" stroke-width="2.5"
        />
        <!-- Progress arc -->
        <circle
          :cx="SIZE / 2" :cy="SIZE / 2" :r="RADIUS"
          fill="none" stroke="#54a0ff" stroke-width="2.5"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUM"
          :stroke-dashoffset="strokeOffset(progress)"
          :transform="`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`"
          class="rp-arc"
        />
      </svg>

      <!-- Centre content: percentage or back-to-top arrow -->
      <Transition name="icon-swap" mode="out-in">
        <span v-if="!idle" key="pct" class="rp-label">{{ progress }}%</span>
        <span v-else key="arrow" class="rp-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </span>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* ── Circular button wrapper ─────────────────────────────────────────────── */
.rp-wrap {
  position:        fixed;
  bottom:          28px;
  right:           28px;
  z-index:         100;
  width:           48px;
  height:          48px;
  display:         flex;
  align-items:     center;
  justify-content: center;
  cursor:          pointer;
  user-select:     none;
  background:      rgba(13,13,13,0.85);
  border-radius:   50%;
  box-shadow:      0 0 12px rgba(84,160,255,0.12);
  transition:      box-shadow 0.2s ease;
}

/* ── Light mode overrides ────────────────────────────────────────────────── */
html:not(.dark) .rp-wrap       { background: rgba(255,255,255,0.95); box-shadow: 0 0 12px rgba(0,0,0,0.08); }
.rp-wrap:hover                  { box-shadow: 0 0 22px rgba(84,160,255,0.35); }
html:not(.dark) .rp-wrap:hover  { box-shadow: 0 0 22px rgba(37,99,235,0.25); }

/* ── SVG ring ────────────────────────────────────────────────────────────── */
.rp-ring { position: absolute; inset: 0; overflow: visible; }
.rp-arc  { transition: stroke-dashoffset 0.2s ease; } /* smooth arc animation */

/* ── Percentage label ────────────────────────────────────────────────────── */
.rp-label                   { font-size: 11px; font-weight: 600; color: #54a0ff; line-height: 1; }
html:not(.dark) .rp-label   { color: #2563eb; }

/* ── Arrow icon ──────────────────────────────────────────────────────────── */
.rp-arrow                   { display: flex; align-items: center; color: #54a0ff; }
html:not(.dark) .rp-arrow   { color: #2563eb; }

/* ── Percentage ↔ arrow swap transition ──────────────────────────────────── */
.icon-swap-enter-active,
.icon-swap-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.icon-swap-enter-from   { opacity: 0; transform: translateY(4px);  }
.icon-swap-leave-to     { opacity: 0; transform: translateY(-4px); }

/* ── Button appear / disappear transition ────────────────────────────────── */
.progress-fade-enter-active,
.progress-fade-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.progress-fade-enter-from,
.progress-fade-leave-to     { opacity: 0; transform: translateY(6px); }
</style>
