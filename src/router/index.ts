import {createRouter, createWebHistory, RouteLocation} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import {useAuthStore} from "@/stores/auth";
import IndexView from "@/views/IndexView.vue";
import {show_modal} from "@/utils/modal";

interface navItem{
    text:(to: RouteLocation)=>string,
    link:(to: RouteLocation)=>string
}

declare module 'vue-router' {
    // noinspection JSUnusedGlobalSymbols
    interface RouteMeta {
        pageTitle: string
        redirectIfLoggedIn?: boolean
        requiresAuth?: boolean,
        navItems?: navItem[],
    }
}

const routes: RouteRecordRaw[] = [
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
            pageTitle: "結果"
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
                    text:()=>"本題動態",
                    link:(to)=>"/status?pid="+to.params.pid
                },
                {
                    text:()=>"我的提交",
                    link:(to)=>{
                        const authStore = useAuthStore();
                        if(!authStore.isLoggedIn) return "";
                        return "/status?pid="+to.params.pid+"&user="+authStore.username;
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
        path: "/:catchAll(.*)",
        name: "notfound",
        component: () => import(/* webpackChunkName: "notfound" */ "@/views/NotFound.vue"),
        meta: {
            pageTitle: "找不到頁面"
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export function updateTitle(pageName?: string){
    pageName = pageName || '找不到頁面';
    const appTitleBase = 'OrangeJudge';
    document.title = `${pageName} | ${appTitleBase}`;
}

export function addNavLink(txt: string, link: string){
    if (!txt || !link) return;
    const li = document.createElement("li");
    li.className = "nav-item temp-nav-item";
    const a = document.createElement("a");
    a.href = link;
    a.textContent = txt;
    a.className = "nav-link active";
    li.appendChild(a);
    const nav = document.getElementById("navbarFirstBlock");
    nav.appendChild(li);
}

export function addNavBtn(txt: string, func: Function){
    if (!txt || !func) return;
    const li = document.createElement("li");
    li.className = "nav-item temp-nav-item";
    const a = document.createElement("a");
    a.href = "#";
    a.addEventListener("click", function (e){
        e.preventDefault();
        func();
    });
    a.textContent = txt;
    a.className = "nav-link active";
    li.appendChild(a);
    const nav = document.getElementById("navbarFirstBlock");
    nav.appendChild(li);
}

export function clearNav(){
    for(const o of document.querySelectorAll(".temp-nav-item")){
        o.remove();
    }
}

router.beforeEach(async (to: RouteLocation) => {
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
    updateTitle(to.meta.pageTitle);
    clearNav();
    if (to.meta.navItems){
        for(const o of to.meta.navItems){
            const txt = o.text(to);
            const link = o.link(to);
            addNavLink(txt, link);
        }
    }
});

router.onError(async (error: Error) => {
    console.log(error);
    await show_modal("網站錯誤", error.message);
    await router.push("/");
});

export default router;
