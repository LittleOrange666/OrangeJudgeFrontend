<template>
    <div>
        <h3>題敘預覽</h3>
        <div v-if="loading" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
            <p>無法載入頁面：{{ error }}</p>
        </div>
        <div v-else v-html="data"></div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {getParam} from "@/utils/tools";
import axios from "axios";

const data = ref("");
const error = ref(null);
const loading = ref(true);
const pid = getParam("pid");
onMounted(async () => {
    try {
        const res = await axios.get("/api/problem/" + pid + "/manage/preview?type=statement");
        data.value = res.data;
    } catch (error) {
        error.value = error.message;
    }
    loading.value = false;
});
</script>