import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { createPinia } from 'pinia';
import highlightDirective from './directives/v-highlight'
import canCopyDirective from "@/directives/v-cancopy";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'highlight.js/styles/github.css'
import 'vue3-markdown/dist/vue3-markdown.css'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.directive('highlight', highlightDirective);

app.directive('can-copy', canCopyDirective);

const authStore = useAuthStore();
authStore.checkLoginStatus().then(() => {
    app.mount('#app');
});
