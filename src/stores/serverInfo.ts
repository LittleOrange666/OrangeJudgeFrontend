import {defineStore} from 'pinia';
import {api} from "@/utils/tools";

export const useServerInfoStore = defineStore('serverInfo', {
    state: () => ({
        server_info: [],
        hasFetched: false, // 標記是否已經擷取過資料
        error: null,
    }),
    actions: {
        async fetchServerInfo() {
            // 如果已經擷取過，就直接返回，不再發送請求
            if (this.hasFetched) {
                return;
            }

            try {
                this.server_info = await api.get('/server_info');
            } catch (err) {
                console.error('無法取得 server info:', err);
                this.error = err.message || '發生未知錯誤';
            } finally {
                // 無論成功或失敗，都標記為已擷取，避免重複發送無效請求
                this.hasFetched = true;
            }
        },
    },
});
