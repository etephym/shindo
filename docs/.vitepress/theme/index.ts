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
      ]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
  },
}
