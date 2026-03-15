<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOLD_DURATION = 2000
const FROG_EMOJI    = '🐸'
const FROG_COUNT    = 24
const WAVE_COUNT    = 3     // firework fires in multiple waves
const WAVE_DELAY    = 180   // ms between waves

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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function checkIsHome(): boolean {
  const base = site.value.base
  return route.path === base || route.path === `${base}en/`
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// ---------------------------------------------------------------------------
// Single frog particle
// ---------------------------------------------------------------------------

function spawnFrog(
  startX: number,
  startY: number,
  angle:  number,
  wave:   number,
): void {
  const frog = document.createElement('span')
  frog.textContent = FROG_EMOJI
  frog.setAttribute('aria-hidden', 'true')

  const distance  = 100 + Math.random() * 160
  const dx        = Math.cos(angle) * distance
  const dy        = Math.sin(angle) * distance
  const size      = 18 + Math.random() * 20
  const duration  = 900 + Math.random() * 400
  const delay     = wave * WAVE_DELAY + Math.random() * 60
  const rotate    = (Math.random() - 0.5) * 720  // spin up to 2 full rotations
  const wobble    = (Math.random() - 0.5) * 30   // lateral wobble

  Object.assign(frog.style, {
    position:      'fixed',
    left:          `${startX}px`,
    top:           `${startY}px`,
    fontSize:      `${size}px`,
    lineHeight:    '1',
    pointerEvents: 'none',
    userSelect:    'none',
    zIndex:        '99999',
    transform:     'translate(-50%, -50%)',
    '--dx':        `${dx + wobble}px`,
    '--dy':        `${dy}px`,
    '--rot':       `${rotate}deg`,
    animation:     `frog-burst ${duration}ms cubic-bezier(0.2,0.8,0.4,1) ${delay}ms forwards`,
  })

  document.body.appendChild(frog)
  setTimeout(() => frog.remove(), duration + delay + 100)
}

// ---------------------------------------------------------------------------
// Firework — finds the visible img element to get accurate bounds
// ---------------------------------------------------------------------------

function launchFirework(): void {
  if (!target) return

  // Find the currently VISIBLE image (dark or light — whichever is displayed)
  const imgs = target.querySelectorAll<HTMLImageElement>('img.image-src')
  let imgEl: HTMLImageElement | null = null
  for (const img of imgs) {
    const computed = window.getComputedStyle(img)
    if (computed.display !== 'none' && computed.visibility !== 'hidden') {
      imgEl = img
      break
    }
  }

  // Fallback to container if no visible img found
  const rect = (imgEl ?? target).getBoundingClientRect()
  const cx   = rect.left + rect.width  / 2
  const cy   = rect.top  + rect.height / 2
  const rx   = rect.width  / 2
  const ry   = rect.height / 2

  for (let wave = 0; wave < WAVE_COUNT; wave++) {
    const frogsInWave = Math.round(FROG_COUNT / WAVE_COUNT)
    for (let i = 0; i < frogsInWave; i++) {
      // Evenly distribute angles, offset each wave slightly for fuller coverage
      const base  = (i / frogsInWave) * 2 * Math.PI
      const jitter = (Math.random() - 0.5) * (2 * Math.PI / frogsInWave) * 0.6
      const waveOffset = (wave / WAVE_COUNT) * (Math.PI / frogsInWave)
      const angle = base + jitter + waveOffset

      // Spawn from the exact border of the image ellipse
      const startX = cx + Math.cos(angle) * rx
      const startY = cy + Math.sin(angle) * ry

      spawnFrog(startX, startY, angle, wave)
    }
  }
}

// ---------------------------------------------------------------------------
// Context menu prevention — only on hero image
// ---------------------------------------------------------------------------

const onContextMenu = (e: Event) => e.preventDefault()

// ---------------------------------------------------------------------------
// Hold detection
// ---------------------------------------------------------------------------

function startHold(): void {
  if (!active) return
  if (holdTimer) clearTimeout(holdTimer)
  holdTimer = setTimeout(() => {
    holdTimer = null
    launchFirework()
  }, HOLD_DURATION)
}

function cancelHold(): void {
  if (holdTimer) { clearTimeout(holdTimer); holdTimer = null }
}

const onMouseDown  = (e: MouseEvent) => { if (e.button === 0) startHold() }
const onMouseUp    = () => cancelHold()
const onMouseLeave = () => cancelHold()
const onTouchStart = (e: TouchEvent) => { e.preventDefault(); startHold() }
const onTouchEnd   = () => cancelHold()

// ---------------------------------------------------------------------------
// Attach / detach
// ---------------------------------------------------------------------------

function attach(): void {
  detach()
  if (!active) return

  function tryAttach(retriesLeft: number): void {
    const el = document.querySelector<HTMLElement>('.VPHero .image-container')
    if (el) {
      target = el
      target.addEventListener('contextmenu', onContextMenu)
      target.addEventListener('mousedown',   onMouseDown)
      target.addEventListener('mouseup',     onMouseUp)
      target.addEventListener('mouseleave',  onMouseLeave)
      target.addEventListener('touchstart',  onTouchStart, { passive: false })
      target.addEventListener('touchend',    onTouchEnd)
      return
    }
    if (retriesLeft <= 0) return
    retryTimer = setTimeout(() => tryAttach(retriesLeft - 1), 50)
  }

  tryAttach(20)
}

function detach(): void {
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null }
  cancelHold()
  if (target) {
    target.removeEventListener('contextmenu', onContextMenu)
    target.removeEventListener('mousedown',   onMouseDown)
    target.removeEventListener('mouseup',     onMouseUp)
    target.removeEventListener('mouseleave',  onMouseLeave)
    target.removeEventListener('touchstart',  onTouchStart)
    target.removeEventListener('touchend',    onTouchEnd)
    target = null
  }
}

function activate(): void {
  active = checkIsHome()
  attach()
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

onMounted(activate)
watch(() => route.path, activate)
onUnmounted(detach)
</script>

<template><span aria-hidden="true" /></template>

<style>
@keyframes frog-burst {
  0% {
    opacity:   1;
    transform: translate(-50%, -50%) rotate(0deg) scale(0.3);
  }
  15% {
    opacity:   1;
    transform: translate(-50%, -50%) rotate(calc(var(--rot) * 0.15)) scale(1.3);
  }
  70% {
    opacity:   0.9;
    transform: translate(
        calc(-50% + var(--dx) * 0.85),
        calc(-50% + var(--dy) * 0.85)
      )
      rotate(calc(var(--rot) * 0.85))
      scale(1);
  }
  100% {
    opacity:   0;
    transform: translate(
        calc(-50% + var(--dx)),
        calc(-50% + var(--dy))
      )
      rotate(var(--rot))
      scale(0.5);
  }
}
</style>
