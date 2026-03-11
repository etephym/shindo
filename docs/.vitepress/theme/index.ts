import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import type { EnhanceAppContext } from 'vitepress'

import vitepressNprogress from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

import Breadcrumb from './components/Breadcrumb.vue'
import ReadingTime from './components/ReadingTime.vue'
import TemplateCallout from './components/TemplateCallout.vue'

import './style.css'
import './custom.css'

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h('div', { class: 'doc-tools' }, [h(Breadcrumb), h(ReadingTime)]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)

    // Глобальный компонент для быстрых заметок-шаблонов в markdown.
    ctx.app.component('TemplateCallout', TemplateCallout)
  },
}
