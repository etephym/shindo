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

import Breadcrumb      from './components/Breadcrumb.vue'
import ReadingTime     from './components/ReadingTime.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CopyHeadingLink from './components/CopyHeadingLink.vue'
import RickRoll        from './components/RickRoll.vue'
import Copyright       from './components/Copyright.vue'
import FrogFirework    from './components/FrogFirework.vue'
import NotFound        from './components/NotFound.vue'

import './custom.css'

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
    ctx.app.component('NotFound', NotFound)
    vitepressNprogress(ctx)
    if (typeof window !== 'undefined') {
      requestAnimationFrame(setupMusicPlayer)
      setupKeyboardShortcuts()
    }
  },
}
