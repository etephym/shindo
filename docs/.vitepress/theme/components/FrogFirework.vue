<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { isHomePath } from '../utils/routing'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOLD_DURATION  = 1500
const FROG_EMOJI     = '🐸'
const MOVE_THRESHOLD = 8
const TOTAL_FROGS    = 22

// ---------------------------------------------------------------------------
// Route & site
// ---------------------------------------------------------------------------

const route    = useRoute()
const { site } = useData()

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let active     = false
let holdTimer:  ReturnType<typeof setTimeout> | null = null
let retryTimer: ReturnType<typeof setTimeout> | null = null
let target:     HTMLElement | null = null
let holdStartX = 0
let holdStartY = 0

// ---------------------------------------------------------------------------
// Canvas particle system — single draw call per frame, zero DOM per frame
// ---------------------------------------------------------------------------

interface Particle {
  x: number; y: number
  vx: number; vy: number
  rot: number; spin: number
  gravity: number
  size: number
  startTime: number
  duration: number
}

let canvas:   HTMLCanvasElement | null = null
let ctx:      CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let loopId:   number | null = null
let lastTime: number = 0

function createCanvas(): void {
  if (canvas) return
  canvas = document.createElement('canvas')
  Object.assign(canvas.style, {
    position:      'fixed',
    inset:         '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '99999',
  })
  resizeCanvas()
  ctx = canvas.getContext('2d')
  if (ctx) {
    // These properties persist on the context — set once, not per-particle
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
  }
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)
  window.addEventListener('resize', resizeCanvas, { passive: true })
}

function resizeCanvas(): void {
  if (!canvas) return
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  // Resizing a canvas resets its 2D context state — re-apply persistent properties
  if (ctx) {
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
  }
}

function destroyCanvas(): void {
  window.removeEventListener('resize', resizeCanvas)
  if (loopId !== null) { cancelAnimationFrame(loopId); loopId = null }
  particles = []
  canvas?.remove()
  canvas = null
  ctx    = null
}

// ---------------------------------------------------------------------------
// Particle loop — frame-rate independent via delta time
// ---------------------------------------------------------------------------

function tick(now: number): void {
  if (!ctx || !canvas) return
  const dt = Math.min((now - lastTime) / 16.67, 2.5)
  lastTime  = now

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Set font once per frame — all frogs use serif, size varies per particle
  // but setting font per-particle triggers expensive shaping; grouped sizes
  // would need sorting. Acceptable trade-off: set inside loop but only when size changes.
  let lastSize = -1
  let alive    = false

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    const t = (now - p.startTime) / p.duration
    if (t < 0) { alive = true; continue }
    if (t >= 1) continue

    alive  = true
    p.vy  += p.gravity * dt
    p.vx  *= Math.pow(0.993, dt)
    p.x   += p.vx * dt
    p.y   += p.vy * dt
    p.rot += p.spin * (1 - t * 0.5) * dt

    const scale = t < 0.08 ? t / 0.08 : Math.max(0, 1 - (t - 0.08) * 0.26)
    const fade  = t < 0.55 ? 1 : Math.max(0, 1 - ((t - 0.55) / 0.45) ** 2)

    ctx.save()
    ctx.globalAlpha = fade
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rot * Math.PI / 180)
    ctx.scale(scale, scale)
    // Only update font when size actually changes — avoids re-shaping every frame
    if (p.size !== lastSize) {
      ctx.font = `${p.size}px serif`
      lastSize = p.size
    }
    ctx.fillText(FROG_EMOJI, 0, 0)
    ctx.restore()
  }

  // Prune finished particles — splice in-place to avoid per-frame allocation
  for (let i = particles.length - 1; i >= 0; i--) {
    if ((now - particles[i].startTime) / particles[i].duration >= 1) {
      particles.splice(i, 1)
    }
  }

  if (alive) {
    loopId = requestAnimationFrame(tick)
  } else {
    loopId = null
    destroyCanvas()
  }
}

// ---------------------------------------------------------------------------
// Image rect helper — finds the currently visible hero image
// ---------------------------------------------------------------------------

function getImageRect(): DOMRect | null {
  if (!target) return null
  const imgs = target.querySelectorAll<HTMLImageElement>('img.image-src')
  for (const img of imgs) {
    if (window.getComputedStyle(img).display !== 'none') return img.getBoundingClientRect()
  }
  return target.getBoundingClientRect()
}

// ---------------------------------------------------------------------------
// Firework launch
// ---------------------------------------------------------------------------

