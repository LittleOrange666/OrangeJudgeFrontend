import axios from "axios";

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
 * @param {Function} func The axios method to call (e.g., axios.get, axios.post).
 * @param {string} path The API endpoint path.
 * @param {Object<string, any>} [obj] The data to be sent, which will be converted to FormData.
 * @returns {Promise<any>} A promise that resolves with the "data" field of the API response.
 * @throws {Error} Throws an error with the "description" from the API response if the request fails.
 */
async function send_request(func, path, obj){
    if (!path.startsWith("/")) path = "/" + path;
    const response = await func(API_BASE_URL + path, toForm(obj));
    if (response.data["status"] !== "success") {
        throw new Error(response.data["description"]);
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
        return send_request(axios.get, path, obj);
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
