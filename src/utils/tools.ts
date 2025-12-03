import axios, {AxiosResponse} from "axios";
import {Ref, ref} from "vue";

export const toForm = function (obj?: {[key: string]: any}) {
    const f = new FormData();
    if (!obj) return f;
    for (const key in obj) {
        f.append(key, obj[key]);
    }
    return f;
};

const API_BASE_URL = '/api';

async function send_request(func: (path: string, body: any)=>Promise<AxiosResponse>,
                            path: string, obj?: {[key: string]: any}){
    if (!path.startsWith("/")) path = "/" + path;
    const response = await func(API_BASE_URL + path, toForm(obj));
    if (response.data["status"] !== "success") {
        throw new Error(response.data["description"] || response.data["message"]);
    }
    return response.data["data"];
}

export const api = {
    get: async function (path: string, obj?: {[key: string]: any}){
        if (!path.startsWith("/")) path = "/" + path;
        const response = await axios.get(API_BASE_URL + path, {
            params: obj
        });
        if (response.data["status"] !== "success") {
            throw new Error(response.data["description"] || response.data["message"]);
        }
        return response.data["data"];
    },
    post: async function (path: string, obj?: {[key: string]: any}){
        return send_request(axios.post, path, obj);
    },
    put: async function (path: string, obj?: {[key: string]: any}){
        return send_request(axios.put, path, obj);
    },
    delete: async function (path: string, obj?: {[key: string]: any}){
        return send_request(axios.delete, path, obj);
    }
};

/**
 * Converts a Unix timestamp (in seconds) to a localized date-time string.
 * @param {number|string} i The Unix timestamp in seconds.
 * @returns {string} A localized string representation of the date and time.
 */
export function timestamp_to_str(i: string | number): string {
    return new Date(+i * 1000).toLocaleString()
}

export function minute_to_str(i: string | number): string {
    const t = Math.floor(+i);
    const d = Math.floor(t / 1440);
    const h = Math.floor((t % 1440) / 60);
    const m = t % 60;
    return (d > 0 ? d + ':' : '') + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
}
interface dataLoader{
    data: Ref,
    error: Ref<string | null>,
    loading: Ref<boolean>,
    load: (path: string, obj?: {[key: string]: any}) => Promise<void>
}

export function useLoader(): dataLoader{
    const data = ref(null);
    const error = ref(null);
    const loading = ref(true);
    async function load(path: string, obj?: {[key: string]: any}){
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