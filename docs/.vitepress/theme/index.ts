// =============================================================
// VitePress Theme Entry
// - NProgress: loading bar on page transitions
// - ReadingTime: word count + estimated read time
// - Breadcrumb: navigation path above page content
// =============================================================

import DefaultTheme from 'vitepress/theme'
import { h }        from 'vue'
import type { EnhanceAppContext } from 'vitepress'

// Plugins
import vitepressNprogress           from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

// Components
import ReadingTime from './components/ReadingTime.vue'
import Breadcrumb  from './components/Breadcrumb.vue'

// Styles
import './custom.css'

export default {
  extends: DefaultTheme,

  // Inject components into layout slots
  // 'doc-before' = renders above the page content
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h('div', null, [
        h(Breadcrumb),
        h(ReadingTime),
      ]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)

    // Register NProgress loading bar
    vitepressNprogress(ctx)
  },
}
