<script setup lang="ts">
// Closes nav flyout menus when clicking the same trigger twice
import { onMounted, onUnmounted } from 'vue'

let lastTarget: Element | null = null

function handler(e: MouseEvent) {
  const btn = (e.target as Element).closest('.VPFlyout .button')
  if (!btn) { lastTarget = null; return }
  if (lastTarget === btn) {
    // Same button clicked twice — close by blurring
    ;(btn as HTMLElement).blur()
    const flyout = btn.closest('.VPFlyout')
    flyout?.classList.remove('active')
    lastTarget = null
  } else {
    lastTarget = btn
  }
}

onMounted(()  => document.addEventListener('click', handler))
onUnmounted(() => document.removeEventListener('click', handler))
</script>

<template><span /></template>
