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

import {defineStore} from 'pinia';
import {api} from "@/utils/tools";

/**
 * Represents the structure of server information
 */
interface serverInfo {
    /** Indicates whether verification is required */
    need_verify?: boolean,
    /** The name of the site */
    site_name?: string,
    /** The version information of the server */
    version_info?: string,
}

/**
 * Represents the state structure for the server information store
 */
interface serverState {
    /** The server information object */
    server_info: serverInfo,
    /** Indicates whether the server information has been fetched */
    hasFetched: boolean,
    /** Error message if any error occurred, or null if no error */
    error: null | string,
}

/**
 * Pinia store for managing server information
 * Handles fetching and storing server-related data
 */
export const useServerInfoStore = defineStore('serverInfo', {
    /**
     * Initializes the store state
     * @returns {serverState} The initial server information state
     */
    state: (): serverState => ({
        server_info: {},
        hasFetched: false, // Marks whether the data has been fetched
        error: null,
    }),
    actions: {
        /**
         * Fetches server information from the API
         * Updates the state with the fetched data or sets an error message if the fetch fails
         */
        async fetchServerInfo() {
            // If the data has already been fetched, return early without making a request
            if (this.hasFetched) {
                return;
            }

            try {
                this.server_info = await api.get('/server_info');
            } catch (err: any) {
                console.error('Failed to fetch server info:', err);
                this.error = err.message || 'An unknown error occurred';
            } finally {
                // Mark the data as fetched regardless of success or failure
                this.hasFetched = true;
            }
        },
    },
});