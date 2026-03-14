const POS_KEY = 'mp-pos'

function isRuPath(): boolean {
  return !window.location.pathname.includes('/en/')
}

export function setupMusicPlayer(): void {
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

  function updateLabels(): void {
    const nowRu      = isRuPath()
    const nowIdle    = nowRu ? 'Фоновая музыка' : 'Background music'
    const nowPlaying = nowRu ? 'Играет...'       : 'Playing...'
    const nowTitle   = nowRu ? (playing ? 'Пауза' : 'Играть') : (playing ? 'Pause' : 'Play')
    sub.textContent  = playing ? nowPlaying : nowIdle
    btn.title        = nowTitle
    btn.setAttribute('aria-label', nowTitle)
  }

  const langObserver = new MutationObserver(updateLabels)
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })

  const rootObserver = new MutationObserver(() => {
    if (!document.getElementById('mp-root')) {
      langObserver.disconnect()
      rootObserver.disconnect()
    }
  })
  rootObserver.observe(document.body, { childList: true })
}
