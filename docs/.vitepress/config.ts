// =============================================================
// VitePress Site Configuration
// Docs: https://vitepress.dev/reference/site-config
// =============================================================

import { defineConfig } from 'vitepress'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Logo: auto-detect format (png, jpg, jpeg, webp, svg) ---
// Just drop any file named "logo.*" into docs/public/ — no code changes needed
function findLogo(): string {
  const base = resolve(__dirname, '../public/logo')
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'svg']) {
    if (existsSync(`${base}.${ext}`)) return `/logo.${ext}`
  }
  return '/logo.png' // fallback if no logo found
}
const logoPath = findLogo()

// =============================================================

export default defineConfig({

  // --- Site metadata ---
  base:         '/shindo/',
  lang:         'ru-RU',
  title:        'Shindo Life Docs',
  titleTemplate: ':title · Shindo Life',
  description:  'Guides and tips for Shindo Life by ETEPHYM',

  // --- Appearance ---
  appearance:  'dark',       // dark by default, user can toggle
  cleanUrls:   true,         // removes .html from URLs
  lastUpdated: true,         // shows last updated date on pages
  metaChunk:   true,         // improves page load performance

  // --- HTML head tags ---
  head: [
    // Favicon — uses auto-detected logo path
    ['link', { rel: 'icon', href: `/shindo${logoPath}` }],

    // Google Fonts — Inter
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }],

    // Theme color for mobile browsers
    ['meta', { name: 'theme-color', content: '#0d0d0d' }],

    // Open Graph (social media previews)
    ['meta', { property: 'og:title',       content: 'Shindo Life Docs' }],
    ['meta', { property: 'og:description', content: 'Guides and tips for Shindo Life by ETEPHYM' }],
  ],

  // --- SEO sitemap ---
  sitemap: {
    hostname: 'https://etephym.github.io/shindo/',
  },

  // --- Markdown options ---
  markdown: {
    lineNumbers: true, // show line numbers in code blocks
  },

  // =============================================================
  // Theme configuration
  // Docs: https://vitepress.dev/reference/default-theme-config
  // =============================================================
  themeConfig: {

    // --- Header ---
    logo:      logoPath,
    siteTitle: 'Shindo Life',

    // --- Top navigation bar ---
    nav: [
      { text: '🏠 Home',  link: '/' },
      {
        text: '📚 Content',
        items: [
          { text: '📖 Guide',        link: '/guide' },
          { text: '💡 Tips & Tricks', link: '/tips'  },
        ],
      },
      {
        text: '🔗 Links',
        items: [
          { text: 'Discord',  link: 'https://discord.gg/cmCpgkb5zq' },
          { text: 'Telegram', link: 'https://t.me/etephym'           },
          { text: 'GitHub',   link: 'https://github.com/etephym/shindo' },
        ],
      },
    ],

    // --- Sidebar ---
    // collapsed: true = section is folded by default, user can expand
    // badge: { type, text } = colored label next to item
    sidebar: [
      {
        text: '📚 Pages',
        items: [
          { text: 'Guide',         link: '/guide', badge: { type: 'tip',     text: 'Read'      } },
          { text: 'Tips & Tricks', link: '/tips',  badge: { type: 'warning', text: 'Important' } },
        ],
      },
      {
        text: '⚔️ Mechanics',
        collapsed: true,
        items: [
          { text: 'Mentor Passives', link: '/guide#пассивки-менторов'                                               },
          { text: 'Mentors',         link: '/guide#менторы',   badge: { type: 'tip',     text: 'Must Read' } },
          { text: 'Rep Bonus',       link: '/guide#rep-bonus-stats'                                               },
          { text: 'Danger',          link: '/guide#danger'                                                         },
          { text: 'Races',           link: '/guide#расы'                                                           },
        ],
      },
      {
        text: '💊 Items',
        collapsed: true,
        items: [
          { text: 'Heals',      link: '/guide#хилки'    },
          { text: 'Throwable',  link: '/guide#throwable' },
          { text: 'Weapons',    link: '/guide#weapons'   },
          { text: 'Companion',  link: '/guide#companion' },
          { text: 'Martials',   link: '/guide#martials'  },
        ],
      },
      {
        text: '🧪 Skills',
        collapsed: true,
        items: [
          { text: 'Elements',      link: '/guide#elements',      badge: { type: 'danger', text: 'S+' } },
          { text: 'Kenjutsu',      link: '/guide#kenjutsu',      badge: { type: 'danger', text: 'S+' } },
          { text: 'Sub Abilities', link: '/guide#sub-abilities'                                          },
          { text: 'Sub Modes',     link: '/guide#sub-modes'                                              },
        ],
      },
      {
        text: '📋 Other',
        collapsed: true,
        items: [
          { text: 'Terms',        link: '/guide#термины',      badge: { type: 'tip',     text: 'Beginners' } },
          { text: 'Shindo Rules', link: '/guide#shindo-rules'                                                  },
          { text: 'Slot Bug',     link: '/guide#баг-слотов',   badge: { type: 'warning', text: 'Important' } },
        ],
      },
    ],

    // --- Right-side outline (table of contents) ---
    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    // --- Local search ---
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
          modal: {
            displayDetails:   'Show detailed list',
            resetButtonTitle: 'Reset search',
            backButtonTitle:  'Close search',
            noResultsText:    'No results for',
            footer: {
              selectText:   'Select',
              navigateText: 'Navigate',
              closeText:    'Close',
            },
          },
        },
      },
    },

    // --- Doc page footer navigation ---
    docFooter: {
      prev: '← Previous',
      next: 'Next →',
    },

    // --- UI labels ---
    externalLinkIcon: true,           // shows ↗ icon on external links
    returnToTopLabel: '↑ Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',

    // --- Site footer ---
    footer: {
      message:   'Made with ❤️ by ETEPHYM',
      copyright: 'Shindo Life Docs © 2025',
    },

    // --- Last updated label ---
    lastUpdated: {
      text: 'Updated',
    },

    // --- Social links (shown in top-right nav) ---
    socialLinks: [
      { icon: 'github',   link: 'https://github.com/etephym/shindo'  },
      { icon: 'discord',  link: 'https://discord.gg/cmCpgkb5zq'       },
      { icon: 'telegram', link: 'https://t.me/etephym'                },
    ],
  },
})
