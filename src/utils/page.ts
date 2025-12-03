// 導入 Vue 和專案相關的工具和常數
import {useRoute} from "vue-router";
import {computed, ComputedRef, Ref, ref} from "vue";
import {useLoader} from "@/utils/tools";
import {default_page_size} from "@/utils/constants";

interface PageManager<T> {
    to_page: (page: string|number) => Promise<void>,
    refresh: () => Promise<void>,
    loading: Ref<boolean>,
    error: Ref<string>,
    contents: ComputedRef<T[]>,
    page: Ref<string>,
    show_pages: ComputedRef<string[]>,
    ok: ComputedRef<boolean>,
    page_cnt: ComputedRef<string>,
}

interface PageResult<T> {
    data?: T[],
    show_pages?: string[],
    page_count?: string
}

function safe_page(page: string|string[]|null): string{
    if (!page) return "1";
    if (typeof page === "string") return page;
    return page[0];
}


export function usePage<T>(path: string, args?: {[key: string]: any}, on_load?: (page: string) => Promise<void>): PageManager<T> {
    // 獲取當前路由實例
    const route = useRoute();
    // 當前頁碼，從路由查詢參數或預設為 "1"
    const page: Ref<string> = ref(safe_page(route.query.page));
    // 使用 useLoader 來處理數據加載、錯誤和加載狀態
    const {data, error, load, loading} = useLoader<PageResult<T>>();
    // 自定義的加載狀態，用於防止重複加載
    const my_loading = ref(false);
    // 計算屬性，返回要顯示的頁碼陣列
    const show_pages = computed(()=>data && data.value && data.value.show_pages || []);
    // 計算屬性，返回當前頁的數據內容
    const contents = computed(()=>data && data.value && data.value.data || []);
    const ok = computed(()=>!loading.value && !error.value);
    const page_cnt = computed(()=>data && data.value && data.value.page_count || "1");

    /**
     * 加載指定頁碼的數據。
     * @param {string|number} page_val - 要加載的頁碼。
     */
    const do_load = async (page_val: string | number) => {
        if (my_loading.value) return;
        my_loading.value = true;
        page.value = ""+page_val;
        // 構建 API 請求的查詢參數
        const get_args: {[key: string]: any} = {
            page: page.value,
            page_size: default_page_size
        }
        // 將額外的參數添加到請求中
        if (args) {
            for (const key in args) {
                get_args[key] = args[key].value;
            }
        }
        // 調用加載器加載數據
        await load(path, get_args);
        // 如果 API 回應中包含頁碼，則更新當前頁碼
        if (data && data.value && data.value["page"] && ""+page.value !== ""+data.value["page"]) page.value = data.value["page"];
        // 如果有回調函數，則在數據加載後執行
        if (on_load) await on_load(page.value);
        my_loading.value = false;
    };

    /**
     * 重新加載當前頁的數據。
     */
    const refresh = async () => {
        await do_load(page.value);
    }

    // 返回供組件使用的狀態和方法
    return {
        to_page: do_load, // 跳轉到指定頁
        refresh: refresh, // 刷新當前頁
        loading: my_loading, // 原始的加載狀態
        error: error, // 錯誤訊息
        contents: contents, // 當前頁的數據
        page: page, // 當前頁碼
        show_pages: show_pages, // 要顯示的頁碼陣列
        ok: ok, // 是否加載成功
        page_cnt: page_cnt
    }
}
