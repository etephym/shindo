import DefaultTheme from 'vitepress/theme'
import { defineComponent, h } from 'vue'
import MusicPlayer from './components/MusicPlayer.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    name: 'CustomLayout',
    setup() {
      return () => h('div', { class: 'vp-layout-with-player' }, [h(DefaultTheme.Layout), h(MusicPlayer)])
    }
  })
}
