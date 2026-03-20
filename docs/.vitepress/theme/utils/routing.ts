// ---------------------------------------------------------------------------
// Routing utilities — shared helpers for locale and home detection.
//
// Content lives in docs/en/ and docs/ru/ (always explicit prefixes).
// VitePress rewrites map the PRIMARY_LOCALE folder to root URLs so that
// the main language has clean URLs with no prefix in the address bar.
//
// Changing PRIMARY_LOCALE in site.config.ts is all that's needed to swap
// which language is primary — no files need to be moved.
// ---------------------------------------------------------------------------

import { PRIMARY_LOCALE, SECONDARY_LOCALE } from '../../site.config'

/** Ensures base always ends with a trailing slash. */
export function normalizeBase(base: string): string {
  return base.endsWith('/') ? base : `${base}/`
}

/**
 * Returns true when the current path is under the Russian locale.
 * Works regardless of whether Russian is primary (at root) or secondary (/ru/).
 */
export function isRussianPath(path: string, base: string): boolean {
  const nb = normalizeBase(base)
  if (PRIMARY_LOCALE === 'ru') {
    // RU is at root — Russian = everything that is NOT the secondary (EN) prefix
    return !path.startsWith(`${nb}en/`) && path !== `${nb}en`
  }
  // RU is under /ru/
  return path.startsWith(`${nb}ru/`) || path === `${nb}ru`
}

/**
 * Returns true when the current path is a home page
 * (root EN home or /ru/ home, depending on PRIMARY_LOCALE).
 */
export function isHomePath(path: string, base: string): boolean {
  const nb           = normalizeBase(base)
  const secondaryPfx = `${nb}${SECONDARY_LOCALE}/`
  const secondaryBare = `${nb}${SECONDARY_LOCALE}`
  return path === nb || path === secondaryPfx || path === secondaryBare
}
