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
import Breadcrumb  from './components/Breadcrumb.vue'
import ReadingTime from './components/ReadingTime.vue'

// Global styles
import './custom.css'

// Highlights the heading that matches current URL hash
// Works with VitePress router (hash doesn't trigger CSS :target)
const HeadingHighlight = {
  setup() {
    const route = useRoute()

    const highlight = () => {
      // Remove previous highlight
      document.querySelectorAll('.heading-highlighted').forEach(el => {
        el.classList.remove('heading-highlighted')
      })
      const hash = decodeURIComponent(window.location.hash.slice(1))
      if (!hash) return
      const target = document.getElementById(hash)
      if (!target) return
      target.classList.add('heading-highlighted')
      // Remove highlight after animation finishes
      setTimeout(() => target.classList.remove('heading-highlighted'), 2000)
    }

    onMounted(() => nextTick(highlight))
    watch(() => route.hash, () => nextTick(highlight))
  },
  render: () => null,
}

// Re-initializes zoom on every route change so new images are picked up
const ZoomSetup = {
  setup() {
    const route = useRoute()
    const initZoom = () =>
      mediumZoom('.vp-doc img', { background: 'rgba(0,0,0,0.85)' })
    onMounted(() => nextTick(initZoom))
    watch(() => route.path, () => nextTick(initZoom))
  },
  render: () => null,
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
      ]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
  },
}
