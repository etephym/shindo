<template>
  <div
    ref="widget"
    class="music-player"
    :class="{ dragging: isDragging }"
    :style="widgetStyle"
    @pointerdown="startDrag"
  >
    <button
      type="button"
      class="toggle"
      :disabled="isPlayerLoading"
      @pointerdown.stop
      @click="togglePlay"
    >
      {{ isPlaying ? '⏸ Пауза' : '▶️ Play' }}
    </button>

    <button type="button" class="settings-toggle" @pointerdown.stop @click="isPanelOpen = !isPanelOpen">
      {{ isPanelOpen ? '▾' : '▸' }}
    </button>

    <div v-if="isPanelOpen" class="panel" @pointerdown.stop>
      <label>
        Начало: {{ Math.floor(startAt) }}s
        <input
          type="range"
          min="0"
          :max="Math.max(1, Math.floor(videoDuration))"
          step="1"
          :value="startAt"
          @input="onStartInput"
        >
      </label>

      <label>
        Конец: {{ Math.floor(endAt) }}s
        <input
          type="range"
          min="1"
          :max="Math.max(1, Math.floor(videoDuration))"
          step="1"
          :value="endAt"
          @input="onEndInput"
        >
      </label>

      <button type="button" class="apply" @click="applySegment">Применить отрезок</button>
    </div>

    <div id="youtube-player-anchor" class="youtube-anchor" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const VIDEO_ID = 'Rv0QsmjIQ_U'
const DEFAULT_END = 210

const widget = ref(null)
const isPlaying = ref(false)
const isPlayerLoading = ref(true)
const isPanelOpen = ref(false)
const videoDuration = ref(DEFAULT_END)
const startAt = ref(0)
const endAt = ref(DEFAULT_END)

const posX = ref(24)
const posY = ref(120)
const isDragging = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

let player = null
let intervalId = null
let pointerId = null
let onResize = null

const widgetStyle = computed(() => ({
  transform: `translate3d(${posX.value}px, ${posY.value}px, 0)`
}))

function clampPos(x, y) {
  const width = widget.value?.offsetWidth ?? 280
  const height = widget.value?.offsetHeight ?? 80
  const maxX = Math.max(8, window.innerWidth - width - 8)
  const maxY = Math.max(8, window.innerHeight - height - 8)

  posX.value = Math.min(Math.max(8, x), maxX)
  posY.value = Math.min(Math.max(8, y), maxY)
}

function startDrag(event) {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return
  }

  const bounds = widget.value?.getBoundingClientRect()
  if (!bounds) {
    return
  }

  isDragging.value = true
  pointerId = event.pointerId
  dragOffsetX.value = event.clientX - bounds.left
  dragOffsetY.value = event.clientY - bounds.top

  widget.value?.setPointerCapture(pointerId)
}

function onDrag(event) {
  if (!isDragging.value || pointerId !== event.pointerId) {
    return
  }

  clampPos(event.clientX - dragOffsetX.value, event.clientY - dragOffsetY.value)
}

function stopDrag(event) {
  if (pointerId !== event.pointerId) {
    return
  }

  isDragging.value = false
  widget.value?.releasePointerCapture(pointerId)
  pointerId = null
}

function onStartInput(event) {
  const value = Number(event.target.value)
  startAt.value = Math.min(value, endAt.value - 1)
}

function onEndInput(event) {
  const value = Number(event.target.value)
  endAt.value = Math.max(value, startAt.value + 1)
}

function applySegment() {
  if (!player) return
  player.seekTo(startAt.value, true)
  if (!isPlaying.value) {
    player.pauseVideo()
  }
}

function togglePlay() {
  if (!player) return

  if (isPlaying.value) {
    player.pauseVideo()
    return
  }

  const currentTime = player.getCurrentTime()
  if (currentTime < startAt.value || currentTime >= endAt.value) {
    player.seekTo(startAt.value, true)
  }
  player.playVideo()
}

function monitorSegment() {
  if (!player) return
  const currentTime = player.getCurrentTime()
  if (Number.isFinite(currentTime) && currentTime >= endAt.value) {
    player.pauseVideo()
    player.seekTo(startAt.value, true)
    isPlaying.value = false
  }
}

function setupPlayer() {
  if (window.YT?.Player) {
    createPlayer()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(script)

  window.onYouTubeIframeAPIReady = createPlayer
}

function createPlayer() {
  if (!window.YT?.Player || player) {
    return
  }

  player = new window.YT.Player('youtube-player-anchor', {
    width: '0',
    height: '0',
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        isPlayerLoading.value = false
        const duration = player.getDuration()
        if (Number.isFinite(duration) && duration > 1) {
          videoDuration.value = Math.floor(duration)
          endAt.value = Math.floor(duration)
        }
      },
      onStateChange: (event) => {
        isPlaying.value = event.data === window.YT.PlayerState.PLAYING
      }
    }
  })

  intervalId = window.setInterval(monitorSegment, 120)
}

onMounted(() => {
  setupPlayer()

  window.addEventListener('pointermove', onDrag, { passive: true })
  window.addEventListener('pointerup', stopDrag)
  onResize = () => clampPos(posX.value, posY.value)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', stopDrag)
  if (onResize) {
    window.removeEventListener('resize', onResize)
  }
  if (intervalId) {
    window.clearInterval(intervalId)
  }
  if (player?.destroy) {
    player.destroy()
  }
})
</script>

<style scoped>
.music-player {
  position: fixed;
  z-index: 60;
  top: 0;
  left: 0;
  min-width: 220px;
  max-width: min(90vw, 320px);
  padding: 10px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 92%, #000 8%);
  box-shadow: 0 10px 28px rgb(0 0 0 / 0.24);
  touch-action: none;
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  will-change: transform;
}

.music-player.dragging {
  cursor: grabbing;
}

.toggle,
.settings-toggle,
.apply {
  border: 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.toggle {
  flex: 1;
  min-height: 40px;
  color: #fff;
  background: var(--vp-c-brand-1);
}

.toggle:disabled {
  opacity: 0.7;
  cursor: wait;
}

.settings-toggle {
  width: 38px;
  min-height: 40px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.panel {
  display: grid;
  gap: 10px;
  width: 100%;
  margin-top: 2px;
}

label {
  font-size: 12px;
  color: var(--vp-c-text-1);
}

input[type='range'] {
  width: 100%;
}

.apply {
  min-height: 36px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.youtube-anchor {
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
