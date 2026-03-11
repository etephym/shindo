import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/shindo/',
  lang: 'ru-RU',
  title: "Shindo Life Docs",
  titleTemplate: ':title · Shindo Life',
  description: "Гайды и советы по Shindo Life от ETEPHYM",
  appearance: 'dark',
  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true,

  head: [
    ['link', { rel: 'icon', href: '/shindo/logo.jpg', type: 'image/jpeg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', rel: 'stylesheet' }],
    ['meta', { name: 'theme-color', content: '#0d0d0d' }],
    ['meta', { property: 'og:title', content: 'Shindo Life Docs' }],
    ['meta', { property: 'og:description', content: 'Гайды и советы по Shindo Life от ETEPHYM' }],
  ],

  sitemap: { hostname: 'https://etephym.github.io/shindo/' },
  markdown: { lineNumbers: true },

  themeConfig: {
    logo: '/logo.jpg',
    siteTitle: 'Shindo Life',

    nav: [
      { text: '🏠 Главная', link: '/' },
      {
        text: '📚 Контент',
        items: [
          { text: '📖 Guide', link: '/guide' },
          { text: '💡 Tips & Tricks', link: '/tips' },
        ]
      },
      {
        text: '🔗 Ссылки',
        items: [
          { text: 'Discord', link: 'https://discord.gg/cmCpgkb5zq' },
          { text: 'Telegram', link: 'https://t.me/etephym' },
          { text: 'GitHub', link: 'https://github.com/etephym/shindo' },
        ]
      }
    ],

    sidebar: [
      {
        text: '📚 Страницы',
        items: [
          {
            text: 'Guide',
            link: '/guide',
            badge: { type: 'tip', text: 'Читать' }
          },
          {
            text: 'Tips & Tricks',
            link: '/tips',
            badge: { type: 'warning', text: 'Важно' }
          },
        ]
      },
      {
        text: '⚔️ Механики',
        collapsed: true,
        items: [
          { text: 'Пассивки менторов', link: '/guide#пассивки-менторов' },
          {
            text: 'Менторы',
            link: '/guide#менторы',
            badge: { type: 'tip', text: 'Must Read' }
          },
          { text: 'Rep Bonus', link: '/guide#rep-bonus-stats' },
          { text: 'Danger', link: '/guide#danger' },
          { text: 'Расы', link: '/guide#расы' },
        ]
      },
      {
        text: '💊 Предметы',
        collapsed: true,
        items: [
          { text: 'Хилки', link: '/guide#хилки' },
          { text: 'Throwable', link: '/guide#throwable' },
          { text: 'Weapons', link: '/guide#weapons' },
          { text: 'Companion', link: '/guide#companion' },
          { text: 'Martials', link: '/guide#martials' },
        ]
      },
      {
        text: '🧪 Скиллы',
        collapsed: true,
        items: [
          {
            text: 'Elements',
            link: '/guide#elements',
            badge: { type: 'danger', text: 'S+' }
          },
          {
            text: 'Kenjutsu',
            link: '/guide#kenjutsu',
            badge: { type: 'danger', text: 'S+' }
          },
          { text: 'Sub Abilities', link: '/guide#sub-abilities' },
          { text: 'Sub Modes', link: '/guide#sub-modes' },
        ]
      },
      {
        text: '📋 Прочее',
        collapsed: true,
        items: [
          {
            text: 'Термины',
            link: '/guide#термины',
            badge: { type: 'tip', text: 'Новичкам' }
          },
          { text: 'Shindo Rules', link: '/guide#shindo-rules' },
          {
            text: 'Баг слотов',
            link: '/guide#баг-слотов',
            badge: { type: 'warning', text: 'Важно' }
          },
        ]
      }
    ],

    outline: { level: [2, 3], label: 'На этой странице' },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
          modal: {
            displayDetails: 'Подробный список',
            resetButtonTitle: 'Сбросить',
            backButtonTitle: 'Назад',
            noResultsText: 'Нет результатов',
            footer: {
              selectText: 'Выбрать',
              navigateText: 'Навигация',
              closeText: 'Закрыть'
            }
          }
        }
      }
    },

    docFooter: { prev: '← Предыдущая', next: 'Следующая →' },
    externalLinkIcon: true,
    returnToTopLabel: '↑ Наверх',
    sidebarMenuLabel: 'Меню',
    darkModeSwitchLabel: 'Тема',

    footer: {
      message: 'Сделано с ❤️ by ETEPHYM',
      copyright: 'Shindo Life Docs © 2025'
    },

    lastUpdated: { text: 'Обновлено' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/etephym/shindo' },
      { icon: 'discord', link: 'https://discord.gg/cmCpgkb5zq' },
      { icon: 'telegram', link: 'https://t.me/etephym' }
    ]
  }
})
