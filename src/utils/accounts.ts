/*
 * OrangeJudge, a competitive programming platform
 *
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