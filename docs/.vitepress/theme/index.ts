// ---------------------------------------------------------------------------
// Imports — VitePress / Vue core
// ---------------------------------------------------------------------------

import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'
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

import './custom.css'

// ---------------------------------------------------------------------------
// ZoomSetup — attaches medium-zoom to all doc images; re-initialises on navigation
// ---------------------------------------------------------------------------

const ZoomSetup = {
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null

    function init() {
      zoom?.detach()
      zoom = mediumZoom('.vp-doc img:not(.no-zoom)', { background: 'rgba(0,0,0,0.85)' })
    }

    onMounted(() => nextTick(init))
    watch(() => route.path, () => nextTick(init))
    onUnmounted(() => zoom?.detach()) // prevent memory leak on component destroy
  },
  render: () => null,
}

// ---------------------------------------------------------------------------
// HeadingHighlight — underlines the hash-target heading for 2.5 s after navigation
// ---------------------------------------------------------------------------

const HeadingHighlight = {
  setup() {
    const route = useRoute()
    let clearTimer: ReturnType<typeof setTimeout> | null = null

    function highlight() {
      // Remove any existing highlight before applying a new one
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
// ProgressWrapper — renders ReadingProgress only on non-home pages
// ---------------------------------------------------------------------------

const ProgressWrapper = {
  setup() {
    const route = useRoute()
    return () => {
      const isHome = route.path === '/' || route.path === '/en/'
      return isHome ? null : h(ReadingProgress)
    }
  },
}

// ---------------------------------------------------------------------------
// Theme export
// ---------------------------------------------------------------------------

export default {
  extends: DefaultTheme,

  // Inject components into named layout slots
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Above the document content: breadcrumb, reading time, and behaviour hooks
      'doc-before': () =>
        h('div', { class: 'doc-tools' }, [
          h(Breadcrumb),
          h(ReadingTime),
          h(ZoomSetup),
          h(HeadingHighlight),
          h(CopyHeadingLink),
        ]),
      // Below the document content: copyright notice
      'doc-after': () => h(Copyright),
      // Fixed overlay elements: scroll progress ring + rick-roll easter egg
      'layout-bottom': () => [h(ProgressWrapper), h(RickRoll)],
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
    // Music player is DOM-only — skip during SSR, defer until after first paint
    if (typeof window !== 'undefined') {
      requestAnimationFrame(setupMusicPlayer)
    }
  },
}
