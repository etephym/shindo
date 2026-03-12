<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const visible  = ref(false)
const idle     = ref(false)

const SIZE   = 48
const RADIUS = 20
const CIRCUM = 2 * Math.PI * RADIUS

let idleTimer: ReturnType<typeof setTimeout> | null = null
let rafId:     number | null = null
let total      = 0

function calcTotal() {
  const contentEl = document.querySelector('.vp-doc')
  if (contentEl) {
    const rect = contentEl.getBoundingClientRect()
    total = rect.top + window.scrollY + contentEl.scrollHeight - window.innerHeight
  } else {
    total = document.documentElement.scrollHeight - window.innerHeight
  }
}

function update() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const scrollY = window.scrollY

    if (total <= 0 || scrollY <= 0) {
      progress.value = 0
    } else if (scrollY >= total) {
      progress.value = 100
    } else {
      progress.value = Math.round((scrollY / total) * 100)
    }

    visible.value = scrollY > 100
    idle.value    = false

    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => { idle.value = true }, 3000)
  })
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  calcTotal()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', calcTotal)
  update()
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', calcTotal)
  if (idleTimer) clearTimeout(idleTimer)
  if (rafId)     cancelAnimationFrame(rafId)
})

const strokeOffset = (pct: number) => CIRCUM - (pct / 100) * CIRCUM
</script>

<template>
  <Transition name="progress-fade">
    <div
      v-if="visible"
      class="rp-wrap"
      :title="idle ? 'Наверх' : `${progress}% прочитано`"
      @click="scrollToTop"
    >
      <svg :width="SIZE" :height="SIZE" class="rp-ring">
        <circle
          :cx="SIZE / 2" :cy="SIZE / 2" :r="RADIUS"
          fill="none" stroke="rgba(84,160,255,0.12)" stroke-width="2.5"
        />
        <circle
          :cx="SIZE / 2" :cy="SIZE / 2" :r="RADIUS"
          fill="none" stroke="#54a0ff" stroke-width="2.5"
          stroke-linecap="round"
          :stroke-dasharray="CIRCUM"
          :stroke-dashoffset="strokeOffset(progress)"
          transform="rotate(-90, 24, 24)"
          class="rp-arc"
          :class="{ 'rp-arc--done': progress >= 100 }"
        />
      </svg>

      <Transition name="icon-swap" mode="out-in">
        <span v-if="!idle" key="pct" class="rp-label">{{ progress }}%</span>
        <span v-else key="arrow" class="rp-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </span>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
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
  background:      rgba(13, 13, 13, 0.85);
  border-radius:   50%;
  backdrop-filter: blur(8px);
  box-shadow:      0 0 12px rgba(84, 160, 255, 0.12);
  transition:      box-shadow 0.2s ease;
}

.rp-wrap:hover {
  box-shadow: 0 0 22px rgba(84, 160, 255, 0.35);
}

.rp-ring {
  position: absolute;
  top:      0;
  left:     0;
}

.rp-arc {
  transition: stroke-dashoffset 0.2s linear;
}

.rp-arc--done {
  transition: none;
}

.rp-label {
  font-size:   11px;
  font-weight: 600;
  color:       #54a0ff;
  line-height: 1;
  user-select: none;
}

.rp-arrow {
  display:     flex;
  align-items: center;
  color:       #54a0ff;
}

.icon-swap-enter-active,
.icon-swap-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.icon-swap-enter-from   { opacity: 0; transform: translateY(4px);  }
.icon-swap-leave-to     { opacity: 0; transform: translateY(-4px); }

.progress-fade-enter-active,
.progress-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.progress-fade-enter-from,
.progress-fade-leave-to     { opacity: 0; transform: translateY(8px); }
</style>
