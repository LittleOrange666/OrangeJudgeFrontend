import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {useAuthStore} from './stores/auth';
import {createPinia} from 'pinia';
import highlightDirective from './directives/v-highlight'
import canCopyDirective from "@/directives/v-cancopy";
import mathDirective from "@/directives/v-math";
import vMyClickDirective from "@/directives/v-my-click";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'highlight.js/styles/github.css'
import 'vue3-markdown/dist/vue3-markdown.css'
import {useServerInfoStore} from "@/stores/serverInfo";
import {useJudgeInfoStore} from "@/stores/judgeInfo";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.directive('highlight', highlightDirective);

app.directive('can-copy', canCopyDirective);

app.directive("math", mathDirective);

app.directive("my-click", vMyClickDirective)

async function init() {
    await useAuthStore().checkLoginStatus();
    await useServerInfoStore().fetchServerInfo();
    await useJudgeInfoStore().fetchJudgeInfo();
}

init().then(() => {
    app.mount('#app');
});
