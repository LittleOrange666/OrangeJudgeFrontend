import {useAuthStore} from "@/stores/auth";
import {computed, ComputedRef} from "vue";

export const isLoggedIn: ComputedRef<boolean> = computed(() => useAuthStore().isLoggedIn);

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