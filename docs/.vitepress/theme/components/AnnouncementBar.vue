<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const visible   = ref(false)
const STORAGE_KEY = 'rell-announcement-v1'

const isRu = computed(() => lang.value === 'ru-RU')

const text = computed(() =>
  isRu.value
    ? '🚧 Сайт в разработке · Rell Seas — скоро'
    : '🚧 Site under development · Rell Seas — coming soon'
)

function dismiss(): void {
  visible.value = false
  try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
}

onMounted(() => {
  try {
    if (!localStorage.getItem(STORAGE_KEY)) visible.value = true
  } catch {
    visible.value = true
  }
})
</script>

<template>
  <Transition name="bar">
    <div v-if="visible" class="announcement-bar" role="alert">
      <span class="bar-text">{{ text }}</span>
      <button
        class="bar-close"
        :aria-label="isRu ? 'Закрыть' : 'Dismiss'"
        @click="dismiss"
      >✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.announcement-bar {
  position:         sticky;
  top:              0;
  z-index:          31; /* above VitePress navbar (z-index: 30) */
  display:          flex;
  align-items:      center;
  justify-content:  center;
  gap:              12px;
  padding:          7px 16px;
  background:       rgba(13,13,13,0.85);
  border-bottom:    1px solid rgba(84,160,255,0.2);
  font-size:        13px;
  color:            var(--vp-c-text-2);
  backdrop-filter:  blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

html:not(.dark) .announcement-bar {
  background:   rgba(255,255,255,0.85);
  border-color: rgba(37,99,235,0.15);
}

.bar-text { flex: 1; text-align: center; }

.bar-close {
  background:    none;
  border:        none;
  cursor:        pointer;
  color:         var(--vp-c-text-3);
  font-size:     14px;
  line-height:   1;
  padding:       2px 6px;
  border-radius: 4px;
  transition:    color 0.2s, background 0.2s;
  flex-shrink:   0;
}
.bar-close:hover { color: var(--vp-c-text-1); background: rgba(255,255,255,0.08); }

.bar-enter-active,
.bar-leave-active {
  transition:  max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
  overflow:    hidden;
  max-height:  60px;
}
.bar-enter-from,
.bar-leave-to { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }
</style>
