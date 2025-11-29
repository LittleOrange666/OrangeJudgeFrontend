import { defineStore } from 'pinia';
import axios from 'axios';

export const useJudgeInfoStore = defineStore('judgeInfo', {
  state: () => ({
    lang_info: [],
    hasFetched: false, // 標記是否已經擷取過資料
    error: null,
  }),
  actions: {
    async fetchJudgeInfo() {
      // 如果已經擷取過，就直接返回，不再發送請求
      if (this.hasFetched) {
        return;
      }

      try {
        const response = await axios.get('/api/judge_info');
        if (response.data && response.data.data && Array.isArray(response.data.data.langs)) {
          this.lang_info = response.data.data.langs;
          this.error = null;
        } else {
          throw new Error('從 API 回傳的資料格式不正確');
        }
      } catch (err) {
        console.error('無法取得 judge info:', err);
        this.error = err.message || '發生未知錯誤';
      } finally {
        // 無論成功或失敗，都標記為已擷取，避免重複發送無效請求
        this.hasFetched = true;
      }
    },
  },
});
