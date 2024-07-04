import { h, watch } from 'vue'
import { useData, EnhanceAppContext } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import { createMediumZoomProvider } from './composables/useMediumZoom'

import MLayout from './components/MLayout.vue'
import MNavLinks from './components/MNavLinks.vue'
import { loadOml2d } from 'oh-my-live2d';
import './styles/index.scss'

let homePageStyle: HTMLStyleElement | undefined
const models = [
  'https://model.oml2d.com/HK416-2-normal/model.json',
  'https://model.oml2d.com/HK416-1-normal/model.json',
  'https://model.oml2d.com/Senko_Normals/senko.model3.json'
];
let currentModelIndex = 0;
const initialPosition = { x: -10, y: 20 }; // 模型的初始位置
export default {
  extends: DefaultTheme,
  Layout: () => {
    const props: Record<string, any> = {}
    // 获取 frontmatter
    const { frontmatter } = useData()

    /* 添加自定义 class */
    if (frontmatter.value?.layoutClass) {
      props.class = frontmatter.value.layoutClass
    }

    return h(MLayout, props)
  },
  enhanceApp({ app, router }: EnhanceAppContext) {
    createMediumZoomProvider(app, router)

    app.provide('DEV', process.env.NODE_ENV === 'development')

    app.component('MNavLinks', MNavLinks)
    //模型
    loadOml2d({
      primaryColor: '#D89ECD',
      dockedPosition: 'right', // 桌面位置
      // menus: {
      //   items: [
      //   ],
      // },
      models: [
        {
          path: 'https://model.oml2d.com/HK416-2-normal/model.json',
          position: [-10, 20]
        },
        {
          path: 'https://model.oml2d.com/HK416-1-normal/model.json',
          position: [-10, 20]
        },
        {
          path: 'https://model.oml2d.com/Senko_Normals/senko.model3.json',
          position: [-10, 20]
        },
      ]
    });
    // // 使用 setTimeout 来等待模型加载完成
    setTimeout(() => {
      const canvasElements: HTMLElement | null = document.getElementById('oml2d-stage'); // 查找所有的 canvas 元素
      console.log('canvasElements', canvasElements);
      makeElementDraggable(canvasElements as HTMLDivElement);
    }, 1000); // 1 秒的延迟，确保模型已经加载
    if (typeof window !== 'undefined') {
      watch(
        () => router.route.data.relativePath,
        () =>
          updateHomePageStyle(
            /* /vitepress-nav-template/ 是为了兼容 GitHub Pages */
            location.pathname === '/' || location.pathname === '/vitepress-nav-template/',
          ),
        { immediate: true },
      )
    }
  },
}

if (typeof window !== 'undefined') {
  // detect browser, add to class for conditional styling
  const browser = navigator.userAgent.toLowerCase()
  if (browser.includes('chrome')) {
    document.documentElement.classList.add('browser-chrome')
  } else if (browser.includes('firefox')) {
    document.documentElement.classList.add('browser-firefox')
  } else if (browser.includes('safari')) {
    document.documentElement.classList.add('browser-safari')
  }
}

// 主页加上彩虹动画
function updateHomePageStyle(value: boolean) {
  if (value) {
    if (homePageStyle) return

    homePageStyle = document.createElement('style')
    homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
    document.body.appendChild(homePageStyle)
  } else {
    if (!homePageStyle) return

    homePageStyle.remove()
    homePageStyle = undefined
  }
}
// 函数：使元素可以拖动
function makeElementDraggable(element: HTMLElement) {
  let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    initialX = event.clientX - offsetX;
    initialY = event.clientY - offsetY;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (event: MouseEvent) => {
    offsetX = event.clientX - initialX;
    offsetY = event.clientY - initialY;
    element.style.left = `${offsetX}px`;
    element.style.top = `${offsetY}px`;
    // element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  element.addEventListener('mousedown', onMouseDown);
}