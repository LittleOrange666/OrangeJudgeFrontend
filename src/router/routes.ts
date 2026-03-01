import type {RouteRecordRaw} from "vue-router";
import IndexView from "@/views/IndexView.vue";
import {useAuthStore} from "@/stores/auth";

export const routes: RouteRecordRaw[] = [
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
        path: "/submission/:sub_id",
        name: "submission",
        component: () => import(/* webpackChunkName: "submission" */ "@/views/SubmissionView.vue"),
        meta: {
            pageTitle: "結果",
            requiresAuth: true
        }
    },
    {
        path: "/problem/:pid",
        name: "problem",
        component: () => import(/* webpackChunkName: "problem" */ "@/views/ProblemView.vue"),
        meta: {
            pageTitle: "題目",
            navItems: [
                {
                    text: () => "本題動態",
                    link: (to) => "/status?pid=" + to.params.pid
                },
                {
                    text: () => "我的提交",
                    link: (to) => {
                        const authStore = useAuthStore();
                        if (!authStore.isLoggedIn) return "";
                        return "/status?pid=" + to.params.pid + "&user=" + authStore.username;
                    }
                }
            ]
        }
    },
    {
        path: "/problems",
        name: "problems",
        component: () => import(/* webpackChunkName: "problems" */ "@/views/ProblemsView.vue"),
        meta: {
            pageTitle: "公開題目"
        }
    },
    {
        path: "/contests",
        name: "contests",
        component: () => import(/* webpackChunkName: "contests" */ "@/views/ContestsView.vue"),
        meta: {
            pageTitle: "競賽列表"
        }
    },
    {
        path: "/contest/:cid",
        name: "contest",
        component: () => import(/* webpackChunkName: "contest" */ "@/views/ContestView.vue"),
        meta: {
            pageTitle: "競賽"
        }
    },
    {
        path: "/contest/:cid/problem/:pid",
        name: "contest-problem",
        component: () => import(/* webpackChunkName: "contest-problem" */ "@/views/ContestProblemView.vue"),
        meta: {
            pageTitle: "題目"
        }
    },
    {
        path: "/settings",
        name: "settings",
        component: () => import(/* webpackChunkName: "settings" */ "@/views/SettingsView.vue"),
        meta: {
            pageTitle: "個人設置",
            requiresAuth: true
        }
    },
    {
        path: "/preferences",
        name: "preferences",
        component: () => import(/* webpackChunkName: "preferences" */ "@/views/PreferencesView.vue"),
        meta: {
            pageTitle: "偏好設置"
        }
    },
    {
        path: "/admin",
        name: "admin",
        component: () => import(/* webpackChunkName: "admin" */ "@/views/AdminView.vue"),
        meta: {
            pageTitle: "管理介面",
            requiresAuth: true,
            requiredPermission: "root"
        }
    },
    {
        path: "/admin/problem",
        name: "problems_manage",
        component: () => import(/* webpackChunkName: "problems_manage" */ "@/views/ProblemsManageView.vue"),
        meta: {
            pageTitle: "題目管理",
            requiresAuth: true,
            requiredPermission: "make_problems"
        }
    },
    {
        path: "/admin/problem/:pid",
        name: "problem_manage",
        component: () => import(/* webpackChunkName: "problem_manage" */ "@/views/ProblemManageView.vue"),
        meta: {
            pageTitle: "題目管理",
            requiresAuth: true,
            requiredPermission: "make_problems"
        }
    },
    {
        path: "/log/:log_id",
        name: "log",
        component: () => import(/* webpackChunkName: "log" */ "@/views/LogView.vue"),
        meta: {
            pageTitle: "Error log",
            requiresAuth: true,
            requiredPermission: "admin"
        }
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