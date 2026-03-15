<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CLICKS_NEEDED = 7     // clicks on the hero image required to trigger
const RESET_DELAY   = 10000 // ms — counter resets after this idle period
const TARGET_URL    = 'https://youtu.be/dQw4w9WgXcQ?si=3-SKpSMGFYWdsQlA'

// ---------------------------------------------------------------------------
// Route & site
// ---------------------------------------------------------------------------

const route    = useRoute()
const { site } = useData()

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let count      = 0
let resetTimer: ReturnType<typeof setTimeout> | null = null
let active     = false

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the current page is a home page.
 * route.path includes the base prefix (e.g. '/shindo/' or '/shindo/en/'),
 * so we compare against base and base + 'en/' explicitly.
 */
function checkIsHome(): boolean {
  const base = site.value.base // '/shindo/'
  return route.path === base || route.path === `${base}en/`
}

// ---------------------------------------------------------------------------
// Document-level click handler (event delegation)
// ---------------------------------------------------------------------------

function onDocumentClick(e: MouseEvent): void {
  if (!active) return
  if (!(e.target as Element).closest('.VPHero')) return

  count++
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { count = 0 }, RESET_DELAY)

  if (count >= CLICKS_NEEDED) {
    count = 0
    window.open(TARGET_URL, '_blank', 'noopener,noreferrer')
  }
}

// ---------------------------------------------------------------------------
// Activate / deactivate based on current route
// ---------------------------------------------------------------------------

function activate(): void {
  active = checkIsHome()
  if (!active) {
    count = 0
    if (resetTimer) { clearTimeout(resetTimer); resetTimer = null }
  }
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(() => {
  activate()
  document.addEventListener('click', onDocumentClick)
})

watch(() => route.path, activate)

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template><span aria-hidden="true" /></template>
