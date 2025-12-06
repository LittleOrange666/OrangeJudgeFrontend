import axios, {AxiosError} from "axios";
import {Ref, ref} from "vue";
import {useRoute} from "vue-router";

/**
 * Custom error class for API errors.
 * Contains an optional status code from the HTTP response.
 */
export class ApiError extends Error {
    public status_code: number | null;

    constructor(message: string, status_code?: number) {
        super(message);
        this.status_code = status_code;
    }
}

/**
 * Converts a plain JavaScript object to a FormData object.
 * @param obj The object to convert.
 * @returns A FormData object.
 */
export const toForm = function (obj?: { [key: string]: any }) {
    const f = new FormData();
    if (!obj) return f;
    for (const key in obj) {
        if (obj[key] === undefined) continue;
        f.append(key, obj[key]);
    }
    return f;
};

const API_BASE_URL = '/api';

/**
 * Resolves an AxiosError into an ApiError.
 * @param err The AxiosError to resolve.
 * @returns An ApiError instance.
 */
function resolveError(err: AxiosError): ApiError {
    let message: string = err.message;
    let status_code = null;
    if (err.response) {
        if (err.response.data) {
            const data = err.response.data as { description?: string, message?: string };
            message = data.description || data.message || message;
            status_code = err.response.status;
        } else {
            message = err.message;
            status_code = err.response.status;
        }
    }
    return new ApiError(message, status_code);
}

/**
 * A wrapper around axios for making API requests.
 */
export const api = {
    /**
     * Makes a GET request to the API.
     * @param path The API path.
     * @param obj The query parameters.
     * @returns The data from the response.
     */
    get: async function (path: string, obj?: { [key: string]: any }) {
        if (!path.startsWith("/")) path = "/" + path;
        try {
            const response = await axios.get(API_BASE_URL + path, {
                params: obj
            });
            return response.data["data"];
        } catch (err) {
            console.error(err);
            throw resolveError(err as AxiosError);
        }
    },
    /**
     * Makes a POST request to the API with data as FormData.
     * @param path The API path.
     * @param obj The data to send.
     * @returns The data from the response.
     */
    post: async function (path: string, obj?: { [key: string]: any }) {
        if (!path.startsWith("/")) path = "/" + path;
        try {
            const response = await axios.post(API_BASE_URL + path, toForm(obj));
            return response.data["data"];
        } catch (err) {
            console.error(err);
            throw resolveError(err as AxiosError);
        }
    },
    /**
     * Makes a PUT request to the API with data as FormData.
     * @param path The API path.
     * @param obj The data to send.
     * @returns The data from the response.
     */
    put: async function (path: string, obj?: { [key: string]: any }) {
        if (!path.startsWith("/")) path = "/" + path;
        try {
            const response = await axios.put(API_BASE_URL + path, toForm(obj));
            return response.data["data"];
        } catch (err) {
            console.error(err);
            throw resolveError(err as AxiosError);
        }
    },
    /**
     * Makes a DELETE request to the API.
     * @param path The API path.
     * @param obj The data to send in the body.
     * @returns The data from the response.
     */
    delete: async function (path: string, obj?: { [key: string]: any }) {
        if (!path.startsWith("/")) path = "/" + path;
        try {
            const response = await axios.delete(API_BASE_URL + path, {
                data: toForm(obj)
            });
            return response.data["data"];
        } catch (err) {
            console.error(err);
            throw resolveError(err as AxiosError);
        }
    }
};

/**
 * Converts a Unix timestamp (in seconds) to a localized date-time string.
 * @param i The timestamp in seconds.
 * @returns A formatted date-time string.
 */
export function timestamp_to_str(i: string | number): string {
    return new Date(+i * 1000).toLocaleString()
}

/**
 * Converts a Date object to an ISO string in 'YYYY-MM-DDTHH:mm' format.
 * @param d The Date object.
 * @returns A formatted date string.
 */
export function date_to_str(d: Date): string {
    return d.toISOString().slice(0, 16);
}

/**
 * Converts a duration in minutes to a string format 'D:HH:MM' or 'HH:MM'.
 * @param i The duration in minutes.
 * @returns A formatted duration string.
 */
export function minute_to_str(i: string | number): string {
    const t = Math.floor(+i);
    const d = Math.floor(t / 1440);
    const h = Math.floor((t % 1440) / 60);
    const m = t % 60;
    return (d > 0 ? d + ':' : '') + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
}

/**
 * Interface for the data loader composable.
 */
interface dataLoader<T> {
    data: Ref<T | null>,
    error: Ref<string | null>,
    loading: Ref<boolean>,
    load: (path: string, obj?: { [key: string]: any }) => Promise<void>
}

/**
 * A Vue composable for loading data from an API endpoint.
 * Manages loading state, error handling, and the fetched data.
 * @returns An object with data, error, loading refs and a load function.
 */
export function useLoader<T>(): dataLoader<T> {
    const data = ref(null) as Ref<T | null>;
    const error = ref(null);
    const loading = ref(true);

    async function load(path: string, obj?: { [key: string]: any }) {
        loading.value = true;
        error.value = null;
        data.value = null;
        try {
            data.value = await api.get(path, obj);
        } catch (err: any) {
            error.value = err.message;
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

/**
 * Gets a route parameter from vue-router.
 * @param name The name of the parameter.
 * @param default_val The default value if the parameter is not found.
 * @returns The parameter value or the default value.
 */
export function getParam(name: string, default_val: string = ""): string {
    const route = useRoute();
    if (!route) {
        console.warn(`getParam(${name}) is called outside of a component's setup context. Returning default value.`);
        return default_val;
    }
    const res = route.params[name];
    if (!res) return default_val;
    if (typeof res === "string") return res;
    if (res.length === 0) return default_val;
    return res[0];
}

/**
 * Gets a query parameter from the URL.
 * @param name The name of the query parameter.
 * @param default_val The default value if the parameter is not found.
 * @returns The query parameter value or the default value.
 */
export function getQuery(name: string, default_val: string = ""): string {
    const route = useRoute();
    if (!route) {
        console.warn(`getQuery(${name}) is called outside of a component's setup context. Returning default value.`);
        return default_val;
    }
    const res = route.query[name];
    if (!res) return default_val;
    if (typeof res === "string") return res;
    if (Array.isArray(res) && res.length > 0 && typeof res[0] === 'string') {
        return res[0];
    }
    return default_val;
}
