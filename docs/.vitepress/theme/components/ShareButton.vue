<script setup lang="ts">
// Share button shown at the bottom of every doc page
// Copies current page URL to clipboard and shows a tooltip
import { ref } from 'vue'

const copied = ref(false)

function share() {
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="share-wrap">
    <button class="share-btn" @click="share">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6"  cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
      </svg>
      <span>{{ copied ? 'Скопировано!' : 'Поделиться' }}</span>
    </button>
  </div>
</template>

<style scoped>
.share-wrap {
  margin-top:  32px;
  padding-top: 20px;
  border-top:  1px solid rgba(255, 255, 255, 0.06);
}

.share-btn {
  display:       inline-flex;
  align-items:   center;
  gap:           7px;
  padding:       7px 16px;
  font-size:     13px;
  font-weight:   500;
  color:         #54a0ff;
  background:    rgba(84, 160, 255, 0.08);
  border:        1px solid rgba(84, 160, 255, 0.2);
  border-radius: 8px;
  cursor:        pointer;
  transition:    background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.share-btn:hover {
  background:   rgba(84, 160, 255, 0.15);
  border-color: rgba(84, 160, 255, 0.45);
  box-shadow:   0 0 12px rgba(84, 160, 255, 0.15);
}
</style>
