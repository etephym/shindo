import { defineConfig, type DefaultTheme } from 'vitepress'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE_PATH = '/shindo/'
const SITE_URL  = 'https://etephym.github.io'

function resolveLogoPath(): string {
  const base = resolve(__dirname, '../public/logo')
  for (const ext of ['png', 'jpg', 'jpeg', 'webp', 'svg']) {
    if (existsSync(`${base}.${ext}`)) return `/logo.${ext}`
  }
  return '/logo.png'
}

const logoPath = resolveLogoPath()

const localSearchOptions = {
  miniSearch: { searchOptions: { fuzzy: 0.2, prefix: true } },
}

const socialLinks: DefaultTheme.SocialLink[] = [
  { icon: 'github',   link: 'https://github.com/etephym/shindo' },
  { icon: 'discord',  link: 'https://discord.gg/cmCpgkb5zq' },
  { icon: 'telegram', link: 'https://t.me/etephym' },
]

const footerMessage =
  '<a href="https://github.com/ezrqq" target="_blank" rel="noopener noreferrer">ezrqq / lewisky</a>' +
  ' &nbsp;·&nbsp; ' +
  '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>' +
  ' <span class="footer-cc-icons">' +
  '<img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC" width="18" height="18">' +
  '<img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY" width="18" height="18">' +
  '<img src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC" width="18" height="18">' +
  '<img src="https://mirrors.creativecommons.org/presskit/icons/sa.svg" alt="SA" width="18" height="18">' +
  '</span>'

const defaultThemeScript = `(function(){var k='vitepress-theme-appearance';if(!localStorage.getItem(k))localStorage.setItem(k,'dark');})()`

const sharedHead: [string, Record<string, string>][] = [
  ['script', { children: defaultThemeScript } as never],
  ['link', { rel: 'icon', href: `${BASE_PATH}${logoPath.replace(/^\//, '')}` }],
  ['meta', { name: 'theme-color', content: '#0d0d0d' }],
  ['meta', { property: 'og:image', content: `${SITE_URL}${BASE_PATH}${logoPath.replace(/^\//, '')}` }],
]

const defaultLogo = {
  dark:  logoPath,
  light: '/logo2.png',
} satisfies DefaultTheme.ThemeableImage

function createThemeConfig(params: {
  nav: DefaultTheme.NavItem[]
  sidebar: DefaultTheme.Sidebar
  outlineLabel: string
  returnToTopLabel: string
  sidebarMenuLabel: string
  darkModeSwitchLabel: string
  docFooter: DefaultTheme.DocFooter
  lastUpdatedText: string
  editLinkText: string
  searchButtonText: string
  searchButtonAriaLabel: string
  searchDisplayDetails: string
  searchResetButtonTitle: string
  searchBackButtonTitle: string
  searchNoResultsText: string
  searchFooterSelectText: string
  searchFooterNavigateText: string
  searchFooterCloseText: string
}): DefaultTheme.Config {
  return {
    logo: defaultLogo,
    siteTitle: 'Shindo Life',
    nav: params.nav,
    sidebar: params.sidebar,
    outline: { level: [2, 3], label: params.outlineLabel },
    returnToTopLabel: params.returnToTopLabel,
    sidebarMenuLabel: params.sidebarMenuLabel,
    darkModeSwitchLabel: params.darkModeSwitchLabel,
    externalLinkIcon: true,
    docFooter: params.docFooter,
    lastUpdated: {
      text: params.lastUpdatedText,
      formatOptions: { dateStyle: 'long', timeStyle: 'short' },
    },
    editLink: {
      pattern: 'https://github.com/etephym/shindo/edit/main/docs/:path',
      text: params.editLinkText,
    },
    search: {
      provider: 'local',
      options: {
        ...localSearchOptions,
        translations: {
          button: {
            buttonText: params.searchButtonText,
            buttonAriaLabel: params.searchButtonAriaLabel,
          },
          modal: {
            displayDetails:   params.searchDisplayDetails,
            resetButtonTitle: params.searchResetButtonTitle,
            backButtonTitle:  params.searchBackButtonTitle,
            noResultsText:    params.searchNoResultsText,
            footer: {
              selectText:   params.searchFooterSelectText,
              navigateText: params.searchFooterNavigateText,
              closeText:    params.searchFooterCloseText,
            },
          },
        },
      },
    },
    footer: {
      message:   footerMessage,
      copyright: 'Shindo Life Docs © 2024–2026',
    },
    socialLinks,
  }
}

