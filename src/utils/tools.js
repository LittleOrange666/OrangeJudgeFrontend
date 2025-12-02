import axios from "axios";
import {ref} from "vue";

/**
 * Converts a plain JavaScript object into a FormData object.
 * @param {Object<string, any>} obj The object to convert.
 * @returns {FormData} A FormData object containing the key-value pairs from the input object.
 */
export const toForm = function (obj) {
    let f = new FormData();
    if (!obj) return f;
    for (let key in obj) {
        f.append(key, obj[key]);
    }
    return f;
};

const API_BASE_URL = '/api';

/**
 * A helper function to send requests using axios and handle a standardized API response format.
 * It assumes the API returns a JSON object with "status" and "description" fields on failure,
 * and a "data" field on success.
 * @param {Function} func The axios method to call (e.g., axios.post, axios.put).
 * @param {string} path The API endpoint path.
 * @param {Object<string, any>} [obj] The data to be sent, which will be converted to FormData.
 * @returns {Promise<any>} A promise that resolves with the "data" field of the API response.
 * @throws {Error} Throws an error with the "description" from the API response if the request fails.
 */
async function send_request(func, path, obj){
    if (!path.startsWith("/")) path = "/" + path;
    const response = await func(API_BASE_URL + path, toForm(obj));
    if (response.data["status"] !== "success") {
        throw new Error(response.data["description"] || response.data["message"]);
    }
    return response.data["data"];
}

/**
 * A wrapper around axios for making API calls with a consistent base URL and error handling.
 */
export const api = {
    /**
     * Sends a GET request to the specified path.
     * @param {string} path The API endpoint path.
     * @param {Object<string, any>} [obj] The data to be sent as query parameters (converted to FormData).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    get: async function (path, obj){
        if (!path.startsWith("/")) path = "/" + path;
        const response = await axios.get(API_BASE_URL + path, {
            params: obj
        });
        if (response.data["status"] !== "success") {
            throw new Error(response.data["description"] || response.data["message"]);
        }
        return response.data["data"];
    },
    /**
     * Sends a POST request to the specified path.
     * @param {string} path The API endpoint path.
     * @param {Object<string, any>} [obj] The data to be sent in the request body (converted to FormData).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    post: async function (path, obj){
        return send_request(axios.post, path, obj);
    },
    /**
     * Sends a PUT request to the specified path.
     * @param {string} path The API endpoint path.
     * @param {Object<string, any>} [obj] The data to be sent in the request body (converted to FormData).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    put: async function (path, obj){
        return send_request(axios.put, path, obj);
    },
    /**
     * Sends a DELETE request to the specified path.
     * @param {string} path The API endpoint path.
     * @param {Object<string, any>} [obj] The data to be sent in the request body (converted to FormData).
     * @returns {Promise<any>} A promise that resolves with the response data.
     */
    delete: async function (path, obj){
        return send_request(axios.delete, path, obj);
    }
};

/**
 * Converts a Unix timestamp (in seconds) to a localized date-time string.
 * @param {number|string} i The Unix timestamp in seconds.
 * @returns {string} A localized string representation of the date and time.
 */
export function timestamp_to_str(i) {
    return new Date(+i * 1000).toLocaleString()
}

/**
 * A Vue Composition API composable for asynchronously loading data from an API endpoint.
 * It provides reactive state for data, loading status, and errors.
 *
 * @example
 * // In a Vue component's setup()
 * const { data, error, loading, load } = useLoader();
 * onMounted(() => {
 *   load('/api/my-data');
 * });
 *
 * @returns {{
 *   data: import('vue').Ref<any|null>,
 *   error: import('vue').Ref<string|null>,
 *   loading: import('vue').Ref<boolean>,
 *   load: (path: string, obj?: Object<string, any>) => Promise<void>
 * }} An object containing reactive refs and the load function.
 */
export function useLoader(){
    const data = ref(null);
    const error = ref(null);
    const loading = ref(true);
    async function load(path, obj){
        loading.value = true;
        error.value = null;
        data.value = null;
        try {
            data.value = await api.get(path, obj);
        } catch (err) {
            error.value = err["message"];
        } finally {
            loading.value = false;
        }
    }
    return {
        data,
        error,
        load,
        loading
    }
}