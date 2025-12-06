import {computed, ComputedRef, Ref, ref} from "vue";
import {getQuery, useLoader} from "@/utils/tools";
import {default_page_size} from "@/utils/constants";

/**
 * Defines the interface for the page manager returned by the usePage composable.
 * @template T The type of the items in the page content.
 */
export interface PageManager<T> {
    /**
     * Navigates to a specific page and loads its content.
     * @param {string | number} page The page number to go to.
     * @returns {Promise<void>}
     */
    to_page: (page: string | number) => Promise<void>,
    /**
     * Reloads the content of the current page.
     * @returns {Promise<void>}
     */
    refresh: () => Promise<void>,
    /**
     * A ref indicating if a page load is currently in progress.
     */
    loading: Ref<boolean>,
    /**
     * A ref holding any error message that occurred during the data fetch.
     */
    error: Ref<string | null>,
    /**
     * A computed ref containing the array of items for the current page.
     */
    contents: ComputedRef<T[]>,
    /**
     * A ref holding the current page number as a string.
     */
    page: Ref<string>,
    /**
     * A computed ref containing an array of page numbers to be displayed in a pagination control.
     */
    show_pages: ComputedRef<string[]>,
    /**
     * A computed ref that is true if the data has loaded successfully without any errors.
     */
    ok: ComputedRef<boolean>,
    /**
     * A computed ref holding the total number of pages as a string.
     */
    page_cnt: ComputedRef<string>,
}

/**
 * Defines the expected structure of the API response for a paginated resource.
 * @template T The type of the items in the data array.
 */
interface PageResult<T> {
    data?: T[],
    show_pages?: string[],
    page_count?: string,
    page?: string, // The page number returned by the server
}

/**
 * A Vue composable for managing paginated data from an API.
 * It handles fetching data, managing loading and error states, and provides pagination controls.
 *
 * @template T The type of the items to be paginated.
 * @param {string} path The base API path for fetching data (without page parameters).
 * @param {Object.<string, Ref>} [args] Optional reactive arguments to include in the API request. The values should be refs.
 * @param {(page: string) => Promise<void>} [on_load] An optional callback function to execute after data is successfully loaded.
 * @returns {PageManager<T>} An object with state and methods for controlling pagination.
 */
export function usePage<T>(path: string, args?: {
    [key: string]: Ref<any>
}, on_load?: (page: string) => Promise<void>): PageManager<T> {
    const page: Ref<string> = ref(getQuery("page") || "1");
    const {data, error, load, loading} = useLoader<PageResult<T>>();
    const my_loading = ref(false);

    const show_pages = computed(() => data.value?.show_pages || []);
    const contents = computed(() => data.value?.data || []);
    const ok = computed(() => !loading.value && !error.value);
    const page_cnt = computed(() => data.value?.page_count || "1");

    /**
     * Fetches data for a specific page.
     * @param {string|number} page_val The page number to load.
     */
    const do_load = async (page_val: string | number) => {
        if (my_loading.value) return;
        my_loading.value = true;
        page.value = String(page_val);

        const get_args: { [key: string]: any } = {
            page: page.value,
            page_size: default_page_size
        };

        if (args) {
            for (const key in args) {
                get_args[key] = args[key].value;
            }
        }

        await load(path, get_args);

        if (data.value?.page && String(page.value) !== String(data.value.page)) {
            page.value = String(data.value.page);
        }

        if (on_load) {
            await on_load(page.value);
        }
        my_loading.value = false;
    };

    /**
     * Reloads the data for the current page.
     */
    const refresh = async () => {
        await do_load(page.value);
    };

    return {
        to_page: do_load,
        refresh: refresh,
        loading: my_loading,
        error: error,
        contents: contents,
        page: page,
        show_pages: show_pages,
        ok: ok,
        page_cnt: page_cnt
    };
}
