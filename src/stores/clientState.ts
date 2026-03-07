/*
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

import {defineStore} from "pinia";


/**
 * Represents the client state structure
 */
interface ClientState {
    /** Indicates whether a loading process is active */
    loading: boolean
}

/**
 * Pinia store for managing client state
 * Handles the loading state of the application
 */
export const useClientStore = defineStore('clientState', {
    /**
     * Initializes the store state
     * @returns {ClientState} The initial client state
     */
    state: (): ClientState => ({
        loading: false,
    }),
    actions: {
        /**
         * Updates the loading state
         * @param {boolean} val The new loading state value
         */
        setLoading(val: boolean) {
            this.loading = val;
        }
    }
});