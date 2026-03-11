<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const wordCount = ref(0)
const readingTime = ref(0)
const route = useRoute()

function calculate() {
  setTimeout(() => {
    const el = document.querySelector('.vp-doc')
    if (!el) return
    const text = el.innerText || ''
    const words = text.trim().split(/\s+/).filter(Boolean).length
    wordCount.value = words
    readingTime.value = Math.ceil(words / 200)
  }, 100)
}

onMounted(calculate)
watch(() => route.path, calculate)
</script>

<template>
  <div class="reading-meta" v-if="wordCount > 0">
    <span>📖 {{ wordCount }} слов</span>
    <span class="sep">·</span>
    <span>⏱ {{ readingTime }} мин чтения</span>
  </div>
</template>

<style scoped>
.reading-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 24px;
  padding: 8px 14px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  width: fit-content;
}
.sep { opacity: 0.4; }
</style>
