import { defineConfig } from 'vitepress'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Универсальный поиск логотипа в docs/public/logo.*
function resolveLogoPath(): string {
  const logoBasePath = resolve(__dirname, '../public/logo')
  const availableExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg']

  for (const extension of availableExtensions) {
    const filePath = `${logoBasePath}.${extension}`

    if (existsSync(filePath)) {
      return `/logo.${extension}`
    }
  }

  return '/logo.jpg'
}

const logoPath = resolveLogoPath()

export default defineConfig({
  base: '/shindo/',
  lang: 'ru-RU',
  title: 'Shindo Life Docs',
  titleTemplate: ':title · Shindo Life',
  description: 'Максимально полный шаблон по VitePress + гайды и тир-листы по Shindo Life.',

  // Глобальные опции сборки/маршрутизации
  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true,
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: `/shindo${logoPath}` }],
    ['meta', { name: 'theme-color', content: '#0f172a' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Shindo Life Docs' }],
    ['meta', { property: 'og:description', content: 'Гайды, шаблоны и best-practices по VitePress.' }],
  ],

  sitemap: {
    hostname: 'https://etephym.github.io/shindo/',
  },

  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },

  themeConfig: {
    logo: logoPath,
    siteTitle: 'Shindo Life',

    nav: [
      { text: '🏠 Главная', link: '/' },
      { text: '📖 Гайд', link: '/guide' },
      { text: '💡 Tips', link: '/tips' },
      { text: '🧩 VitePress Templates', link: '/vitepress-templates' },
      {
        text: '🔗 Ссылки',
        items: [
          { text: 'Discord', link: 'https://discord.gg/cmCpgkb5zq' },
          { text: 'Telegram', link: 'https://t.me/etephym' },
          { text: 'GitHub', link: 'https://github.com/etephym/shindo' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Shindo Docs',
        items: [
          { text: 'Главная', link: '/' },
          { text: 'Guide', link: '/guide' },
          { text: 'Tips & Tricks', link: '/tips' },
        ],
      },
      {
        text: 'VitePress Starter Pack',
        collapsed: false,
        items: [
          { text: 'VitePress Templates', link: '/vitepress-templates', badge: { type: 'tip', text: 'NEW' } },
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    outline: {
      level: [2, 3],
      label: 'На этой странице',
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск по документации',
          },
          modal: {
            noResultsText: 'Ничего не найдено',
            resetButtonTitle: 'Сбросить поиск',
            footer: {
              selectText: 'Выбрать',
              navigateText: 'Навигация',
              closeText: 'Закрыть',
            },
          },
        },
      },
    },

    editLink: {
      pattern: 'https://github.com/etephym/shindo/edit/main/docs/:path',
      text: 'Предложить правку на GitHub',
    },

    docFooter: {
      prev: '← Назад',
      next: 'Вперёд →',
    },

    lastUpdated: {
      text: 'Последнее обновление',
      formatOptions: {
        dateStyle: 'long',
        timeStyle: 'short',
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/etephym/shindo' },
      { icon: 'discord', link: 'https://discord.gg/cmCpgkb5zq' },
      { icon: 'telegram', link: 'https://t.me/etephym' },
    ],

    footer: {
      message: 'Сделано с ❤️ для игроков Shindo и авторов документации на VitePress.',
      copyright: 'Shindo Life Docs © 2026',
    },

    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Навигация',
    darkModeSwitchLabel: 'Тема',
    lightModeSwitchTitle: 'Светлая тема',
    darkModeSwitchTitle: 'Тёмная тема',
  },
})
