<!--
  - OrangeJudge, a competitive programming platform
  -
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
    <div v-if="loading" class="text-center">
        <p>Loading...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
        <p>無法載入頁面：{{ error }}</p>
    </div>
    <div v-else>
        {{ data.content }}
    </div>
</template>

<script setup lang="ts">
import {getParam, useLoader} from "@/utils/tools";
import {LogInfo} from "@/utils/datatypes"
import {onMounted} from "vue";

const log_id = getParam("log_id");

const {data, error, loading, load} = useLoader<LogInfo>();
onMounted(async () => {
    await load("/admin/log/" + log_id);
});
</script>

<style scoped>

</style>