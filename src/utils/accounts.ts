import {Permission, useAuthStore} from "@/stores/auth";
import {computed, ComputedRef} from "vue";

/**
 * A computed property that indicates whether the user is logged in.
 * @type {ComputedRef<boolean>}
 */
export const isLoggedIn: ComputedRef<boolean> = computed(() => useAuthStore().isLoggedIn);

/**
 * Checks if the user has a specific permission.
 * @param {Permission} permission - The permission to check.
 * @returns {boolean} True if the user has the specified permission, false otherwise.
 */
export function hasPermission(permission: Permission): boolean {
    const authStore = useAuthStore();
    if (authStore.permissions.includes("root")) return true;
    if (permission === "root") return false;
    if (authStore.permissions.includes("admin")) return true;
    if (permission === "admin") return false;
    return authStore.permissions.includes(permission);
}

/**
 * A computed property that checks if the user has permission to manage problems.
 * @type {ComputedRef<boolean>}
 */
export const hasProblemPermission: ComputedRef<boolean> = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("make_problems") ||
        authStore.permissions.includes("admin") ||
        authStore.permissions.includes("root");
});

/**
 * A computed property that checks if the user has admin-level permissions.
 * @type {ComputedRef<boolean>}
 */
export const hasAdminPermission: ComputedRef<boolean> = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("admin") ||
        authStore.permissions.includes("root");
});

/**
 * A computed property that checks if the user has root-level permissions.
 * @type {ComputedRef<boolean>}
 */
export const hasRootPermission: ComputedRef<boolean> = computed(() => {
    const authStore = useAuthStore();
    return authStore.permissions.includes("root");
});