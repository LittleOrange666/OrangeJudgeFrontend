import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from "@/stores/auth";
import IndexView from "@/views/IndexView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: IndexView,
        meta: {
            pageTitle: '首頁'
        }
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
        meta: {
            pageTitle: '關於'
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    if (!authStore.statusChecked) {
        await authStore.checkLoginStatus();
    }
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return { name: 'login' };
    }
    if (to.meta.redirectIfLoggedIn && authStore.isLoggedIn) {
        return { name: 'home' };
    }
    const pageName = to.meta.pageTitle || '找不到頁面';
    const appTitleBase = process.env.VUE_APP_TITLE || 'OrangeJudge';
    document.title = `${pageName} - ${appTitleBase}`;
});

export default router
