import axios, {AxiosError} from "axios";
import {Ref, ref} from "vue";
import {useRoute} from "vue-router";

export class ApiError extends Error {
    public status_code: number | null;

    constructor(message: string, status_code?: number) {
        super(message);
        this.status_code = status_code;
    }
}

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


function resolveError(err: AxiosError) {
    let message: string = err.message;
    let status_code = null;
    if (err.response) {
        if (err.response.data) {
            const data = err.response.data;
            message = data["description"] || data["message"] || message;
            status_code = err.response.status;
        } else {
            message = err.message;
            status_code = err.response.status;
        }
    }
    return new ApiError(message, status_code);
}

export const api = {
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

export function timestamp_to_str(i: string | number): string {
    return new Date(+i * 1000).toLocaleString()
}

export function date_to_str(d: Date): string {
    return d.toISOString().slice(0, 16);
}

export function minute_to_str(i: string | number): string {
    const t = Math.floor(+i);
    const d = Math.floor(t / 1440);
    const h = Math.floor((t % 1440) / 60);
    const m = t % 60;
    return (d > 0 ? d + ':' : '') + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
}

interface dataLoader<T> {
    data: Ref<T | null>,
    error: Ref<string | null>,
    loading: Ref<boolean>,
    load: (path: string, obj?: { [key: string]: any }) => Promise<void>
}

export function useLoader<T>(): dataLoader<T> {
    const data = ref(null);
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

export function getQuery(name: string, default_val: string = ""): string {
    const route = useRoute();
    if (!route) {
        console.warn(`getQuery(${name}) is called outside of a component's setup context. Returning default value.`);
        return default_val;
    }
    const res = route.query[name];
    if (!res) return default_val;
    if (typeof res === "string") return res;
    if (res.length === 0) return default_val;
    return res[0];
}