function launchFirework(): void {
  const rect = getImageRect()
  if (!rect) return

  const mobile       = window.innerWidth < 768
  const cx           = rect.left + rect.width  / 2
  const cy           = rect.top  + rect.height / 2
  const rx           = rect.width  / 2
  const ry           = rect.height / 2
  const speedScale   = mobile ? 0.38 : 1.0
  const gravityScale = mobile ? 0.45 : 1.0
  const now          = performance.now()

  createCanvas()

  for (let i = 0; i < TOTAL_FROGS; i++) {
    const angle = (i / TOTAL_FROGS) * Math.PI * 2 + (Math.random() - 0.5) * 0.18
    const rv    = 0.88 + Math.random() * 0.24
    const speed = (7 + Math.random() * 8) * speedScale

    particles.push({
      x:         cx + Math.cos(angle) * rx * rv,
      y:         cy + Math.sin(angle) * ry * rv,
      vx:        Math.cos(angle) * speed,
      vy:        Math.sin(angle) * speed - Math.random() * 1.5 * speedScale,
      rot:       0,
      spin:      (Math.random() - 0.5) * 7,
      gravity:   (0.14 + Math.random() * 0.07) * gravityScale,
      size:      Math.round(18 + Math.random() * 16), // rounded to reduce unique font sizes
      startTime: now + Math.random() * 25,
      duration:  1800 + Math.random() * 500,
    })
  }

  // Sort only the newly added slice so the font-change optimization works
  // without disturbing in-flight particles from a previous burst
  const newSlice = particles.slice(-TOTAL_FROGS)
  newSlice.sort((a, b) => a.size - b.size)
  particles.splice(-TOTAL_FROGS, TOTAL_FROGS, ...newSlice)

  if (loopId === null) {
    lastTime = now
    loopId   = requestAnimationFrame(tick)
  }
}

// ---------------------------------------------------------------------------
// Context menu prevention — hero image only
// ---------------------------------------------------------------------------

const onContextMenu = (e: Event) => e.preventDefault()

// ---------------------------------------------------------------------------
// Hold detection
// ---------------------------------------------------------------------------

function startHold(x: number, y: number): void {
  if (!active) return
  holdStartX = x
  holdStartY = y
  if (holdTimer) clearTimeout(holdTimer)
  holdTimer = setTimeout(() => { holdTimer = null; launchFirework() }, HOLD_DURATION)
}

function cancelHold(): void {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
}

function checkMove(x: number, y: number): void {
  if (!holdTimer) return
  if (Math.hypot(x - holdStartX, y - holdStartY) > MOVE_THRESHOLD) cancelHold()
}

const onMouseDown  = (e: MouseEvent) => { if (e.button === 0) startHold(e.clientX, e.clientY) }
const onMouseMove  = (e: MouseEvent) => checkMove(e.clientX, e.clientY)
const onMouseUp    = () => cancelHold()
const onMouseLeave = () => cancelHold()
const onTouchStart = (e: TouchEvent) => startHold(e.touches[0].clientX, e.touches[0].clientY)
const onTouchMove  = (e: TouchEvent) => checkMove(e.touches[0].clientX, e.touches[0].clientY)
const onTouchEnd   = () => cancelHold()

// ---------------------------------------------------------------------------
// Attach / detach listeners to the hero image container
// ---------------------------------------------------------------------------

function attach(): void {
  detach()
  if (!active) return

  function tryAttach(n: number): void {
    const el = document.querySelector<HTMLElement>('.VPHero .image-container')
    if (el) {
      target = el
      target.addEventListener('contextmenu', onContextMenu)
      target.addEventListener('mousedown',   onMouseDown)
      target.addEventListener('mousemove',   onMouseMove)
      target.addEventListener('mouseup',     onMouseUp)
      target.addEventListener('mouseleave',  onMouseLeave)
      target.addEventListener('touchstart',  onTouchStart, { passive: true })
      target.addEventListener('touchmove',   onTouchMove,  { passive: true })
      target.addEventListener('touchend',    onTouchEnd)
      return
    }
    if (n > 0) retryTimer = setTimeout(() => tryAttach(n - 1), 50)
  }

  tryAttach(20)
}

function detach(): void {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }
  cancelHold()
  destroyCanvas()
  if (!target) return
  target.removeEventListener('contextmenu', onContextMenu)
  target.removeEventListener('mousedown',   onMouseDown)
  target.removeEventListener('mousemove',   onMouseMove)
  target.removeEventListener('mouseup',     onMouseUp)
  target.removeEventListener('mouseleave',  onMouseLeave)
  target.removeEventListener('touchstart',  onTouchStart)
  target.removeEventListener('touchmove',   onTouchMove)
  target.removeEventListener('touchend',    onTouchEnd)
  target = null
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

function activate(): void {
  active = isHomePath(route.path, site.value.base)
  attach()
}

onMounted(activate)
watch(() => route.path, activate)
onUnmounted(detach)
</script>

<template><span aria-hidden="true" /></template>
