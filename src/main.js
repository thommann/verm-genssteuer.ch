import { createApp } from 'vue';
import './styles/main.css';
import App from './App.vue';
import i18n from './i18n';
import router from './router';

createApp(App).use(i18n).use(router).mount('#app');

// Seitentitel je Route setzen, damit Browser-Tab und geteilte Links das Thema zeigen.
router.afterEach((to) => {
  const key = to.meta.titleKey;
  const suffix = i18n.global.t('nav.brand');
  document.title = key ? `${i18n.global.t(key)} · ${suffix}` : suffix;
});
