<template>
  <div v-if="loading" class="text-center">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入資料：{{ error }}</p>
  </div>
  <!-- Only render child components if data is not null -->
  <div v-else-if="data">
    <TestResult v-if="data.pid === 'test'" :result="data" />
    <ProblemResult v-else :result="data" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import {useLoader} from "@/utils/tools";
import TestResult from "@/components/TestResult.vue";
import ProblemResult from "@/components/ProblemResult.vue";

const route = useRoute();
const sub_id = route.params.sub_id;
const {data, error, load, loading} = useLoader<any>();

const do_load = async () => {
  await load("/submission", {
    submission_id: sub_id
  });
};

onMounted(async () => {
  await do_load();
});
</script>
