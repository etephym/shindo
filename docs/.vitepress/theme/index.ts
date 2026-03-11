import DefaultTheme from 'vitepress/theme'
import ReadingTime from './components/ReadingTime.vue'
import './custom.css'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(ReadingTime)
    })
  },
  enhanceApp({ app }) {
    app.component('ReadingTime', ReadingTime)
  }
}
