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
export const default_lang: string = "C++17";
const result_css_class_table = {
    "OK": "table-success",
    "WA": "table-danger",
    "MLE": "table-warning",
    "TLE": "table-info",
};
export function result_css_class(result: string): string {
    if (result in result_css_class_table) return result_css_class_table[result];
    else return "table-secondary";
}
export const default_page_size = "12";