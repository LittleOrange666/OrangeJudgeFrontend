/**
 * Represents the mapping of result codes to their corresponding display names.
 * Each entry is a tuple where the first element is the result code (in English)
 * and the second element is the display name (in Chinese).
 */
export const can_filter_results: [string, string][] = [
    ["OK", "通過"], // Passed
    ["WA", "錯誤答案"], // Wrong Answer
    ["PE", "格式錯誤"], // Presentation Error
    ["TLE", "超時"], // Time Limit Exceeded
    ["MLE", "記憶體超限"], // Memory Limit Exceeded
    ["RE", "執行期間錯誤"], // Runtime Error
    ["CE", "編譯錯誤"], // Compilation Error
    ["FAIL", "評測失敗"], // Evaluation Failed
    ["PARTIAL", "部分正確"], // Partially Correct
    ["PENDING", "等待中"], // Pending
    ["JE", "系統錯誤"], // System Error
    ["RF", "評測被拒絕"] // Judgement Rejected
];

/**
 * The default programming language used in the system.
 */
export const default_lang = "C++17";

/**
 * Maps result codes to their corresponding CSS class names for styling purposes.
 */
const result_css_class_table: { [key: string]: string } = {
    "OK": "table-success", // Passed
    "WA": "table-danger", // Wrong Answer
    "MLE": "table-warning", // Memory Limit Exceeded
    "TLE": "table-info", // Time Limit Exceeded
};

/**
 * Retrieves the CSS class name for a given result code.
 * If the result code is not found in the mapping, a default class is returned.
 *
 * @param {string} result - The result code to look up.
 * @returns {string} The corresponding CSS class name.
 */
export const result_css_class = (result: string) => {
    if (result in result_css_class_table) return result_css_class_table[result];
    else return "table-secondary"; // Default CSS class
};

/**
 * The default number of items displayed per page.
 */
export const default_page_size = "12";

/**
 * Maps contest statuses to their corresponding display names in Chinese.
 */
export const contest_status_text: { [key: string]: string } = {
    "practice": "練習模式", // Practice Mode
    "waiting_virtual": "等待模擬競賽開始", // Waiting for Virtual Contest to Start
    "waiting": "等待競賽開始", // Waiting for Contest to Start
    "running": "競賽進行中", // Contest Running
    "running_virtual": "模擬競賽進行中", // Virtual Contest Running
    "guest": "僅觀看", // Guest Mode
    "testing": "測試模式" // Testing Mode
};