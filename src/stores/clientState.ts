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