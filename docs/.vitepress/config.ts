import { defineConfig, type DefaultTheme } from 'vitepress'

// ---------------------------------------------------------------------------
// Site-wide constants
// ---------------------------------------------------------------------------

const BASE_PATH = '/shindo/'
const SITE_URL  = 'https://etephym.github.io'
const FULL_URL  = `${SITE_URL}${BASE_PATH}`

// ---------------------------------------------------------------------------
// Social links shown in the navbar
// ---------------------------------------------------------------------------

const SOCIAL_LINKS: DefaultTheme.SocialLink[] = [
  { icon: 'github',   link: 'https://github.com/etephym/shindo' },
  { icon: 'discord',  link: 'https://discord.gg/cmCpgkb5zq' },
  { icon: 'telegram', link: 'https://t.me/etephym' },
]

// ---------------------------------------------------------------------------
// Footer — CC license icons generated from an array to avoid repetition
// ---------------------------------------------------------------------------

const CC_ICONS = [
  { file: 'cc', alt: 'CC' },
  { file: 'by', alt: 'BY' },
  { file: 'nc', alt: 'NC' },
  { file: 'sa', alt: 'SA' },
].map(({ file, alt }) =>
  `<img src="https://mirrors.creativecommons.org/presskit/icons/${file}.svg" alt="${alt}" width="18" height="18">`
).join('')

const FOOTER_MESSAGE =
  '<a href="https://github.com/ezrqq" target="_blank" rel="noopener noreferrer">ezrqq / lewisky</a>' +
  ' &nbsp;·&nbsp; ' +
  '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>' +
  ` <span class="footer-cc-icons">${CC_ICONS}</span>`

// ---------------------------------------------------------------------------
// Inline script — forces dark mode on first visit before Vue hydrates
// ---------------------------------------------------------------------------

const DARK_THEME_SCRIPT =
  `(function(){var k='vitepress-theme-appearance';` +
  `if(!localStorage.getItem(k))localStorage.setItem(k,'dark');})()`

// ---------------------------------------------------------------------------
// Head tags — shared between locales (theme-independent)
// ---------------------------------------------------------------------------

const SHARED_HEAD = [
  ['script', {}, DARK_THEME_SCRIPT],
  ['link',   { rel: 'icon', href: `${BASE_PATH}logo.png` }],
  ['meta',   { name: 'theme-color', content: '#0d0d0d' }],
  ['meta',   { property: 'og:image', content: `${FULL_URL}logo.png` }],
  ['meta',   { property: 'og:type',  content: 'website' }],
] as [string, Record<string, string>, string?][]

// ---------------------------------------------------------------------------
// Default logo — switches between dark/light variants automatically
// ---------------------------------------------------------------------------

const DEFAULT_LOGO = {
  dark:  '/logo.png',
  light: '/logo2.png',
} satisfies DefaultTheme.ThemeableImage

// ---------------------------------------------------------------------------
// Search — configured once in the root locale with per-locale translations.
// Using themeConfig.search.options.locales is the correct VitePress pattern
// for i18n; putting search in each locale's themeConfig causes only the last
// one to apply.
// ---------------------------------------------------------------------------

