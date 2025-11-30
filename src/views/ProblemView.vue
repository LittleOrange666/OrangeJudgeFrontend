<template>
  <div v-if="data">
    <h1 class="text-center">{{ data["title"] }}</h1>
    <p class="text-center">Time Limit:{{ data["time_limit"] }}ms</p>
    <p class="text-center">Memory Limit:{{ data["memory_limit"] }}MB</p>
    <div v-html="data['statement_html']"></div>
    <div class="container test-case" v-for="(sample,i) in data['samples']" :key="i">
      <div class="row">
        <div class="col"><h3>範例輸入 #{{ i + 1 }}</h3></div>
        <div class="col"><h3>範例輸出 #{{ i + 1 }}</h3></div>
      </div>
      <div class="row">
        <div class="col">
          <pre class="can-copy">{{ sample.input }}</pre>
        </div>
        <div class="col">
          <pre class="can-copy">{{ sample.output }}</pre>
        </div>
      </div>
    </div>
    <CodeSubmit :pid="data['pid']" v-if="isLoggedIn" />
    <div v-else class="alert alert-info">
      <p>需要登入才能提交程式碼</p>
    </div>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入題目：{{ error }}</p>
  </div>
  <div v-else class="text-center">
    <p>Loading...</p>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {api} from "@/utils/tools";
import CodeSubmit from "@/components/CodeSubmit.vue";
import {isLoggedIn} from "@/utils/accounts";

const data = ref(null);
const error = ref(null);

const route = useRoute();
const pid = route.params.pid;

const do_load = async () => {
  try {
    data.value = await api.get("/problem/" + pid);
  } catch (err) {
    error.value = err;
  }
};

onMounted(async () => {
  await do_load();
});
</script>