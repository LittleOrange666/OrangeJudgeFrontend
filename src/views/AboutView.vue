<template>
  <div class="about">
    <h1>編譯與執行參數</h1>
    <div v-if="isLoading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
      <p>無法載入資料：{{ error }}</p>
    </div>
    <div v-else>
      <div class="card" v-for="lang in lang_info" :key="lang.name">
        <div class="card-body">
          <h5 class="card-title">{{ lang.name }}</h5>
          <div v-if="lang.compile">
            <h6 class="card-subtitle mb-2 text-muted">編譯指令</h6>
            <p class="card-text">{{ lang.compile }}</p>
          </div>
          <h6 class="card-subtitle mb-2 text-muted">執行指令</h6>
          <p class="card-text">{{ lang.run }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const lang_info = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('/api/judge_info');
    if (response.data && response.data.data && Array.isArray(response.data.data.langs)) {
      lang_info.value = response.data.data.langs;
    } else {
      throw new Error('從 API 回傳的資料格式不正確');
    }
  } catch (err) {
    console.error('無法取得 judge info:', err);
    error.value = err.message || '發生未知錯誤';
  } finally {
    isLoading.value = false;
  }
});
</script>
