import {defineStore} from 'pinia';
import {api} from "@/utils/tools";

/**
 * Represents the structure of language information
 */
interface langInfo {
    /** The name of the programming language */
    name: string,
    /** The command or script used to compile the language */
    compile: string,
    /** The command or script used to run the language */
    run: string,
    /** The file extension associated with the language */
    ext: string
}

/**
 * Represents the state structure for the judge information store
 */
interface judgeState {
    /** Array of language information objects */
    lang_info: langInfo[],
    /** Indicates whether the judge information has been fetched */
    hasFetched: boolean,
    /** Error message if any error occurred, or null if no error */
    error: string | null,
}

/**
 * Pinia store for managing judge information
 * Handles fetching and storing language-related data
 */
export const useJudgeInfoStore = defineStore('judgeInfo', {
    /**
     * Initializes the store state
     * @returns {judgeState} The initial judge information state
     */
    state: (): judgeState => ({
        lang_info: [],
        hasFetched: false, // Marks whether the data has been fetched
        error: null,
    }),
    actions: {
        /**
         * Fetches judge information from the API
         * Updates the state with the fetched data or sets an error message if the fetch fails
         */
        async fetchJudgeInfo() {
            // If the data has already been fetched, return early without making a request
            if (this.hasFetched) {
                return;
            }

            try {
                const data = await api.get('/judge_info');
                if (Array.isArray(data.langs)) {
                    this.lang_info = data.langs;
                    this.error = null;
                } else {
                    throw new Error('The data format returned by the API is incorrect');
                }
            } catch (err: any) {
                console.error('Failed to fetch judge info:', err);
                this.error = err.message || 'An unknown error occurred';
            } finally {
                // Mark the data as fetched regardless of success or failure
                this.hasFetched = true;
            }
        },
    },
});