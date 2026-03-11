<script setup>
// Breadcrumb navigation bar
// Renders: Home › PageName
// Shown above reading time on every doc page

import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route      = useRoute()
const { site }   = useData()

const crumbs = computed(() => {
  const parts  = route.path.replace(site.value.base, '').split('/').filter(Boolean)
  const result = [{ text: 'Home', link: site.value.base }]
  let path     = site.value.base

  for (const part of parts) {
    path += part + '/'
    const name = part.charAt(0).toUpperCase() + part.slice(1).replace('.html', '')
    result.push({ text: name, link: path })
  }

  return result
})
</script>

<template>
  <nav class="breadcrumb" v-if="crumbs.length > 1">
    <span v-for="(crumb, i) in crumbs" :key="i">

      <!-- Clickable parent crumbs -->
      <a v-if="i < crumbs.length - 1" :href="crumb.link">{{ crumb.text }}</a>

      <!-- Current page (not clickable) -->
      <span v-else class="current">{{ crumb.text }}</span>

      <!-- Separator -->
      <span v-if="i < crumbs.length - 1" class="arrow"> › </span>

    </span>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display:      flex;
  align-items:  center;
  flex-wrap:    wrap;
  font-size:    13px;
  color:        var(--vp-c-text-3);
  margin-bottom: 10px;
}
.breadcrumb a {
  color:       var(--vp-c-text-2);
  text-decoration: none;
  transition:  color 0.2s;
}
.breadcrumb a:hover { color: var(--vp-c-brand); }
.current { color: var(--vp-c-text-1); font-weight: 500; }
.arrow   { opacity: 0.4; margin: 0 3px; }
</style>
