import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

export const isLoggedIn = computed(() => useAuthStore().isLoggedIn);

export const hasProblemPermission = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("make_problems") ||
    authStore.permissions.includes("admin") ||
    authStore.permissions.includes("root")
});

export const hasAdminPermission = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("admin") ||
        authStore.permissions.includes("root")
});

export const hasRootPermission = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("root")
});