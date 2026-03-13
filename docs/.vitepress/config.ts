// =============================================================
// VitePress Site Configuration
// Docs: https://vitepress.dev/reference/site-config
// =============================================================

import { defineConfig }     from 'vitepress'
import { existsSync }       from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath }    from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Logo auto-detection ---
// Drop any file named "logo.*" into docs/public/ — no code changes needed.
// Supported formats: png, jpg, jpeg, webp, svg
function resolveLogoPath(): string {
  const base = resolve(__dirname, '../public/logo')
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'svg']) {
    if (existsSync(`${base}.${ext}`)) return `/logo.${ext}`
  }
  return '/logo.png'
}

const logoPath = resolveLogoPath()

// =============================================================

export default defineConfig({

  // --- Build options ---
  base:            '/shindo/',
  appearance:      'dark',     // dark by default, user can toggle
  cleanUrls:       true,
  lastUpdated:     true,
  metaChunk:       true,
  ignoreDeadLinks: true,

  // --- SEO sitemap ---
  sitemap: { hostname: 'https://etephym.github.io/shindo/' },

  // --- Markdown options ---
  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
  },

  // =============================================================
  // Locales — Russian (root) + English (/en/)
  // Docs: https://vitepress.dev/guide/i18n
  // =============================================================
  locales: {

    // =========================================================
    // Russian — default locale
    // =========================================================
    root: {
      label:         'Русский',
      lang:          'ru-RU',
      title:         'Shindo Life Docs',
      titleTemplate: ':title · Shindo Life',
      description:   'Гайды, тир-листы и механики Shindo Life от ETEPHYM',

      head: [
        ['link', { rel: 'icon', href: `/shindo${logoPath}` }],
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
        ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }],
        ['meta', { name: 'theme-color',        content: '#0d0d0d'                                 }],
        ['meta', { property: 'og:type',        content: 'website'                                 }],
        ['meta', { property: 'og:title',       content: 'Shindo Life Docs'                        }],
        ['meta', { property: 'og:description', content: 'Гайды, тир-листы и механики Shindo Life' }],
      ],

      themeConfig: {
        logo:      logoPath,
        siteTitle: 'Shindo Life',

        // Links removed — social icons already in top-right
        nav: [
          { text: '🏠 Главная', link: '/'      },
          {
            text: '📚 Контент',
            items: [
              { text: '📖 Гайд',           link: '/guide' },
              { text: '💡 Советы и фишки', link: '/tips'  },
            ],
          },
        ],

        sidebar: [
          {
            text: '📚 Страницы',
            items: [
              { text: 'Гайд',           link: '/guide', badge: { type: 'tip',     text: 'Читать' } },
              { text: 'Советы и фишки', link: '/tips',  badge: { type: 'warning', text: 'Важно'  } },
            ],
          },
          {
            text: '⚔️ Механики',
            collapsed: true,
            items: [
              { text: 'Пассивки менторов', link: '/guide#mentor-passives'                                                    },
              { text: 'Менторы',           link: '/guide#mentors',         badge: { type: 'tip',     text: 'Must Read' } },
              { text: 'Rep Bonus',         link: '/guide#rep-bonus-stats'                                                    },
              { text: 'Danger',            link: '/guide#danger'                                                             },
              { text: 'Расы',              link: '/guide#races'                                                              },
            ],
          },
          {
            text: '💊 Предметы',
            collapsed: true,
            items: [
              { text: 'Хилки',     link: '/guide#heals'     },
              { text: 'Throwable', link: '/guide#throwable' },
              { text: 'Weapons',   link: '/guide#weapons'   },
              { text: 'Companion', link: '/guide#companion' },
              { text: 'Martials',  link: '/guide#martials'  },
            ],
          },
          {
            text: '🧪 Скиллы',
            collapsed: true,
            items: [
              { text: 'Элементы',      link: '/guide#elements',      badge: { type: 'danger', text: 'S+' } },
              { text: 'Kenjutsu',      link: '/guide#kenjutsu',      badge: { type: 'danger', text: 'S+' } },
              { text: 'Sub Abilities', link: '/guide#sub-abilities'                                          },
              { text: 'Sub Modes',     link: '/guide#sub-modes'                                              },
            ],
          },
          {
            text: '📋 Прочее',
            collapsed: true,
            items: [
              { text: 'Термины',      link: '/guide#terms',      badge: { type: 'info',    text: 'Новичкам' } },
              { text: 'Правила',      link: '/guide#shindo-rules'                                              },
              { text: 'Баг слотов',   link: '/guide#slot-bug',   badge: { type: 'warning', text: 'Важно'     } },
            ],
          },
        ],

        outline:             { level: [2, 3], label: 'На этой странице' },
        returnToTopLabel:    '↑ Наверх',
        sidebarMenuLabel:    'Меню',
        darkModeSwitchLabel: 'Тема',
        externalLinkIcon:    true,

        docFooter: { prev: '← Предыдущая', next: 'Следующая →' },

        lastUpdated: {
          text: 'Обновлено',
          formatOptions: { dateStyle: 'long', timeStyle: 'short' },
        },

        editLink: {
          pattern: 'https://github.com/etephym/shindo/edit/main/docs/:path',
          text:    'Редактировать на GitHub',
        },

        search: {
          provider: 'local',
          options: {
            miniSearch: { searchOptions: { fuzzy: 0.2, prefix: true } },
            translations: {
              button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
              modal: {
                displayDetails:   'Подробный список',
                resetButtonTitle: 'Сбросить',
                backButtonTitle:  'Закрыть',
                noResultsText:    'Ничего не найдено по запросу',
                footer: { selectText: 'Выбрать', navigateText: 'Навигация', closeText: 'Закрыть' },
              },
            },
          },
        },

        footer: {
          message:   '<a href="https://github.com/ezrqq">ezrqq / lewisky</a> · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">CC BY-NC-SA 4.0</a> <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"><img src="https://mirrors.creativecommons.org/presskit/icons/by.svg"><img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"><img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg">',
          copyright: 'Shindo Life Docs © 2024–2026',
        },

        socialLinks: [
          { icon: 'github',   link: 'https://github.com/etephym/shindo'  },
          { icon: 'discord',  link: 'https://discord.gg/cmCpgkb5zq'       },
          { icon: 'telegram', link: 'https://t.me/etephym'                },
        ],
      },
    },

    // =========================================================
    // English — soon
    // To translate: fill docs/en/index.md, guide.md, tips.md
    // =========================================================
    en: {
      label:         'English',
      lang:          'en-US',
      link:          '/en/',
      title:         'Shindo Life Docs',
      titleTemplate: ':title · Shindo Life',
      description:   'Guides, tier lists and mechanics for Shindo Life by ETEPHYM',

      themeConfig: {
        logo:      logoPath,
        siteTitle: 'Shindo Life',

        nav: [
          { text: '🏠 Home', link: '/en/' },
          {
            text: '📚 Content',
            items: [
              { text: '📖 Guide',         link: '/en/guide' },
              { text: '💡 Tips & Tricks', link: '/en/tips'  },
            ],
          },
        ],

        sidebar: [
          {
            text: '📚 Pages',
            items: [
              { text: 'Guide',         link: '/en/guide', badge: { type: 'tip',     text: 'Read'      } },
              { text: 'Tips & Tricks', link: '/en/tips',  badge: { type: 'warning', text: 'Important' } },
            ],
          },
          {
            text: '⚔️ Mechanics',
            collapsed: true,
            items: [
              { text: 'Mentor Passives', link: '/en/guide#mentor-passives'                                                },
              { text: 'Mentors',         link: '/en/guide#mentors',         badge: { type: 'tip',     text: 'Must Read' } },
              { text: 'Rep Bonus',       link: '/en/guide#rep-bonus-stats'                                                },
              { text: 'Danger',          link: '/en/guide#danger'                                                         },
              { text: 'Races',           link: '/en/guide#races'                                                          },
            ],
          },
          {
            text: '💊 Items',
            collapsed: true,
            items: [
              { text: 'Heals',     link: '/en/guide#heals'     },
              { text: 'Throwable', link: '/en/guide#throwable' },
              { text: 'Weapons',   link: '/en/guide#weapons'   },
              { text: 'Companion', link: '/en/guide#companion' },
              { text: 'Martials',  link: '/en/guide#martials'  },
            ],
          },
          {
            text: '🧪 Skills',
            collapsed: true,
            items: [
              { text: 'Elements',      link: '/en/guide#elements',      badge: { type: 'danger', text: 'S+' } },
              { text: 'Kenjutsu',      link: '/en/guide#kenjutsu',      badge: { type: 'danger', text: 'S+' } },
              { text: 'Sub Abilities', link: '/en/guide#sub-abilities'                                          },
              { text: 'Sub Modes',     link: '/en/guide#sub-modes'                                              },
            ],
          },
          {
            text: '📋 Other',
            collapsed: true,
            items: [
              { text: 'Terms',        link: '/en/guide#terms',      badge: { type: 'info',    text: 'Beginners' } },
              { text: 'Shindo Rules', link: '/en/guide#shindo-rules'                                               },
              { text: 'Slot Bug',     link: '/en/guide#slot-bug',   badge: { type: 'warning', text: 'Important'  } },
            ],
          },
        ],

        outline:             { level: [2, 3], label: 'On this page' },
        returnToTopLabel:    '↑ Back to top',
        sidebarMenuLabel:    'Menu',
        darkModeSwitchLabel: 'Theme',
        externalLinkIcon:    true,

        docFooter: { prev: '← Previous', next: 'Next →' },

        lastUpdated: {
          text: 'Updated',
          formatOptions: { dateStyle: 'long', timeStyle: 'short' },
        },

        editLink: {
          pattern: 'https://github.com/etephym/shindo/edit/main/docs/:path',
          text:    'Edit this page on GitHub',
        },

        search: {
          provider: 'local',
          options: {
            miniSearch: { searchOptions: { fuzzy: 0.2, prefix: true } },
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                displayDetails:   'Show detailed list',
                resetButtonTitle: 'Reset',
                backButtonTitle:  'Close',
                noResultsText:    'No results for',
                footer: { selectText: 'Select', navigateText: 'Navigate', closeText: 'Close' },
              },
            },
          },
        },

        footer: {
          message:   'Made with ❤️ by ETEPHYM',
          copyright: 'Shindo Life Docs © 2024–2026',
        },

        socialLinks: [
          { icon: 'github',   link: 'https://github.com/etephym/shindo'  },
          { icon: 'discord',  link: 'https://discord.gg/cmCpgkb5zq'       },
          { icon: 'telegram', link: 'https://t.me/etephym'                },
        ],
      },
    },
  },
})
