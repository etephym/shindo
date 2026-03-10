import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/shindo/',
  title: "Shindo Life Docs",
  description: "ETEPHYM",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/etephym/shindo' }
    ]
  }
})