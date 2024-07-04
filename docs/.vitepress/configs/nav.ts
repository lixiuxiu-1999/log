import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '主页', link: '/' },
  { text: '导航', link: '/nav/' },
  {
    text: '物语',
    link: 'https://notes.fe-mm.com',
  },
  { text: 'mmPlayer', link: 'https://netease-music.fe-mm.com' },
  {
    text: '油猴脚本',
    link: 'https://github.com/maomao1996/tampermonkey-scripts',
  },
]
