<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

type Handler = { el: HTMLElement; fn: () => void }
let handlers: Handler[] = []

function cleanup(): void {
  for (const { el, fn } of handlers) {
    el.removeEventListener('click', fn)
  }
  document.querySelectorAll('.copy-heading-btn').forEach(el => el.remove())
  handlers = []
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function init(): void {
  cleanup()
  document.querySelectorAll<HTMLElement>('.vp-doc h2, .vp-doc h3').forEach(heading => {
    const id = heading.id
    if (!id) return

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy-heading-btn'
    btn.title = 'Скопировать ссылку'
    btn.setAttribute('aria-label', 'Скопировать ссылку на заголовок')
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>`

    const fn = async () => {
      const copied = await copyToClipboard(`${location.origin}${location.pathname}#${id}`)
      if (!copied) return
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
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  padding: 2px 4px;
  color: transparent;
  cursor: pointer;
  border-radius: 4px;
  vertical-align: middle;
  transition: color 0.2s ease;
  position: relative;
  border: 0;
  background: transparent;
}

h2:hover .copy-heading-btn,
h3:hover .copy-heading-btn {
  color: rgba(84, 160, 255, 0.5);
}

.copy-heading-btn:hover,
.copy-heading-btn:focus-visible {
  color: rgba(84, 160, 255, 1) !important;
}

.copy-heading-btn::after {
  content: 'Скопировано!';
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(13, 13, 13, 0.9);
  border: 1px solid rgba(84, 160, 255, 0.3);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
  color: #54a0ff;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.copy-heading-btn.copied::after {
  opacity: 1;
}
</style>
