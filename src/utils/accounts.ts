import {Permission, useAuthStore} from "@/stores/auth";
import {computed, ComputedRef} from "vue";

export const isLoggedIn: ComputedRef<boolean> = computed(() => useAuthStore().isLoggedIn);

export function hasPermission(permission: Permission): boolean{
    const authStore = useAuthStore();
    if (authStore.permissions.includes("root")) return true;
    if(permission === "root") return false;
    if (authStore.permissions.includes("admin")) return true;
    if(permission === "admin") return false;
    return authStore.permissions.includes(permission);
}

export const hasProblemPermission: ComputedRef<boolean> = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("make_problems") ||
        authStore.permissions.includes("admin") ||
        authStore.permissions.includes("root")
});

export const hasAdminPermission: ComputedRef<boolean> = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("admin") ||
        authStore.permissions.includes("root")
});

export const hasRootPermission: ComputedRef<boolean> = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("root")
});