const SEARCH: DefaultTheme.Config['search'] = {
  provider: 'local',
  options: {
    miniSearch: { searchOptions: { fuzzy: 0.2, prefix: true } },
    // Russian translations (root locale / default)
    translations: {
      button: {
        buttonText:      'Поиск',
        buttonAriaLabel: 'Поиск',
      },
      modal: {
        displayDetails:   'Подробный список',
        resetButtonTitle: 'Сбросить',
        backButtonTitle:  'Закрыть',
        noResultsText:    'Ничего не найдено по запросу',
        footer: {
          selectText:   'Выбрать',
          navigateText: 'Навигация',
          closeText:    'Закрыть',
        },
      },
    },
    // English translations via locales subkey
    locales: {
      en: {
        translations: {
          button: {
            buttonText:      'Search',
            buttonAriaLabel: 'Search',
          },
          modal: {
            displayDetails:   'Show detailed list',
            resetButtonTitle: 'Reset',
            backButtonTitle:  'Close',
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
  },
}

// ---------------------------------------------------------------------------
// Sidebars
// ---------------------------------------------------------------------------

const sidebarRu: DefaultTheme.Sidebar = [
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
      { text: 'Пассивки менторов', link: '/guide#mentor-passives' },
      { text: 'Менторы',           link: '/guide#mentors', badge: { type: 'tip', text: 'Рекомендуем' } },
      { text: 'Бонус репутации',   link: '/guide#rep-bonus-stats' },
      { text: 'Механика Danger',   link: '/guide#danger' },
      { text: 'Расы',              link: '/guide#races' },
    ],
  },
  {
    text: '💊 Предметы',
    collapsed: true,
    items: [
      { text: 'Хилки',        link: '/guide#heals' },
      { text: 'Throwables',   link: '/guide#throwable' },
      { text: 'Оружие',       link: '/guide#weapons' },
      { text: 'Companions',   link: '/guide#companion' },
      { text: 'Боевые стили', link: '/guide#martials' },
    ],
  },
  {
    text: '🧪 Скиллы',
    collapsed: true,
    items: [
      { text: 'Элементы',      link: '/guide#elements',      badge: { type: 'danger', text: 'S+' } },
      { text: 'Kenjutsu',      link: '/guide#kenjutsu',      badge: { type: 'danger', text: 'S+' } },
      { text: 'Sub Abilities', link: '/guide#sub-abilities' },
      { text: 'Sub Modes',     link: '/guide#sub-modes' },
    ],
  },
  {
    text: '📋 Прочее',
    collapsed: true,
    items: [
      { text: 'Термины',    link: '/guide#terms',       badge: { type: 'info',    text: 'Новичкам' } },
      { text: 'Правила',    link: '/guide#shindo-rules' },
      { text: 'Баг слотов', link: '/guide#slot-bug',    badge: { type: 'warning', text: 'Важно'   } },
    ],
  },
]

const sidebarEn: DefaultTheme.Sidebar = [
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
      { text: 'Mentor Passives', link: '/en/guide#mentor-passives' },
      { text: 'Mentors',         link: '/en/guide#mentors', badge: { type: 'tip', text: 'Must Read' } },
      { text: 'Rep Bonus',       link: '/en/guide#rep-bonus-stats' },
      { text: 'Danger',          link: '/en/guide#danger' },
      { text: 'Races',           link: '/en/guide#races' },
    ],
  },
  {
    text: '💊 Items',
    collapsed: true,
    items: [
      { text: 'Heals',     link: '/en/guide#heals' },
      { text: 'Throwable', link: '/en/guide#throwable' },
      { text: 'Weapons',   link: '/en/guide#weapons' },
      { text: 'Companion', link: '/en/guide#companion' },
      { text: 'Martials',  link: '/en/guide#martials' },
    ],
  },
  {
    text: '🧪 Skills',
    collapsed: true,
    items: [
      { text: 'Elements',      link: '/en/guide#elements',      badge: { type: 'danger', text: 'S+' } },
      { text: 'Kenjutsu',      link: '/en/guide#kenjutsu',      badge: { type: 'danger', text: 'S+' } },
      { text: 'Sub Abilities', link: '/en/guide#sub-abilities' },
      { text: 'Sub Modes',     link: '/en/guide#sub-modes' },
    ],
  },
  {
    text: '📋 Other',
    collapsed: true,
    items: [
      { text: 'Terms',        link: '/en/guide#terms',       badge: { type: 'info',    text: 'Beginners' } },
      { text: 'Shindo Rules', link: '/en/guide#shindo-rules' },
      { text: 'Slot Bug',     link: '/en/guide#slot-bug',    badge: { type: 'warning', text: 'Important' } },
    ],
  },
]

// ---------------------------------------------------------------------------
// Main config export
// ---------------------------------------------------------------------------

