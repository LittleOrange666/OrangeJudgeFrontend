<!--
  - Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published
  - by the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -->

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