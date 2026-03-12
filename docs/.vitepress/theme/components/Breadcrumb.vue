<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { site } = useData()

function formatSegment(part: string): string {
  return decodeURIComponent(part)
    .replace(/\.html$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

const crumbs = computed(() => {
  const normalizedPath = route.path.replace(site.value.base, '')
  const parts = normalizedPath.split('/').filter(Boolean)
  const isEnglish = parts[0] === 'en'

  const homeText = isEnglish ? 'Home' : 'Главная'
  const result = [{ text: homeText, link: site.value.base }]
  let path = site.value.base

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
      <span v-else class="current">{{ crumb.text }}</span>
      <span v-if="i < crumbs.length - 1" class="arrow"> › </span>
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
  margin: 0 3px;
}
</style>
