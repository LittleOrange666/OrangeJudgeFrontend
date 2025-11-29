import { defineStore } from 'pinia';
import axios from 'axios';
import router from "@/router";
import {toForm} from "@/tools";

axios.defaults.withCredentials = true;

const API_BASE_URL = '/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        username: null,
        statusChecked: false,
        display_name: null
    }),

    actions: {
        async checkLoginStatus(force = false) {
            if (this.statusChecked && !force) return;

            try {
                const response = await axios.get(`${API_BASE_URL}/login`);
                this.isLoggedIn = response.data["data"]["logged_in"];
                this.username = response.data["data"]["username"];
                this.display_name = response.data["data"]["display_name"];

            } catch (error) {
                this.isLoggedIn = false;
                this.username = null;
                this.display_name = null;
            } finally {
                this.statusChecked = true;
            }
        },

        async logout() {
            try {
                await axios.delete(`${API_BASE_URL}/login`);
                this.isLoggedIn = false;
                this.username = null;
                this.statusChecked = false;
                await this.checkLoginStatus();
                await router.push('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        async login(username, password){
            try {
                const response = await axios.post(`${API_BASE_URL}/login`, toForm({
                    username,
                    password
                }));
                this.isLoggedIn = true;
                this.username = response.data["data"]["username"];
                await this.checkLoginStatus(true);
                if (!this.isLoggedIn){
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Login failed:', error);
                throw error; // Re-throw the error to be caught by the component
            }
        }
    },
});
