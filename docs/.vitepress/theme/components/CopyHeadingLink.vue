<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

const isEn        = computed(() => route.path.startsWith('/en/'))
const labelCopy   = computed(() => isEn.value ? 'Copy link'              : 'Скопировать ссылку')
const labelAria   = computed(() => isEn.value ? 'Copy link to heading'   : 'Скопировать ссылку на заголовок')
const labelCopied = computed(() => isEn.value ? 'Copied!'                : 'Скопировано!')

type Handler = { el: HTMLElement; fn: () => void }
let handlers: Handler[] = []

function cleanup(): void {
  for (const { el, fn } of handlers) el.removeEventListener('click', fn)
  document.querySelectorAll('.copy-heading-btn').forEach(el => el.remove())
  handlers = []
}

async function copyToClipboard(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true }
  catch { return false }
}

function init(): void {
  cleanup()
  const copied = labelCopied.value
  const title  = labelCopy.value
  const aria   = labelAria.value

  document.querySelectorAll<HTMLElement>('.vp-doc h2, .vp-doc h3').forEach(heading => {
    const id = heading.id
    if (!id) return

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy-heading-btn'
    btn.title = title
    btn.setAttribute('aria-label', aria)
    btn.dataset.copied = copied
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>`

    const fn = async () => {
      const ok = await copyToClipboard(`${location.origin}${location.pathname}#${id}`)
      if (!ok) return
      btn.classList.add('copied')
      setTimeout(() => btn.classList.remove('copied'), 1800)
    }

    btn.addEventListener('click', fn)
    handlers.push({ el: btn, fn })
    heading.appendChild(btn)
  })
}

onMounted(() => requestAnimationFrame(init))
watch(() => route.path, () => requestAnimationFrame(init))
onUnmounted(cleanup)
</script>

<template><span aria-hidden="true" /></template>

<style>
.copy-heading-btn {
  display:        inline-flex;
  align-items:    center;
  margin-left:    8px;
  padding:        2px 4px;
  color:          transparent;
  cursor:         pointer;
  border-radius:  4px;
  vertical-align: middle;
  transition:     color 0.2s ease;
  position:       relative;
  border:         0;
  background:     transparent;
}
h2:hover .copy-heading-btn,
h3:hover .copy-heading-btn              { color: rgba(84,160,255,0.5); }
.copy-heading-btn:hover,
.copy-heading-btn:focus-visible         { color: rgba(84,160,255,1) !important; }
.copy-heading-btn::after {
  content:        attr(data-copied);
  position:       absolute;
  top:            -32px;
  left:           50%;
  transform:      translateX(-50%);
  background:     #0d0d0d;
  border:         1px solid rgba(255,255,255,0.18);
  border-radius:  6px;
  padding:        4px 16px;
  line-height:    1.4;
  font-size:      12px;
  font-weight:    600;
  color:          #ffffff;
  white-space:    nowrap;
  box-shadow:     0 0 10px rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.5);
  opacity:        0;
  pointer-events: none;
  transition:     opacity 0.2s ease;
}

html:not(.dark) .copy-heading-btn::after {
  background:   #ffffff;
  border-color: rgba(0,0,0,0.15);
  color:        #0d0d0d;
  box-shadow:   0 0 10px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.1);
}
.copy-heading-btn.copied::after         { opacity: 1; }
</style>
