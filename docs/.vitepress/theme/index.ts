import { h, onMounted, nextTick, watch } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CustomSidebarItem from './components/CustomSidebarItem.vue'
import './custom.css'
import './amoled.css'
import mediumZoom from 'medium-zoom'
import { useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vitepress'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

const isMobileorTablet = useMediaQuery('(max-width: 1279px)')

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {})
  },

  enhanceApp({ app }) {
    app.component('VPSidebarItem', CustomSidebarItem)
    enhanceAppWithTabs(app)
  },

  // IMG ZOOM SETUP
  setup() {
    const route = useRoute()

    const initZoom = () => {
      const margin = isMobileorTablet.value ? 0 : 150
      mediumZoom('.main img', { background: 'var(--vp-c-bg)', margin })
    }

    onMounted(() => initZoom())

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
} satisfies Theme
