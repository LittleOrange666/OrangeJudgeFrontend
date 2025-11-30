import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

/**
 * A utility module for accessing derived authentication and permission states.
 * Note: These are functions that must be called to get the current state,
 * as the Pinia store is only available after the app is initialized.
 */

/**
 * Returns a computed property that reflects the user's login status.
 * @returns {import('vue').ComputedRef<boolean>}
 */
export const isLoggedIn = () => {
  const authStore = useAuthStore();
  return computed(() => authStore.isLoggedIn);
};

/**
 * Returns a computed property indicating if the user has problem-creation permissions.
 * @returns {import('vue').ComputedRef<boolean>}
 */
export const hasProblemPermission = () => {
  const authStore = useAuthStore();
  return computed(() => 
    authStore.permissions.includes("make_problems") || 
    authStore.permissions.includes("admin") || 
    authStore.permissions.includes("root")
  );
};

/**
 * Returns a computed property indicating if the user has admin permissions.
 * @returns {import('vue').ComputedRef<boolean>}
 */
export const hasAdminPermission = () => {
  const authStore = useAuthStore();
  return computed(() => 
    authStore.permissions.includes("admin") || 
    authStore.permissions.includes("root")
  );
};

/**
 * Returns a computed property indicating if the user has root permissions.
 * @returns {import('vue').ComputedRef<boolean>}
 */
export const hasRootPermission = () => {
  const authStore = useAuthStore();
  return computed(() => authStore.permissions.includes("root"));
};
