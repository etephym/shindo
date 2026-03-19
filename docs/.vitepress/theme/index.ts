// ---------------------------------------------------------------------------
// Imports — VitePress / Vue core
// ---------------------------------------------------------------------------

import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import type { EnhanceAppContext } from 'vitepress'

// ---------------------------------------------------------------------------
// Imports — third-party plugins
// ---------------------------------------------------------------------------

import mediumZoom from 'medium-zoom'
import vitepressNprogress from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

// ---------------------------------------------------------------------------
// Imports — local modules and components
// ---------------------------------------------------------------------------

import { setupMusicPlayer } from './musicPlayer'

import AnnouncementBar from './components/AnnouncementBar.vue'
import Breadcrumb      from './components/Breadcrumb.vue'
import ReadingTime     from './components/ReadingTime.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CopyHeadingLink from './components/CopyHeadingLink.vue'
import RickRoll        from './components/RickRoll.vue'
import Copyright       from './components/Copyright.vue'
import FrogFirework    from './components/FrogFirework.vue'

import './custom.css'

// ---------------------------------------------------------------------------
// Animated favicon — spinning glow ring on page load, settles after 1.5s
// ---------------------------------------------------------------------------

function setupAnimatedFavicon(base: string): void {
  const canvas  = document.createElement('canvas')
  canvas.width  = 32
  canvas.height = 32
  const ctx     = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.src   = `${base}logo.png`

  // Find or create the favicon link element
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  let angle   = 0
  let rafId   = 0
  let elapsed = 0
  let last    = performance.now()

  function drawFrame(now: number): void {
    const dt  = now - last
    last      = now
    elapsed  += dt
    angle    += 0.07 * (dt / 16.67)

    ctx!.clearRect(0, 0, 32, 32)

    // Draw logo centered
    if (img.complete && img.naturalWidth > 0) {
      ctx!.save()
      ctx!.beginPath()
      ctx!.arc(16, 16, 13, 0, Math.PI * 2)
      ctx!.clip()
      ctx!.drawImage(img, 3, 3, 26, 26)
      ctx!.restore()
    }

    // Draw spinning arc around it — fades out after 1s
    const progress = Math.min(elapsed / 1500, 1)
    const alpha    = 1 - progress

    if (alpha > 0) {
      ctx!.save()
      ctx!.strokeStyle = `rgba(84,160,255,${alpha * 0.9})`
      ctx!.lineWidth   = 2.5
      ctx!.lineCap     = 'round'
      ctx!.beginPath()
      ctx!.arc(16, 16, 14, angle, angle + Math.PI * 1.2)
      ctx!.stroke()
      ctx!.restore()
    }

    link!.href = canvas.toDataURL()

    if (elapsed < 1600) {
      rafId = requestAnimationFrame(drawFrame)
    } else {
      // Restore real favicon
      cancelAnimationFrame(rafId)
      link!.href = `${base}logo.png`
    }
  }

  img.onload = () => { rafId = requestAnimationFrame(drawFrame) }
  // Fallback if already cached
  if (img.complete) rafId = requestAnimationFrame(drawFrame)
}

// ---------------------------------------------------------------------------
// Keyboard shortcut — '/' opens search, 'Escape' closes it
// ---------------------------------------------------------------------------

function setupKeyboardShortcuts(): void {
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== '/') return
    const el = document.activeElement as HTMLElement
    if (
      el?.tagName === 'INPUT'    ||
      el?.tagName === 'TEXTAREA' ||
      el?.isContentEditable
    ) return
    e.preventDefault()
    document.querySelector<HTMLButtonElement>('.VPNavBarSearchButton')?.click()
  })
}

// ---------------------------------------------------------------------------
// ZoomSetup
// ---------------------------------------------------------------------------

const ZoomSetup = {
  name: 'ZoomSetup',
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null

    function init() {
      zoom?.detach()
      zoom = mediumZoom('.vp-doc img:not(.no-zoom)', { background: 'rgba(0,0,0,0.85)' })
    }

    onMounted(() => nextTick(init))
    watch(() => route.path, () => nextTick(init))
    onUnmounted(() => zoom?.detach())
  },
  render: () => null,
}

// ---------------------------------------------------------------------------
// HeadingHighlight
// ---------------------------------------------------------------------------

const HeadingHighlight = {
  name: 'HeadingHighlight',
  setup() {
    const route = useRoute()
    let clearTimer: ReturnType<typeof setTimeout> | null = null

    function highlight() {
      document.querySelectorAll('.heading-highlighted').forEach(el =>
        el.classList.remove('heading-highlighted')
      )
      const hash   = decodeURIComponent(window.location.hash.slice(1))
      if (!hash) return
      const target = document.getElementById(hash)
      if (!target) return
      target.classList.add('heading-highlighted')
      if (clearTimer) clearTimeout(clearTimer)
      clearTimer = setTimeout(() => target.classList.remove('heading-highlighted'), 2500)
    }

    onMounted(() => nextTick(highlight))
    watch(() => route.hash, () => nextTick(highlight))
    onUnmounted(() => { if (clearTimer) clearTimeout(clearTimer) })
  },
  render: () => null,
}

// ---------------------------------------------------------------------------
// ProgressWrapper
// ---------------------------------------------------------------------------

const ProgressWrapper = {
  name: 'ProgressWrapper',
  setup() {
    const route    = useRoute()
    const { site } = useData()
    return () => {
      const base   = site.value.base
      const isHome = route.path === base || route.path === `${base}en/`
      return isHome ? null : h(ReadingProgress)
    }
  },
}

// ---------------------------------------------------------------------------
// Theme export
// ---------------------------------------------------------------------------

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(AnnouncementBar),
      'doc-before': () =>
        h('div', { class: 'doc-tools' }, [
          h(Breadcrumb),
          h(ReadingTime),
          h(ZoomSetup),
          h(HeadingHighlight),
          h(CopyHeadingLink),
        ]),
      'doc-after':     () => h(Copyright),
      'layout-bottom': () => h('div', null, [h(ProgressWrapper), h(RickRoll), h(FrogFirework)]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
    if (typeof window !== 'undefined') {
      requestAnimationFrame(setupMusicPlayer)
      setupKeyboardShortcuts()
      // Animated favicon — runs once on first load
      const base = (ctx.app.config.globalProperties.$site?.base) ?? '/rell-docs/'
      setupAnimatedFavicon(base)
    }
  },
}
