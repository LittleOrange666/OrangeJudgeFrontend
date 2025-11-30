<template>
  <div v-if="loading" class="text-center">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入資料：{{ error }}</p>
  </div>
  <!-- Only render child components if sub_data is not null -->
  <div v-else-if="sub_data">
    <TestResult v-if="sub_data.pid === 'test'" :result="sub_data" />
    <ProblemResult v-else :result="sub_data" />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { api } from "@/utils/tools";
import TestResult from "@/components/TestResult.vue";
import ProblemResult from "@/components/ProblemResult.vue";

const route = useRoute();
const sub_id = route.params.sub_id;
const loading = ref(true);
const error = ref(null);
// Initialize with null to better represent "no data yet"
const sub_data = ref(null);

const do_load = async () => {
  loading.value = true;
  error.value = null; // Reset error on reload
  try {
    sub_data.value = await api.get("/submission", {
      submission_id: sub_id
    });
  } catch (err) {
    error.value = err.message || '發生未知錯誤';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await do_load();
});
</script>
