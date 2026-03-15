<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CLICKS_NEEDED = 7     // number of clicks required to trigger the redirect
const RESET_DELAY   = 10000 // ms — click counter resets after this idle period
const TARGET_URL    = 'https://youtu.be/dQw4w9WgXcQ?si=3-SKpSMGFYWdsQlA'
const MAX_RETRIES   = 20    // max rAF retries while waiting for VPHero to render
const RETRY_DELAY   = 50    // ms between retries via setTimeout fallback

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

const route = useRoute()

// ---------------------------------------------------------------------------
// State — plain vars; no reactivity needed
// ---------------------------------------------------------------------------

let count      = 0
let resetTimer: ReturnType<typeof setTimeout>  | null = null
let retryTimer: ReturnType<typeof setTimeout>  | null = null
let target:    Element | null = null

// ---------------------------------------------------------------------------
// Click handler — counts clicks and redirects after CLICKS_NEEDED
// ---------------------------------------------------------------------------

function onClick(): void {
  count++
  // Reset the counter if the user stops clicking for RESET_DELAY ms
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { count = 0 }, RESET_DELAY)

  if (count >= CLICKS_NEEDED) {
    count = 0
    window.open(TARGET_URL, '_blank', 'noopener,noreferrer')
  }
}

// ---------------------------------------------------------------------------
// Attach / detach — only active on home pages
// ---------------------------------------------------------------------------

/**
 * Tries to find .VPHero .image-src and attach the click listener.
 * Retries up to MAX_RETRIES times with RETRY_DELAY ms gaps because
 * layout-bottom mounts before VPHero finishes rendering its image.
 */
function tryAttach(retriesLeft: number): void {
  const el = document.querySelector('.VPHero .image-src')
  if (el) {
    target = el
    target.addEventListener('click', onClick)
    ;(target as HTMLElement).style.cursor = 'pointer'
    return
  }
  if (retriesLeft <= 0) return
  retryTimer = setTimeout(() => tryAttach(retriesLeft - 1), RETRY_DELAY)
}

function attach(): void {
  detach() // always clean up before re-attaching
  const isHome = route.path === '/' || route.path === '/en/'
  if (!isHome) return
  tryAttach(MAX_RETRIES)
}

function detach(): void {
  // Cancel any pending retry
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }
  // Remove listener from the previously found target
  if (target) { target.removeEventListener('click', onClick); target = null }
  // Cancel click counter reset timer
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null }
  count = 0
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(attach)
watch(() => route.path, attach) // re-attach when navigating between pages
onUnmounted(detach)
</script>

<!-- Render nothing visible — this component only adds a DOM event listener -->
<template><span aria-hidden="true" /></template>
