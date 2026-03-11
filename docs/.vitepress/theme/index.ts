import DefaultTheme from 'vitepress/theme'
import ReadingTime from './components/ReadingTime.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import './custom.css'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h('div', null, [
        h(Breadcrumb),
        h(ReadingTime)
      ])
    })
  }
}
