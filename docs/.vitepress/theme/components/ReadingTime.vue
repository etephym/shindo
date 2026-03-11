<script setup>
// Calculates and displays word count + estimated reading time
// Shown at the top of every doc page
// Reading speed: 200 words per minute

import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const wordCount   = ref(0)
const readingTime = ref(0)
const route       = useRoute()

function calculate() {
  setTimeout(() => {
    const el = document.querySelector('.vp-doc')
    if (!el) return
    const words   = (el.innerText || '').trim().split(/\s+/).filter(Boolean).length
    wordCount.value   = words
    readingTime.value = Math.ceil(words / 200)
  }, 150)
}

onMounted(calculate)
watch(() => route.path, calculate)
</script>

<template>
  <div class="reading-meta" v-if="wordCount > 0">

    <!-- Word count -->
    <span class="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      {{ wordCount }} words
    </span>

    <span class="sep">·</span>

    <!-- Reading time -->
    <span class="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      {{ readingTime }} min read
    </span>

  </div>
</template>

<style scoped>
.reading-meta {
  display:      inline-flex;
  align-items:  center;
  gap:          8px;
  font-size:    13px;
  color:        var(--vp-c-text-2);
  margin-bottom: 20px;
  padding:      6px 14px;
  background:   var(--vp-c-bg-soft);
  border-radius: 8px;
  border:       1px solid var(--vp-c-divider);
}
.meta-item {
  display:     flex;
  align-items: center;
  gap:         5px;
}
.sep { opacity: 0.3; }
</style>
