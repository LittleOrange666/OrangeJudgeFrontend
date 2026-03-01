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