import {createRouter, createWebHistory, RouteLocation} from 'vue-router'
import {Permission, useAuthStore} from "@/stores/auth";
import {show_modal} from "@/utils/modal";
import {routes} from "@/router/routes";
import {useClientStore} from "@/stores/clientState";
import {hasPermission} from "@/utils/accounts";

interface navItem {
    text: (to: RouteLocation) => string,
    link: (to: RouteLocation) => string
}

declare module 'vue-router' {
    // noinspection JSUnusedGlobalSymbols
    interface RouteMeta {
        pageTitle: string
        redirectIfLoggedIn?: boolean
        requiresAuth?: boolean,
        navItems?: navItem[],
        requiredPermission?: Permission
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes
});

export function updateTitle(pageName?: string) {
    pageName = pageName || '找不到頁面';
    const appTitleBase = 'OrangeJudge';
    document.title = `${pageName} | ${appTitleBase}`;
}

export function addNavLink(txt: string, link: string) {
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

export function addNavBtn(txt: string, func: Function) {
    if (!txt || !func) return;
    const li = document.createElement("li");
    li.className = "nav-item temp-nav-item";
    const a = document.createElement("a");
    a.href = "#";
    a.addEventListener("click", function (e) {
        e.preventDefault();
        func();
    });
    a.textContent = txt;
    a.className = "nav-link active";
    li.appendChild(a);
    const nav = document.getElementById("navbarFirstBlock");
    nav.appendChild(li);
}

export function clearNav() {
    for (const o of document.querySelectorAll(".temp-nav-item")) {
        o.remove();
    }
}

router.beforeEach(async (to: RouteLocation, from: RouteLocation) => {
    const clientState = useClientStore();
    if (to.path !== from.path) clientState.setLoading(true);
    const authStore = useAuthStore();
    if (!authStore.statusChecked) {
        await authStore.checkLoginStatus();
    }
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        if (authStore.error){
            return {
                name: 'home',
                query: {
                    msg: "Login error when visiting " + to.fullPath
                }
            };
        }
        return {
            name: 'login',
            query: {
                redirect: to.fullPath
            }
        };
    }
    if (to.meta.requiredPermission && !hasPermission(to.meta.requiredPermission)) {
        return {
            name: 'home',
            query: {
                msg: "You don't have permission to visit " + to.fullPath
            }
        };
    }
    if (to.meta.redirectIfLoggedIn && authStore.isLoggedIn) {
        return {
            name: 'home',
            query: {
                msg: "Already have logged in"
            }
        };
    }
    updateTitle(to.meta.pageTitle);
    clearNav();
    if (to.meta.navItems) {
        for (const o of to.meta.navItems) {
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

router.afterEach(async () => {
    setTimeout(() => {
        const clientState = useClientStore();
        clientState.setLoading(false);
    }, 0);
});

export default router;
