<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const CLICKS_NEEDED = 10
const RESET_DELAY   = 5000
const TARGET_URL    = 'https://youtu.be/dQw4w9WgXcQ?si=3-SKpSMGFYWdsQlA'

const route = useRoute()

let count     = 0
let resetTimer: ReturnType<typeof setTimeout> | null = null
let target:    Element | null = null

function onClick() {
  count++
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { count = 0 }, RESET_DELAY)
  if (count >= CLICKS_NEEDED) {
    count = 0
    window.open(TARGET_URL, '_blank', 'noopener,noreferrer')
  }
}

function attach() {
  detach()
  const isHome = route.path === '/' || route.path === '/en/' || route.path === '/shindo/'
  if (!isHome) return
  requestAnimationFrame(() => {
    target = document.querySelector('.VPHero .image-src')
    if (!target) return
    target.addEventListener('click', onClick)
    ;(target as HTMLElement).style.cursor = 'pointer'
  })
}

function detach() {
  if (target) { target.removeEventListener('click', onClick); target = null }
  if (resetTimer) { clearTimeout(resetTimer); resetTimer = null }
  count = 0
}

onMounted(attach)
watch(() => route.path, attach)
onUnmounted(detach)
</script>

<template><span aria-hidden="true" /></template>
