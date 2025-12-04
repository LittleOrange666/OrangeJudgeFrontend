export const can_filter_results: [string, string][] = [
    ["OK", "通過"],
    ["WA", "錯誤答案"],
    ["PE", "格式錯誤"],
    ["TLE", "超時"],
    ["MLE", "記憶體超限"],
    ["RE", "執行期間錯誤"],
    ["CE", "編譯錯誤"],
    ["FAIL", "評測失敗"],
    ["PARTIAL", "部分正確"],
    ["PENDING", "等待中"],
    ["JE", "系統錯誤"],
    ["RF", "評測被拒絕"]
]
export const default_lang = "C++17";
const result_css_class_table: { [key: string]: string } = {
    "OK": "table-success",
    "WA": "table-danger",
    "MLE": "table-warning",
    "TLE": "table-info",
};
export const result_css_class = (result: string) => {
    if (result in result_css_class_table) return result_css_class_table[result];
    else return "table-secondary";
};
export const default_page_size = "12";
export const contest_status_text: { [key: string]: string } = {
    "practice": "練習模式",
    "waiting_virtual": "等待模擬競賽開始",
    "waiting": "等待競賽開始",
    "running": "競賽進行中",
    "running_virtual": "模擬競賽進行中",
    "guest": "僅觀看",
    "testing": "測試模式"
};