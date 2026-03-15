// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POS_KEY   = 'mp-pos'
const AUDIO_SRC = '/shindo/Zerofuturism - a coldcore ambient playlist.mp3'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Labels = { idle: string; playing: string; play: string; pause: string }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns locale-specific UI strings based on the current URL path. */
function getLabels(isRu: boolean): Labels {
  return isRu
    ? { idle: 'Фоновая музыка', playing: 'Играет...', play: 'Играть', pause: 'Пауза'  }
    : { idle: 'Background music', playing: 'Playing...', play: 'Play', pause: 'Pause' }
}

/** True when the visitor is on the Russian locale (no /en/ in path). */
function isRuLocale(): boolean {
  return !window.location.pathname.includes('/en/')
}

/** Clamps a number between min and max. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ---------------------------------------------------------------------------
// Main setup — called once on app mount; guard prevents double-init
// ---------------------------------------------------------------------------

export function setupMusicPlayer(): void {
  if (document.getElementById('mp-root')) return

  // ── Audio element ──────────────────────────────────────────────────────────

  const audio   = new Audio(AUDIO_SRC)
  audio.loop    = true
  audio.volume  = 0.5
  audio.preload = 'none' // do not download until the user presses Play

  let isPlaying = false

  // ── Build DOM ──────────────────────────────────────────────────────────────

  const root = document.createElement('div')
  root.id    = 'mp-root'
  root.innerHTML =
    '<div id="mp-widget">' +
      '<button id="mp-btn" type="button">' +
        '<svg id="mp-icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
          '<polygon points="5,3 19,12 5,21"/>' +
        '</svg>' +
        '<span id="mp-icon-bars" style="display:none" class="mp-bars" aria-hidden="true">' +
          '<span></span><span></span><span></span><span></span>' +
        '</span>' +
      '</button>' +
      '<div class="mp-info">' +
        '<span class="mp-title">Zerofuturism</span>' +
        '<span id="mp-sub" class="mp-sub"></span>' +
      '</div>' +
    '</div>'

  document.body.appendChild(root)

  // Cache element references right after appending — guaranteed to exist
  const widget   = document.getElementById('mp-widget')    as HTMLElement
  const btn      = document.getElementById('mp-btn')       as HTMLButtonElement
  const sub      = document.getElementById('mp-sub')       as HTMLSpanElement
  const iconPlay = document.getElementById('mp-icon-play') as HTMLElement
  const iconBars = document.getElementById('mp-icon-bars') as HTMLElement

  // ── Restore saved drag position from localStorage ─────────────────────────

  try {
    const saved = localStorage.getItem(POS_KEY)
    if (saved) {
      const { left, top } = JSON.parse(saved) as { left: number; top: number }
      root.style.bottom = 'auto'
      root.style.right  = 'auto'
      root.style.left   = clamp(left, 0, window.innerWidth  - 200) + 'px'
      root.style.top    = clamp(top,  0, window.innerHeight - 80)  + 'px'
    }
  } catch { /* ignore corrupt / missing storage value */ }

  // ── Label helpers ──────────────────────────────────────────────────────────

  /** Syncs all text and aria attributes to the current locale + play state. */
  function applyLabels(): void {
    const l         = getLabels(isRuLocale())
    sub.textContent = isPlaying ? l.playing : l.idle
    const btnLabel  = isPlaying ? l.pause   : l.play
    btn.title       = btnLabel
    btn.setAttribute('aria-label', btnLabel)
  }

  applyLabels()

  /** Switches play/pause visual state and updates labels. */
  function setPlaying(val: boolean): void {
    isPlaying              = val
    iconPlay.style.display = val ? 'none'        : 'block'
    iconBars.style.display = val ? 'inline-flex' : 'none'
    widget.classList.toggle('playing', val)
    applyLabels()
  }

  // ── Playback ───────────────────────────────────────────────────────────────

  btn.addEventListener('click', () => {
    if (didDrag) return // ignore click that immediately follows a drag gesture

    if (isPlaying) {
      audio.pause()
      setPlaying(false)
    } else {
      // Set playing optimistically, revert on error (e.g. autoplay policy block)
      setPlaying(true)
      audio.play().catch(() => { setPlaying(false) })
    }
  })

  // Reset visual state if the audio file fails to load at any point
  audio.addEventListener('error', () => { setPlaying(false) })

  // ── Drag state ────────────────────────────────────────────────────────────

  let dragging = false
  let didDrag  = false // true when pointer moved > 3px — prevents ghost click after drag
  let startX = 0, startY = 0, origLeft = 0, origTop = 0

  function dragStart(clientX: number, clientY: number): void {
    const rect            = root.getBoundingClientRect()
    dragging              = true
    didDrag               = false
    startX                = clientX
    startY                = clientY
    origLeft              = rect.left
    origTop               = rect.top
    root.style.transition = 'none' // disable CSS transitions while dragging
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
    // Mark as a drag only after the pointer moves more than 3 px
    if (!didDrag && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) didDrag = true
    // Clamp inside viewport bounds
    root.style.left = clamp(origLeft + dx, 0, window.innerWidth  - root.offsetWidth)  + 'px'
    root.style.top  = clamp(origTop  + dy, 0, window.innerHeight - root.offsetHeight) + 'px'
  }

  function dragEnd(): void {
    if (!dragging) return
    dragging              = false
    root.style.transition = '' // re-enable CSS transitions
    root.classList.remove('dragging')
    // Persist the new position so it survives page refreshes
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({
        left: parseFloat(root.style.left),
        top:  parseFloat(root.style.top),
      }))
    } catch { /* ignore */ }
    // Defer reset so the click handler can still read didDrag === true
    requestAnimationFrame(() => { didDrag = false })
  }

  // ── Mouse drag events ─────────────────────────────────────────────────────

  widget.addEventListener('mousedown', (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('#mp-btn')) return
    dragStart(e.clientX, e.clientY)
  })

  // Store references so the same function instances can be removed on cleanup
  const onMouseMove = (e: MouseEvent)  => dragMove(e.clientX, e.clientY)
  const onMouseUp   = ()               => dragEnd()
  const onTouchEnd  = ()               => dragEnd()

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup',   onMouseUp)

  // ── Touch drag events ─────────────────────────────────────────────────────

  widget.addEventListener('touchstart', (e: TouchEvent) => {
    if ((e.target as HTMLElement).closest('#mp-btn')) return
    dragStart(e.touches[0].clientX, e.touches[0].clientY)
  }, { passive: true })

  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!dragging) return
    e.preventDefault() // prevent page scroll while dragging the widget
    dragMove(e.touches[0].clientX, e.touches[0].clientY)
  }, { passive: false })

  document.addEventListener('touchend', onTouchEnd)

  // ── Locale observer — updates labels when the user switches language ───────

  const langObserver = new MutationObserver(applyLabels)
  langObserver.observe(document.documentElement, {
    attributes:      true,
    attributeFilter: ['lang'],
  })

  // ── Self-cleanup when the widget is removed from the DOM ──────────────────
  // Uses named function references so removeEventListener actually works

  const bodyObserver = new MutationObserver(() => {
    if (document.getElementById('mp-root')) return
    langObserver.disconnect()
    bodyObserver.disconnect()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup',   onMouseUp)
    document.removeEventListener('touchend',  onTouchEnd)
  })
  bodyObserver.observe(document.body, { childList: true })
}
