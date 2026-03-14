<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { site } = useData()

type Crumb = {
  text: string
  link: string
}

const homeLabel = computed(() => (route.path.startsWith('/en/') ? 'Home' : 'Главная'))

function formatSegment(part: string): string {
  const normalized = decodeURIComponent(part.replace('.html', '')).replace(/[-_]+/g, ' ').trim()
  if (!normalized) return part
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const crumbs = computed<Crumb[]>(() => {
  const base = site.value.base
  const parts = route.path.replace(base, '').split('/').filter(Boolean)
  const result: Crumb[] = [{ text: homeLabel.value, link: base }]

  let path = base
  for (const part of parts) {
    path += `${part}/`
    result.push({ text: formatSegment(part), link: path })
  }

  return result
})
</script>

<template>
  <nav v-if="crumbs.length > 1" class="breadcrumb" aria-label="Breadcrumb">
    <span v-for="(crumb, i) in crumbs" :key="crumb.link">
      <a v-if="i < crumbs.length - 1" :href="crumb.link">{{ crumb.text }}</a>
      <span v-else class="current" aria-current="page">{{ crumb.text }}</span>
      <span v-if="i < crumbs.length - 1" class="arrow">›</span>
    </span>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
}

.breadcrumb a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: var(--vp-c-brand);
}

.current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.arrow {
  opacity: 0.4;
  margin: 0 6px;
}
</style>