export default defineConfig({
  base:        BASE_PATH,
  appearance:  true,
  cleanUrls:   true,
  lastUpdated: true,
  metaChunk:   true,
  sitemap: { hostname: `${SITE_URL}${BASE_PATH}` },
  markdown: {
    lineNumbers:  true,
    image: { lazyLoading: true },
  },
  locales: {
    root: {
      label:         'Русский',
      lang:          'ru-RU',
      title:         'Shindo Life Docs',
      titleTemplate: ':title · Shindo Life',
      description:   'Гайды, тир-листы и механики Shindo Life от ETEPHYM',
      head: [
        ...sharedHead,
        ['meta', { property: 'og:type',        content: 'website' }],
        ['meta', { property: 'og:title',       content: 'Shindo Life Docs' }],
        ['meta', { property: 'og:description', content: 'Гайды, тир-листы и механики Shindo Life' }],
      ],
      themeConfig: createThemeConfig({
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
              { text: 'Пассивки менторов', link: '/guide#mentor-passives' },
              { text: 'Менторы',           link: '/guide#mentors',         badge: { type: 'tip',     text: 'Рекомендуем' } },
              { text: 'Бонус репутации',   link: '/guide#rep-bonus-stats' },
              { text: 'Механика Danger',   link: '/guide#danger' },
              { text: 'Расы',              link: '/guide#races' },
            ],
          },
          {
            text: '💊 Предметы',
            collapsed: true,
            items: [
              { text: 'Хилки',         link: '/guide#heals' },
              { text: 'Throwables',    link: '/guide#throwable' },
              { text: 'Оружие',        link: '/guide#weapons' },
              { text: 'Companions',    link: '/guide#companion' },
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
              { text: 'Баг слотов', link: '/guide#slot-bug',    badge: { type: 'warning', text: 'Важно'    } },
            ],
          },
        ],
        outlineLabel:           'На этой странице',
        returnToTopLabel:       '↑ Наверх',
        sidebarMenuLabel:       'Меню',
        darkModeSwitchLabel:    'Тема',
        docFooter:              { prev: '← Предыдущая', next: 'Следующая →' },
        lastUpdatedText:        'Обновлено',
        editLinkText:           'Редактировать на GitHub',
        searchButtonText:       'Поиск',
        searchButtonAriaLabel:  'Поиск',
        searchDisplayDetails:   'Подробный список',
        searchResetButtonTitle: 'Сбросить',
        searchBackButtonTitle:  'Закрыть',
        searchNoResultsText:    'Ничего не найдено по запросу',
        searchFooterSelectText:   'Выбрать',
        searchFooterNavigateText: 'Навигация',
        searchFooterCloseText:    'Закрыть',
      }),
    },
    en: {
      label:         'English',
      lang:          'en-US',
      link:          '/en/',
      title:         'Shindo Life Docs',
      titleTemplate: ':title · Shindo Life',
      description:   'Guides, tier lists and mechanics for Shindo Life by ETEPHYM',
      head: [
        ...sharedHead,
        ['meta', { property: 'og:type',        content: 'website' }],
        ['meta', { property: 'og:title',       content: 'Shindo Life Docs' }],
        ['meta', { property: 'og:description', content: 'Guides, tier lists and mechanics for Shindo Life' }],
      ],
      themeConfig: createThemeConfig({
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
              { text: 'Mentor Passives', link: '/en/guide#mentor-passives' },
              { text: 'Mentors',         link: '/en/guide#mentors',         badge: { type: 'tip',     text: 'Must Read' } },
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
              { text: 'Terms',        link: '/en/guide#terms',       badge: { type: 'info',    text: 'Beginners'  } },
              { text: 'Shindo Rules', link: '/en/guide#shindo-rules' },
              { text: 'Slot Bug',     link: '/en/guide#slot-bug',    badge: { type: 'warning', text: 'Important'  } },
            ],
          },
        ],
        outlineLabel:           'On this page',
        returnToTopLabel:       '↑ Back to top',
        sidebarMenuLabel:       'Menu',
        darkModeSwitchLabel:    'Theme',
        docFooter:              { prev: '← Previous', next: 'Next →' },
        lastUpdatedText:        'Updated',
        editLinkText:           'Edit this page on GitHub',
        searchButtonText:       'Search',
        searchButtonAriaLabel:  'Search',
        searchDisplayDetails:   'Show detailed list',
        searchResetButtonTitle: 'Reset',
        searchBackButtonTitle:  'Close',
        searchNoResultsText:    'No results for',
        searchFooterSelectText:   'Select',
        searchFooterNavigateText: 'Navigate',
        searchFooterCloseText:    'Close',
      }),
    },
  },
})
