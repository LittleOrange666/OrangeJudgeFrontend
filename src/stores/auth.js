import {defineStore} from 'pinia';
import axios from 'axios';
import router from "@/router";
import {api} from "@/utils/tools";

axios.defaults.withCredentials = true;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        username: null,
        statusChecked: false,
        display_name: null,
        permissions: []
    }),

    actions: {
        async checkLoginStatus(force = false) {
            if (this.statusChecked && !force) return;

            try {
                const data = await api.get("/login");
                this.isLoggedIn = data["logged_in"];
                this.username = data["username"];
                this.display_name = data["display_name"];
                this.permissions = data["permissions"];
            } catch (error) {
                this.isLoggedIn = false;
                this.username = null;
                this.display_name = null;
                this.permissions = [];
            } finally {
                this.statusChecked = true;
            }
        },

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

        async login(username, password) {
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
