<script setup lang="ts">
// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import { computed } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'

// ---------------------------------------------------------------------------
// Route, router & site data
// ---------------------------------------------------------------------------

const route    = useRoute()
const router   = useRouter()
const { site } = useData()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Crumb { text: string; link: string }

// ---------------------------------------------------------------------------
// Locale detection
// ---------------------------------------------------------------------------

const isEn = computed(() => route.path.includes('/en/'))

// ---------------------------------------------------------------------------
// Segment label map — maps URL path segments to display names per locale
// ---------------------------------------------------------------------------

const SEGMENT_MAP: Record<string, { ru: string; en: string }> = {
  guide: { ru: 'Гайд',           en: 'Guide'        },
  tips:  { ru: 'Советы и фишки', en: 'Tips & Tricks' },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converts a raw URL path segment into a human-readable breadcrumb label. */
function formatSegment(part: string): string {
  const entry = SEGMENT_MAP[part.toLowerCase()]
  if (entry) return isEn.value ? entry.en : entry.ru
  const decoded = decodeURIComponent(part).replace(/[-_]+/g, ' ').trim()
  if (!decoded) return part
  return decoded.charAt(0).toUpperCase() + decoded.slice(1)
}

// ---------------------------------------------------------------------------
// Computed breadcrumb list
// ---------------------------------------------------------------------------

const crumbs = computed<Crumb[]>(() => {
  // Normalise base to always have a trailing slash
  const base  = site.value.base.replace(/\/$/, '') + '/'
  // Strip the base prefix, then split the remainder into segments
  const clean = route.path.startsWith(base)
    ? route.path.slice(base.length)
    : route.path.replace(/^\//, '')

  // Filter out the bare 'en' locale prefix — it is a routing detail,
  // not a meaningful page the user navigated to intentionally
  const parts  = clean.split('/').filter(p => Boolean(p) && p !== 'en')
  const result: Crumb[] = [{ text: isEn.value ? 'Home' : 'Главная', link: base }]

  let accumulated = base
  for (const part of parts) {
    accumulated += part + '/'
    result.push({ text: formatSegment(part), link: accumulated })
  }

  return result
})

// ---------------------------------------------------------------------------
// Navigation — use vue-router to avoid full page reload on SPA
// ---------------------------------------------------------------------------

function navigate(e: MouseEvent, link: string): void {
  e.preventDefault()
  router.go(link)
}
</script>

<template>
  <!-- Render only when there is more than just the home crumb -->
  <nav v-if="crumbs.length > 1" class="breadcrumb" aria-label="Breadcrumb">
    <span v-for="(crumb, i) in crumbs" :key="crumb.link">
      <a
        v-if="i < crumbs.length - 1"
        :href="crumb.link"
        @click="navigate($event, crumb.link)"
      >{{ crumb.text }}</a>
      <span v-else class="current" aria-current="page">{{ crumb.text }}</span>
      <span v-if="i < crumbs.length - 1" class="sep" aria-hidden="true">›</span>
    </span>
  </nav>
</template>

<style scoped>
/* ── Breadcrumb container ────────────────────────────────────────────────── */
.breadcrumb {
  display:       flex;
  align-items:   center;
  flex-wrap:     wrap;
  gap:           2px;
  font-size:     13px;
  color:         var(--vp-c-text-3);
  margin-bottom: 10px;
}

/* ── Links ───────────────────────────────────────────────────────────────── */
.breadcrumb a       { color: var(--vp-c-text-2); text-decoration: none; transition: color 0.2s; }
.breadcrumb a:hover { color: var(--vp-c-brand); }

/* ── Active (last) segment ───────────────────────────────────────────────── */
.current { color: var(--vp-c-text-1); font-weight: 500; }

/* ── Separator ───────────────────────────────────────────────────────────── */
.sep { opacity: 0.4; margin: 0 4px; }
</style>
