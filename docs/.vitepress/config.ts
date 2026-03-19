import { defineConfig, type DefaultTheme } from 'vitepress'
import {
  BASE_PATH,
  FULL_URL,
  GITHUB_REPO_URL,
  EDIT_LINK,
  DISCORD_URL,
  TELEGRAM_URL,
} from './site.config'

// ---------------------------------------------------------------------------
// Social links shown in the navbar
// ---------------------------------------------------------------------------

const SOCIAL_LINKS: DefaultTheme.SocialLink[] = [
  { icon: 'github',   link: GITHUB_REPO_URL },
  { icon: 'discord',  link: DISCORD_URL },
  { icon: 'telegram', link: TELEGRAM_URL },
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
    text: '📌 Закреплено',
    collapsed: false,
    items: [
      { text: 'О проекте', link: '/about' },
    ],
  },
  {
    text: '⚔️ Shindo Life 2',
    collapsed: false,
    items: [
      { text: 'Проблемы Shindo Life', link: '/news/shindo-issues', badge: { type: 'danger', text: 'Актуально' } },
      { text: 'Гайд',           link: '/shindo-life/guide', badge: { type: 'tip',     text: 'Читать' } },
      { text: 'Советы и фишки', link: '/shindo-life/tips',  badge: { type: 'warning', text: 'Важно'  } },
    ],
  },
  {
    text: '🌊 Rell Seas',
    collapsed: false,
    items: [
      { text: 'Гайд',           link: '/rell-seas/guide', badge: { type: 'tip',  text: 'Скоро' } },
      { text: 'Советы и фишки', link: '/rell-seas/tips',  badge: { type: 'info', text: 'Скоро' } },
    ],
  },
]

const sidebarEn: DefaultTheme.Sidebar = [
  {
    text: '📌 Pinned',
    collapsed: false,
    items: [
      { text: 'About', link: '/en/about' },
    ],
  },
  {
    text: '⚔️ Shindo Life 2',
    collapsed: false,
    items: [
      { text: 'Shindo Life Issues', link: '/en/news/shindo-issues', badge: { type: 'danger', text: 'Active' } },
      { text: 'Guide',         link: '/en/shindo-life/guide', badge: { type: 'info', text: 'Soon' } },
      { text: 'Tips & Tricks', link: '/en/shindo-life/tips',  badge: { type: 'info', text: 'Soon' } },
    ],
  },
  {
    text: '🌊 Rell Seas',
    collapsed: false,
    items: [
      { text: 'Guide',         link: '/en/rell-seas/guide', badge: { type: 'info', text: 'Soon' } },
      { text: 'Tips & Tricks', link: '/en/rell-seas/tips',  badge: { type: 'info', text: 'Soon' } },
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

  // Search must be at top-level themeConfig — VitePress ignores it inside locales
  themeConfig: {
    search: SEARCH,
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
            text: '⚔️ Shindo Life 2',
            items: [
              { text: '📖 Гайд',           link: '/shindo-life/guide' },
              { text: '💡 Советы и фишки', link: '/shindo-life/tips'  },
            ],
          },
          {
            text: '🌊 Rell Seas',
            items: [
              { text: '📖 Гайд',           link: '/rell-seas/guide' },
              { text: '💡 Советы и фишки', link: '/rell-seas/tips'  },
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
          pattern: EDIT_LINK,
          text:    'Редактировать на GitHub',
        },
        footer: {
          message:   FOOTER_MESSAGE,
          copyright: 'Shindo Life Docs © 2024–2026',
        },
        notFound: {
          title:     '🐸 Страница не найдена',
          quote:     'Похоже, эта страница потерялась в тумане войны. Жаба тоже не знает где она.',
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
            text: '⚔️ Shindo Life 2',
            items: [
              { text: '📖 Guide',         link: '/en/shindo-life/guide' },
              { text: '💡 Tips & Tricks', link: '/en/shindo-life/tips'  },
            ],
          },
          {
            text: '🌊 Rell Seas',
            items: [
              { text: '📖 Guide',         link: '/en/rell-seas/guide' },
              { text: '💡 Tips & Tricks', link: '/en/rell-seas/tips'  },
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
          pattern: EDIT_LINK,
          text:    'Edit this page on GitHub',
        },
        footer: {
          message:   FOOTER_MESSAGE,
          copyright: 'Shindo Life Docs © 2024–2026',
        },
        notFound: {
          title:     '🐸 Page not found',
          quote:     'Looks like this page got lost in the fog of war. The frog doesn\'t know where it is either.',
          linkLabel: 'Go to home',
          linkText:  '← Back to home',
          code:      '404',
        },
      },
    },
  },
})
