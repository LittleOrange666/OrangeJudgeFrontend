/*
 * Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 */
import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {useAuthStore} from './stores/auth';
import {createPinia} from 'pinia';
import highlightDirective from './directives/v-highlight'
import canCopyDirective from "@/directives/v-cancopy";
import mathDirective from "@/directives/v-math";
import myClickDirective from "@/directives/v-my-click";
import mySubmitDirective from "@/directives/v-my-submit";

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

app.directive("my-click", myClickDirective)

app.directive("my-submit", mySubmitDirective)

async function init() {
    await useAuthStore().checkLoginStatus();
    await useServerInfoStore().fetchServerInfo();
    await useJudgeInfoStore().fetchJudgeInfo();
}

init().then(() => {
    app.mount('#app');
});
