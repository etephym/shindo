<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const WORDS_PER_MINUTE = 200

const wordCount = ref(0)
const readingTime = ref(0)
const route = useRoute()

let timer: ReturnType<typeof setTimeout> | null = null

function calculate() {
  if (timer) clearTimeout(timer)

  timer = setTimeout(() => {
    const el = document.querySelector('.vp-doc')
    if (!el) {
      wordCount.value = 0
      readingTime.value = 0
      return
    }

    const words = (el.textContent ?? '').trim().split(/\s+/).filter(Boolean).length
    wordCount.value = words
    readingTime.value = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
  }, 120)
}

onMounted(calculate)
watch(() => route.path, calculate)

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div v-if="wordCount > 0" class="reading-meta">
    <span class="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
      {{ wordCount }} words
    </span>

    <span class="sep">·</span>

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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  padding: 6px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.sep {
  opacity: 0.3;
}
</style>