export default defineConfig({
  base:        BASE_PATH,
  appearance:  true,
  cleanUrls:   true,
  lastUpdated: true,
  metaChunk:   true,
  sitemap: { hostname: FULL_URL },
  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
  },

  locales: {
    // Russian — root locale (no /ru/ prefix)
    root: {
      label:         'Русский',
      lang:          'ru-RU',
      title:         'Shindo Life Docs',
      titleTemplate: ':title · Shindo Life',
      description:   'Гайды, тир-листы и механики Shindo Life от ETEPHYM',
      head: [
        ...SHARED_HEAD,
        ['meta', { property: 'og:url',         content: FULL_URL }],
        ['meta', { property: 'og:locale',      content: 'ru_RU' }],
        ['meta', { property: 'og:title',       content: 'Shindo Life Docs' }],
        ['meta', { property: 'og:description', content: 'Гайды, тир-листы и механики Shindo Life' }],
      ],
      themeConfig: {
        logo:                DEFAULT_LOGO,
        siteTitle:           'Shindo Life',
        nav: [
          { text: '🏠 Главная', link: '/' },
          {
            text: '📚 Контент',
            items: [
              { text: '📖 Гайд',           link: '/guide' },
              { text: '💡 Советы и фишки', link: '/tips'  },
            ],
          },
        ],
        sidebar:              sidebarRu,
        socialLinks:          SOCIAL_LINKS,
        outline:              { level: [2, 3], label: 'На этой странице' },
        returnToTopLabel:     '↑ Наверх',
        sidebarMenuLabel:     'Меню',
        darkModeSwitchLabel:  'Тема',
        lightModeSwitchTitle: 'Светлая тема',
        darkModeSwitchTitle:  'Тёмная тема',
        langMenuLabel:        'Сменить язык',
        externalLinkIcon:     true,
        docFooter:            { prev: '← Предыдущая', next: 'Следующая →' },
        lastUpdated: {
          text:          'Обновлено',
          formatOptions: { dateStyle: 'long', timeStyle: 'short' },
        },
        editLink: {
          pattern: 'https://github.com/etephym/shindo/edit/main/docs/:path',
          text:    'Редактировать на GitHub',
        },
        search: SEARCH,
        footer: {
          message:   FOOTER_MESSAGE,
          copyright: 'Shindo Life Docs © 2024–2026',
        },
        notFound: {
          title:     'Страница не найдена',
          quote:     'Похоже, эта страница потерялась в тумане войны.',
          linkLabel: 'На главную',
          linkText:  '← Вернуться на главную',
          code:      '404',
        },
      },
    },

    // English — served under /en/
    en: {
      label:         'English',
      lang:          'en-US',
      link:          '/en/',
      title:         'Shindo Life Docs',
      titleTemplate: ':title · Shindo Life',
      description:   'Guides, tier lists and mechanics for Shindo Life by ETEPHYM',
      head: [
        ...SHARED_HEAD,
        ['meta', { property: 'og:url',         content: `${FULL_URL}en/` }],
        ['meta', { property: 'og:locale',      content: 'en_US' }],
        ['meta', { property: 'og:title',       content: 'Shindo Life Docs' }],
        ['meta', { property: 'og:description', content: 'Guides, tier lists and mechanics for Shindo Life' }],
        ['meta', { name: 'robots',             content: 'noindex' }],
      ],
      themeConfig: {
        logo:                DEFAULT_LOGO,
        siteTitle:           'Shindo Life',
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
        sidebar:              sidebarEn,
        socialLinks:          SOCIAL_LINKS,
        outline:              { level: [2, 3], label: 'On this page' },
        returnToTopLabel:     '↑ Back to top',
        sidebarMenuLabel:     'Menu',
        darkModeSwitchLabel:  'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle:  'Switch to dark theme',
        langMenuLabel:        'Change language',
        externalLinkIcon:     true,
        docFooter:            { prev: '← Previous', next: 'Next →' },
        lastUpdated: {
          text:          'Updated',
          formatOptions: { dateStyle: 'long', timeStyle: 'short' },
        },
        editLink: {
          pattern: 'https://github.com/etephym/shindo/edit/main/docs/:path',
          text:    'Edit this page on GitHub',
        },
        footer: {
          message:   FOOTER_MESSAGE,
          copyright: 'Shindo Life Docs © 2024–2026',
        },
        notFound: {
          title:     'Page not found',
          quote:     'Looks like this page got lost in the fog of war.',
          linkLabel: 'Go to home',
          linkText:  '← Back to home',
          code:      '404',
        },
      },
    },
  },
})
