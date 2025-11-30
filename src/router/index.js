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
        component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue'),
        meta: {
            pageTitle: '關於'
        }
    },
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: "login" */ "@/views/LoginView.vue"),
        meta: {
            pageTitle: "登入",
            redirectIfLoggedIn: true
        }
    },
    {
        path: "/signup",
        name: "signup",
        component: () => import(/* webpackChunkName: "signup" */ "@/views/SignupView.vue"),
        meta: {
            pageTitle: "註冊",
            redirectIfLoggedIn: true
        }
    },
    {
        path: "/test",
        name: "test",
        component: () => import(/* webpackChunkName: "test" */ "@/views/TestView.vue"),
        meta: {
            pageTitle: "測試",
            requiresAuth: true
        }
    },
    {
        path: "/status",
        name: "status",
        component: () => import( "@/views/StatusView.vue"),
        meta: {
            pageTitle: "解題動態"
        }
    },
    {
        path: "/problem/test",
        redirect: "/test"
    },
    {
        path: "/:catchAll(.*)",
        name: "notfound",
        component: () => import(/* webpackChunkName: "notfound" */ "@/views/NotFound.vue"),
        meta: {
            pageTitle: "找不到頁面"
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
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        };
    }
    if (to.meta.redirectIfLoggedIn && authStore.isLoggedIn) {
        return {name: 'home'};
    }
    const pageName = to.meta.pageTitle || '找不到頁面';
    const appTitleBase = process.env.VUE_APP_TITLE || 'OrangeJudge';
    document.title = `${pageName} - ${appTitleBase}`;
});

export default router
