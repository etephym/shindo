<script setup lang="ts">
// Renders a starfield particles background on the homepage only
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vitepress'
import { tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const route  = useRoute()
const loaded = ref(false)

async function init() {
  await loadSlim(tsParticles)
  await tsParticles.load({
    id: 'tsparticles',
    options: {
      fullScreen:  { enable: false },
      background:  { color: { value: 'transparent' } },
      fpsLimit:    60,
      particles: {
        number:  { value: 120, density: { enable: true, width: 1920 } },
        color:   { value: ['#54a0ff', '#ff6b6b', '#ff9ff3', '#ffffff'] },
        opacity: {
          value: { min: 0.1, max: 0.6 },
          animation: { enable: true, speed: 0.5, sync: false },
        },
        size: {
          value: { min: 0.5, max: 2 },
        },
        move: {
          enable:    true,
          speed:     0.3,
          direction: 'none',
          random:    true,
          outModes:  { default: 'out' },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
        },
        modes: {
          grab: { distance: 120, links: { opacity: 0.2 } },
        },
      },
      detectRetina: true,
    },
  })
  loaded.value = true
}

onMounted(() => {
  // Only show on homepage (root and /en/)
  if (route.path === '/' || route.path === '/en/') init()
})

onUnmounted(() => {
  tsParticles.domItem(0)?.destroy()
})
</script>

<template>
  <div
    v-if="loaded"
    id="tsparticles"
    class="particles-wrap"
  />
</template>

<style scoped>
.particles-wrap {
  position: fixed;
  top:      0;
  left:     0;
  width:    100%;
  height:   100%;
  z-index:  0;
  pointer-events: none;
}
</style>
