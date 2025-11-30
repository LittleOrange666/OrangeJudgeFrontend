import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.checkLoginStatus().then(() => {
    app.mount('#app');
});
