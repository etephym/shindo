// =============================================================
// VitePress Theme Entry Point
// =============================================================

import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import type { EnhanceAppContext } from 'vitepress'
import mediumZoom from 'medium-zoom'

// Plugin: NProgress
import vitepressNprogress from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

// Components
import Breadcrumb      from './components/Breadcrumb.vue'
import ReadingTime     from './components/ReadingTime.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CopyHeadingLink from './components/CopyHeadingLink.vue'

// Global styles
import './custom.css'

// Re-initializes zoom on every route change so new images are picked up
const ZoomSetup = {
  setup() {
    const route = useRoute()
    let zoom: ReturnType<typeof mediumZoom> | null = null

    const initZoom = () => {
      zoom?.detach()
      zoom = mediumZoom('.vp-doc img', { background: 'rgba(0,0,0,0.85)' })
    }

    onMounted(() => nextTick(initZoom))
    watch(() => route.path, () => nextTick(initZoom))
  },
  render: () => null,
}

// Highlights the heading that matches current URL hash
const HeadingHighlight = {
  setup() {
    const route = useRoute()
    const highlight = () => {
      document.querySelectorAll('.heading-highlighted').forEach(el =>
        el.classList.remove('heading-highlighted')
      )
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (!hash) return
      const target = document.getElementById(hash)
      if (!target) return
      target.classList.add('heading-highlighted')
      setTimeout(() => target.classList.remove('heading-highlighted'), 2500)
    }
    onMounted(() => nextTick(highlight))
    watch(() => route.hash, () => nextTick(highlight))
  },
  render: () => null,
}

// Shows reading progress only on doc pages, not on homepage
const ProgressWrapper = {
  setup() {
    const route = useRoute()
    return () => {
      const isHome = route.path === '/' || route.path === '/en/'
      return isHome ? null : h(ReadingProgress)
    }
  },
}

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h('div', { class: 'doc-tools' }, [
        h(Breadcrumb),
        h(ReadingTime),
        h(ZoomSetup),
        h(HeadingHighlight),
        h(CopyHeadingLink),
      ]),
      // Reading progress badge — hidden on homepage
      'layout-bottom': () => h(ProgressWrapper),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
  },
}
