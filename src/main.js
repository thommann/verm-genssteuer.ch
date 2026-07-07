import { createApp } from 'vue';
import './styles/main.css';
import App from './App.vue';
import i18n from './i18n';
import router from './router';
import { applyHead } from '@/lib/head';

createApp(App).use(i18n).use(router).mount('#app');

// Titel, Meta-Description, Canonical und Open-Graph-Tags je Route setzen, damit
// Browser-Tab, Suchmaschinen und geteilte Links das Thema zeigen (siehe src/lib/head.js).
router.afterEach((to) => {
  applyHead(to, (key) => i18n.global.t(key));
});
