import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import type { EnhanceAppContext } from 'vitepress'
import mediumZoom from 'medium-zoom'

import vitepressNprogress from 'vitepress-plugin-nprogress'
import 'vitepress-plugin-nprogress/lib/css/index.css'

import Breadcrumb      from './components/Breadcrumb.vue'
import ReadingTime     from './components/ReadingTime.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CopyHeadingLink from './components/CopyHeadingLink.vue'
import RickRoll        from './components/RickRoll.vue'
import Copyright       from './components/Copyright.vue'

import './custom.css'

const POS_KEY = 'mp-pos'

function isRuPath(): boolean {
  return !window.location.pathname.includes('/en/')
}

function setupMusicPlayer(): void {
  if (document.getElementById('mp-root')) return

  const ru           = isRuPath()
  const labelIdle    = ru ? 'Фоновая музыка' : 'Background music'
  const labelPlaying = ru ? 'Играет...'       : 'Playing...'
  const titlePlay    = ru ? 'Играть'          : 'Play'

  const audio = new Audio('/shindo/Zerofuturism - a coldcore ambient playlist.mp3')
  audio.loop   = true
  audio.volume = 0.5
  let playing  = false

  const wrap = document.createElement('div')
  wrap.id = 'mp-root'
  wrap.innerHTML = [
    '<div id="mp-widget">',
    `  <button id="mp-btn" title="${titlePlay}" aria-label="${titlePlay}">`,
    '    <svg id="mp-icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5,3 19,12 5,21"/></svg>',
    '    <span id="mp-icon-bars" style="display:none" class="mp-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></span>',
    '  </button>',
    '  <div class="mp-info">',
    '    <span class="mp-title">Zerofuturism</span>',
    `    <span id="mp-sub" class="mp-sub">${labelIdle}</span>`,
    '  </div>',
    '</div>',
  ].join('')
  document.body.appendChild(wrap)

  const btn      = document.getElementById('mp-btn')       as HTMLButtonElement
  const sub      = document.getElementById('mp-sub')       as HTMLSpanElement
  const iconPlay = document.getElementById('mp-icon-play') as HTMLElement
  const iconBars = document.getElementById('mp-icon-bars') as HTMLElement
  const widget   = document.getElementById('mp-widget')    as HTMLElement
  const root     = document.getElementById('mp-root')      as HTMLElement

  // Restore saved position
  try {
    const saved = localStorage.getItem(POS_KEY)
    if (saved) {
      const { left, top } = JSON.parse(saved)
      root.style.bottom = 'auto'
      root.style.right  = 'auto'
      root.style.left   = Math.min(left, window.innerWidth  - 200) + 'px'
      root.style.top    = Math.min(top,  window.innerHeight - 80)  + 'px'
    }
  } catch { /* ignore */ }

  function setPlaying(val: boolean): void {
    playing                = val
    iconPlay.style.display = val ? 'none'        : 'block'
    iconBars.style.display = val ? 'inline-flex' : 'none'
    sub.textContent        = val ? labelPlaying  : labelIdle
    widget.classList.toggle('playing', val)
    btn.setAttribute('aria-label', val ? (ru ? 'Пауза' : 'Pause') : titlePlay)
  }

  let dragging = false
  let didDrag  = false
  let startX   = 0, startY = 0, origLeft = 0, origTop = 0

  function dragStart(clientX: number, clientY: number): void {
    const rect        = root.getBoundingClientRect()
    dragging          = true
    didDrag           = false
    startX            = clientX; startY   = clientY
    origLeft          = rect.left; origTop = rect.top
    root.style.transition = 'none'
    root.style.bottom     = 'auto'
    root.style.right      = 'auto'
    root.style.left       = origLeft + 'px'
    root.style.top        = origTop  + 'px'
    root.classList.add('dragging')
  }

  function dragMove(clientX: number, clientY: number): void {
    if (!dragging) return
    const dx = clientX - startX
    const dy = clientY - startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true
    root.style.left = Math.min(Math.max(0, origLeft + dx), window.innerWidth  - root.offsetWidth)  + 'px'
    root.style.top  = Math.min(Math.max(0, origTop  + dy), window.innerHeight - root.offsetHeight) + 'px'
  }

  function dragEnd(): void {
    if (dragging) {
      try {
        localStorage.setItem(POS_KEY, JSON.stringify({
          left: parseFloat(root.style.left),
          top:  parseFloat(root.style.top),
        }))
      } catch { /* ignore */ }
    }
    dragging = false
    root.style.transition = ''
    root.classList.remove('dragging')
    setTimeout(() => { didDrag = false }, 0)
  }

  widget.addEventListener('mousedown', (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('#mp-btn')) return
    dragStart(e.clientX, e.clientY)
  })
  document.addEventListener('mousemove', (e: MouseEvent) => dragMove(e.clientX, e.clientY))
  document.addEventListener('mouseup', () => dragEnd())

  widget.addEventListener('touchstart', (e: TouchEvent) => {
    if ((e.target as HTMLElement).closest('#mp-btn')) return
    dragStart(e.touches[0].clientX, e.touches[0].clientY)
  }, { passive: true })
  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (dragging) { e.preventDefault(); dragMove(e.touches[0].clientX, e.touches[0].clientY) }
  }, { passive: false })
  document.addEventListener('touchend', () => dragEnd())

  btn.addEventListener('click', () => {
    if (didDrag) return
    if (playing) { audio.pause(); setPlaying(false) }
    else         { audio.play().catch(() => {}); setPlaying(true) }
  })
}

const ZoomSetup = {
  setup() {
    const route = useRoute()
    let zoomInstance: ReturnType<typeof mediumZoom> | null = null
    const init = () => {
      zoomInstance?.detach()
      zoomInstance = mediumZoom('.vp-doc img:not(.no-zoom)', { background: 'rgba(0,0,0,0.85)' })
    }
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
      'doc-after':     () => h(Copyright),
      'layout-bottom': () => h('div', null, [h(ProgressWrapper), h(RickRoll)]),
    })
  },

  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    vitepressNprogress(ctx)
    if (typeof window !== 'undefined') {
      setTimeout(setupMusicPlayer, 0)
    }
  },
}
