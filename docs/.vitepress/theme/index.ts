import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import type { EnhanceAppContext } from 'vitepress'
import mediumZoom from 'medium-zoom'

import vitepressNprogress           from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

import Breadcrumb      from './components/Breadcrumb.vue'
import ReadingTime     from './components/ReadingTime.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CopyHeadingLink from './components/CopyHeadingLink.vue'
import MusicPlayer from './components/MusicPlayer.vue'
import RickRoll        from './components/RickRoll.vue'
import Copyright       from './components/Copyright.vue'

import './custom.css'

const ZoomSetup = {
  setup() {
    const route = useRoute()
    const init  = () => mediumZoom('.vp-doc img', { background: 'rgba(0,0,0,0.85)' })
    onMounted(() => nextTick(init))
    watch(() => route.path, () => nextTick(init))
  },
  render: () => null,
}

const HeadingHighlight = {
  setup() {
    const route = useRoute()
    const highlight = () => {
      document.querySelectorAll('.heading-highlighted').forEach(el =>
        el.classList.remove('heading-highlighted')
      )
      const hash   = decodeURIComponent(window.location.hash.slice(1))
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
      'doc-after': () => h(Copyright),
      'layout-bottom': () => h('div', null, [
        h(ProgressWrapper),
        h(RickRoll),
        h(MusicPlayer),
      ]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
  },
}
