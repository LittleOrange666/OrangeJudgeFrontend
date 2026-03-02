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