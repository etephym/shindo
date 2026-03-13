<script setup lang="ts">
import { ref } from 'vue'

const VIDEO_ID = 'Rv0QsmjIQ_U'

const playing = ref(false)
const visible = ref(false)

function toggle() {
  if (!visible.value) {
    visible.value = true
    setTimeout(() => { playing.value = true }, 100)
  } else {
    playing.value = !playing.value
  }
}

const src = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&rel=0`
</script>

<template>
  <div class="mp-wrap">
    <iframe
      v-if="visible && playing"
      :src="src"
      allow="autoplay"
      style="display:none"
    />

    <div class="mp-widget" :class="{ playing }">
      <button class="mp-btn" @click="toggle" :title="playing ? 'Пауза' : 'Играть'">
        <span v-if="playing" class="mp-bars">
          <span /><span /><span /><span />
        </span>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </button>

      <div class="mp-info">
        <span class="mp-title">Synthwave Mix</span>
        <span class="mp-sub">{{ playing ? 'Играет...' : 'Фоновая музыка' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mp-wrap {
  position: fixed;
  bottom:   80px;
  left:     24px;
  z-index:  99;
}

/* --- Dark theme (default) --- */
.mp-widget {
  display:                 flex;
  align-items:             center;
  gap:                     10px;
  padding:                 10px 16px 10px 10px;
  border-radius:           16px;
  border:                  1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter:         blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background:              rgba(13, 13, 13, 0.75);
  box-shadow:              0 4px 24px rgba(0, 0, 0, 0.35);
  transition:              box-shadow 0.3s ease, border-color 0.3s ease;
  user-select:             none;
}

.mp-widget.playing {
  border-color: rgba(84, 160, 255, 0.3);
  box-shadow:   0 4px 24px rgba(84, 160, 255, 0.15);
}

.mp-btn {
  display:         flex;
  align-items:     center;
  justify-content: center;
  width:           36px;
  height:          36px;
  border-radius:   50%;
  border:          none;
  background:      rgba(84, 160, 255, 0.15);
  color:           #54a0ff;
  cursor:          pointer;
  flex-shrink:     0;
  transition:      background 0.2s ease, transform 0.15s ease;
}

.mp-btn:hover  { background: rgba(84, 160, 255, 0.28); transform: scale(1.08); }
.mp-btn:active { transform: scale(0.95); }

.mp-title { font-size: 13px; font-weight: 600; color: var(--vp-c-text-1); line-height: 1.3; }
.mp-sub   { font-size: 11px; color: var(--vp-c-text-3); }

/* --- Light theme --- */
:root:not(.dark) .mp-widget {
  background:   rgba(255, 255, 255, 0.75);
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow:   0 4px 24px rgba(0, 0, 0, 0.08);
}

:root:not(.dark) .mp-widget.playing {
  border-color: rgba(37, 99, 235, 0.25);
  box-shadow:   0 4px 24px rgba(37, 99, 235, 0.12);
}

:root:not(.dark) .mp-btn {
  background: rgba(37, 99, 235, 0.1);
  color:      #2563eb;
}

:root:not(.dark) .mp-btn:hover {
  background: rgba(37, 99, 235, 0.2);
}

/* --- Animated bars --- */
.mp-bars {
  display:     flex;
  align-items: flex-end;
  gap:         2px;
  height:      14px;
}

.mp-bars span {
  display:       block;
  width:         3px;
  border-radius: 2px;
  background:    #54a0ff;
  animation:     bar-bounce 0.9s ease-in-out infinite;
}

:root:not(.dark) .mp-bars span { background: #2563eb; }

.mp-bars span:nth-child(1) { height: 6px;  animation-delay: 0s;    }
.mp-bars span:nth-child(2) { height: 12px; animation-delay: 0.15s; }
.mp-bars span:nth-child(3) { height: 8px;  animation-delay: 0.3s;  }
.mp-bars span:nth-child(4) { height: 10px; animation-delay: 0.1s;  }

@keyframes bar-bounce {
  0%, 100% { transform: scaleY(0.4); }
  50%       { transform: scaleY(1);   }
}

.mp-info { display: flex; flex-direction: column; gap: 1px; }
</style>
