import { defineStore } from 'pinia';
import axios from 'axios';
import router from "@/router";

axios.defaults.withCredentials = true;

const API_BASE_URL = '/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        logged_in: false,
        username: null,
        statusChecked: false,
        display_name: null
    }),

    actions: {
        async checkLoginStatus() {
            if (this.statusChecked) return;

            try {
                const response = await axios.get(`${API_BASE_URL}/login`);
                this.logged_in = response.data.logged_in;
                this.username = response.data.username;
                this.display_name = response.data.display_name;

            } catch (error) {
                this.logged_in = false;
                this.username = null;
                this.display_name = null;
            } finally {
                this.statusChecked = true;
            }
        },

        async logout() {
            try {
                await axios.delete(`${API_BASE_URL}/login`);
                this.logged_in = false;
                this.username = null;
                this.statusChecked = false;
                router.push('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        async login(username, password){
            try {
                const response = await axios.post(`${API_BASE_URL}/login`, {
                    username,
                    password
                });
                this.logged_in = true;
                this.username = response.data.username;
                this.statusChecked = false;
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    },
});