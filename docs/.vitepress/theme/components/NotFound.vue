<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useData, useRouter } from 'vitepress'

const { site, lang } = useData()
const router = useRouter()

const isRu = computed(() => lang.value === 'ru-RU')
const homeLink = computed(() => site.value.base)

function goHome(): void {
  router.go(homeLink.value)
}

// ---------------------------------------------------------------------------
// Rain canvas
// ---------------------------------------------------------------------------

let canvas:  HTMLCanvasElement | null = null
let ctx:     CanvasRenderingContext2D | null = null
let rafId:   number | null = null

interface Drop {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
}

let drops: Drop[] = []

function initDrops(w: number, h: number): void {
  drops = []
  const count = Math.floor((w * h) / 8000)
  for (let i = 0; i < count; i++) {
    drops.push({
      x:       Math.random() * (w + h * 0.5) - h * 0.5,
      y:       Math.random() * h,
      speed:   3 + Math.random() * 4,
      length:  40 + Math.random() * 80,
      opacity: 0.04 + Math.random() * 0.1,
    })
  }
}

function drawRain(): void {
  if (!ctx || !canvas) return
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  for (const d of drops) {
    ctx.save()
    ctx.strokeStyle = `rgba(84,160,255,${d.opacity})`
    ctx.lineWidth   = 1
    ctx.lineCap     = 'round'
    ctx.beginPath()
    // 20° angle slant
    const angle = 20 * Math.PI / 180
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(d.x + Math.sin(angle) * d.length, d.y + Math.cos(angle) * d.length)
    ctx.stroke()
    ctx.restore()

    d.x += Math.sin(20 * Math.PI / 180) * d.speed
    d.y += Math.cos(20 * Math.PI / 180) * d.speed

    // Reset when off screen
    if (d.y > h + d.length) {
      d.y = -d.length
      d.x = Math.random() * (w + h * 0.5) - h * 0.5
    }
  }

  rafId = requestAnimationFrame(drawRain)
}

function setupCanvas(): void {
  canvas = document.getElementById('rain-canvas') as HTMLCanvasElement
  if (!canvas) return
  ctx    = canvas.getContext('2d')
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width  = w
  canvas.height = h
  initDrops(w, h)
  rafId = requestAnimationFrame(drawRain)
}

function onResize(): void {
  if (!canvas) return
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width  = w
  canvas.height = h
  initDrops(w, h)
}

onMounted(() => {
  setupCanvas()
  window.addEventListener('resize', onResize, { passive: true })
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="nf-wrap">
    <!-- Rain canvas -->
    <canvas id="rain-canvas" class="nf-rain" aria-hidden="true" />

    <!-- Content -->
    <div class="nf-content">
      <p class="nf-code">404</p>
      <p class="nf-frog">🐸</p>
      <h1 class="nf-title">{{ isRu ? 'Страница не найдена' : 'Page not found' }}</h1>
      <p class="nf-quote">
        {{
          isRu
            ? 'Похоже, эта страница потерялась в тумане войны. Жаба тоже не знает где она.'
            : 'Looks like this page got lost in the fog of war. The frog doesn\'t know where it is either.'
        }}
      </p>
      <button class="nf-btn" @click="goHome">
        {{ isRu ? '← Вернуться на главную' : '← Back to home' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── Wrapper ─────────────────────────────────────────────────────────────── */
.nf-wrap {
  position:        relative;
  min-height:      100dvh;
  display:         flex;
  align-items:     center;
  justify-content: center;
  overflow:        hidden;
}

/* ── Rain canvas ─────────────────────────────────────────────────────────── */
.nf-rain {
  position:       absolute;
  inset:          0;
  pointer-events: none;
  z-index:        0;
}

/* ── Content ─────────────────────────────────────────────────────────────── */
.nf-content {
  position:   relative;
  z-index:    1;
  text-align: center;
  padding:    0 24px;
}

/* ── 404 number with glow ────────────────────────────────────────────────── */
.nf-code {
  font-size:   clamp(100px, 22vw, 180px);
  font-weight: 900;
  line-height: 1;
  margin:      0;
  color:       #54a0ff;
  text-shadow:
    0 0 20px  rgba(84,160,255,0.8),
    0 0 60px  rgba(84,160,255,0.5),
    0 0 120px rgba(84,160,255,0.3);
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%,100% {
    text-shadow:
      0 0 20px  rgba(84,160,255,0.8),
      0 0 60px  rgba(84,160,255,0.5),
      0 0 120px rgba(84,160,255,0.3);
  }
  50% {
    text-shadow:
      0 0 30px  rgba(84,160,255,1),
      0 0 80px  rgba(84,160,255,0.7),
      0 0 160px rgba(84,160,255,0.4),
      0 0 220px rgba(120,100,255,0.2);
  }
}

/* ── Frog emoji ──────────────────────────────────────────────────────────── */
.nf-frog {
  font-size:  48px;
  margin:     -8px 0 8px;
  filter:     drop-shadow(0 0 12px rgba(84,160,255,0.5));
  animation:  frog-bob 2s ease-in-out infinite;
}

@keyframes frog-bob {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-8px); }
}

/* ── Title ───────────────────────────────────────────────────────────────── */
.nf-title {
  font-size:   24px;
  font-weight: 600;
  margin:      0 0 12px;
  color:       var(--vp-c-text-1);
}

/* ── Quote ───────────────────────────────────────────────────────────────── */
.nf-quote {
  font-size:   15px;
  color:       var(--vp-c-text-3);
  max-width:   380px;
  margin:      0 auto 32px;
  line-height: 1.6;
}

/* ── Button ──────────────────────────────────────────────────────────────── */
.nf-btn {
  display:       inline-block;
  padding:       10px 28px;
  background:    rgba(84,160,255,0.1);
  border:        1px solid rgba(84,160,255,0.3);
  border-radius: 10px;
  color:         #54a0ff;
  font-size:     15px;
  font-weight:   500;
  cursor:        pointer;
  transition:    background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.nf-btn:hover {
  background:  rgba(84,160,255,0.2);
  border-color: rgba(84,160,255,0.6);
  box-shadow:  0 0 20px rgba(84,160,255,0.25);
}

html:not(.dark) .nf-code {
  color:       #2563eb;
  text-shadow:
    0 0 20px  rgba(37,99,235,0.6),
    0 0 60px  rgba(37,99,235,0.3);
}

html:not(.dark) .nf-btn {
  background:   rgba(37,99,235,0.08);
  border-color: rgba(37,99,235,0.25);
  color:        #2563eb;
}

html:not(.dark) .nf-btn:hover {
  background:   rgba(37,99,235,0.15);
  border-color: rgba(37,99,235,0.5);
}
</style>
