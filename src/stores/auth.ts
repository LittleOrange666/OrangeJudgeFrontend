import {defineStore} from 'pinia';
import axios from 'axios';
import router from "@/router";
import {api, ApiError} from "@/utils/tools";

axios.defaults.withCredentials = true;

/**
 * The `Permission` type defines a set of string literals representing
 * various levels of access or roles within a system.
 *
 * - `"make_problems"`: Represents a permission level that allows the
 *   user to create or manage problems or issues.
 * - `"admin"`: Represents a permission level that grants administrative
 *   privileges, typically including the ability to manage users or
 *   system settings.
 * - `"root"`: Represents the highest level of permission, offering full
 *   control over the system without any restrictions.
 */
export type Permission = "make_problems" | "admin" | "root";

/**
 * Represents the authentication state structure
 */
interface authState {
    /** Whether the user is currently logged in */
    isLoggedIn: boolean,
    /** The username of the logged-in user, or null if not logged in */
    username: string | null,
    /** Whether the login status has been checked */
    statusChecked: boolean,
    /** The display name of the user, or null if not logged in */
    display_name: string | null,
    /** Array of permissions assigned to the user */
    permissions: Permission[],
    /** Error message if any error occurred, or null if no error */
    error: string | null,
}

/**
 * Pinia store for managing authentication state and actions
 * Handles user login, logout, and session status checking
 */
export const useAuthStore = defineStore('auth', {
    /**
     * Initializes the store state
     * @returns {authState} The initial authentication state
     */
    state: (): authState => ({
        isLoggedIn: false,
        username: null,
        statusChecked: false,
        display_name: null,
        permissions: [],
        error: null,
    }),

    actions: {
        /**
         * Checks and updates the current user's login status
         * Fetches user information from the server if not previously checked or if forced
         * @param {boolean} [force=false] If true, forces a re-check regardless of previous status
         */
        async checkLoginStatus(force: boolean = false) {
            if (this.statusChecked && !force) return;

            try {
                const data = await api.get("/login");
                this.isLoggedIn = data["logged_in"];
                this.username = data["username"];
                this.display_name = data["display_name"];
                this.permissions = data["permissions"] || [];
                this.error = null;
            } catch (error) {
                this.isLoggedIn = false;
                this.username = null;
                this.display_name = null;
                this.permissions = [];
                this.error = (error as ApiError).message;
            } finally {
                this.statusChecked = true;
            }
        },

        /**
         * Logs out the current user and clears the authentication state
         * Redirects to the home page after successful logout
         */
        async logout() {
            try {
                await api.delete("/login");
                this.isLoggedIn = false;
                this.username = null;
                this.statusChecked = false;
                this.permissions = [];
                await this.checkLoginStatus();
                await router.push('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        /**
         * Authenticates a user with their credentials
         * @param {string} username The username to log in with
         * @param {string} password The password for authentication
         * @throws {Error} Throws an error if login fails
         */
        async login(username: string, password: string) {
            try {
                const data = await api.post("/login", {
                    username,
                    password
                });
                this.isLoggedIn = true;
                this.username = data["username"];
                await this.checkLoginStatus(true);
            } catch (error) {
                console.error('Login failed:', error);
                throw error; // Re-throw the error to be caught by the component
            }
        }
    },
});