<template>
  <div class="row">
    <div class="col-auto">
      <input type="text" class="form-control" placeholder="題目編號" v-model="pid">
    </div>
    <div class="col-auto">
      <input type="text" class="form-control" placeholder="使用者id" v-model="username">
    </div>
    <div class="col-auto">
      <select class="form-select" v-model="lang">
        <option value="">(語言)</option>
        <option :value="lang.name" :key="lang.name" v-text="lang.name" v-for="lang in lang_info"></option>
      </select>
    </div>
    <div class="col-auto">
      <select class="form-select" v-model="result">
        <option value="">(結果)</option>
        <option :value="result[0]" :key="result[0]" v-text="result[1]" v-for="result in can_filter_results"></option>
      </select>
    </div>
    <div class="col-auto">
      <button class="btn btn-primary" v-on:click="refresh" :disabled="loading">篩選</button>
    </div>
    <div class="col-auto" v-if="hasAdminPermission">
      <button class="btn btn-primary" v-on:click="rejudge" :disabled="loading">Rejudge</button>
    </div>
  </div>
  <div v-if="loading" class="text-center">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入資料：{{ error }}</p>
  </div>
  <table class="table table-hover table-striped" v-if="!loading && !error">
    <thead>
    <tr>
      <th scope="col">解題編號</th>
      <th scope="col">時間</th>
      <th scope="col">提交者</th>
      <th scope="col">題目</th>
      <th scope="col">語言</th>
      <th scope="col">結果</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="content in contents" :key="content['id']">
      <th scope="row"><router-link :to="`/submission/${content['id']}`">{{ content["id"] }}</router-link></th>
      <td>{{ timestamp_to_str(content["time"]) }}</td>
      <td><router-link :to="`/user/${content['user_id']}`">{{ content["user_name"] }}</router-link></td>
      <td><router-link :to="`/problem/${content['problem_id']}`">{{ content["problem_id"] }}. {{ content["problem_name"] }}</router-link></td>
      <td>{{ content["lang"] }}</td>
      <td>{{ content["result"] }}</td>
    </tr>
    </tbody>
  </table>
  <nav aria-label="Page navigation example" v-if="!loading && !error">
    <ul class="pagination" id="status_page">
      <li class="page-item" :key="pages" v-for="pages in show_pages">
        <a class="page-link" v-on:click="changePage(pages)" v-text="pages"></a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {storeToRefs} from "pinia";
import {hasAdminPermission} from "@/utils/accounts";
import {can_filter_results} from "@/utils/constants";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api, timestamp_to_str} from "@/utils/tools";
import {show_modal} from "@/utils/modal";

const route = useRoute();
const router = useRouter();
const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);
const pid = ref(route.query.pid || "");
const username = ref(route.query.user || "");
const lang = ref(route.query.lang || "");
const result = ref(route.query.result || "");
const page = ref(route.query.page || "1");
const loading = ref(true);
const error = ref(null);
const show_pages = ref([]);
const contents = ref([]);

const rejudge = async () => {
  try{
    await api.post("/rejudge_all", {
      pid: pid.value,
      user: username.value,
      lang: lang.value,
      result: result.value,
    });
  }catch (err){
    await show_modal("錯誤", err);
    return;
  }
  await show_modal("成功", "成功重新評測");
  await refresh();
};

const refresh = async () => {
  loading.value = true;
  if (isNaN(Number(page.value)) || Number(page.value) <= 0) {
    page.value = "1";
  }
  await router.replace({
    path: route.path,
    query: {
      pid: pid.value,
      user: username.value,
      lang: lang.value,
      result: result.value,
      page: page.value,
    }
  });
  try{
    const data = await api.get("/status", {
      pid: pid.value,
      user: username.value,
      lang: lang.value,
      result: result.value,
      page: page.value,
      page_size: "12"
    });
    page.value = data["page"];
    show_pages.value = data["show_pages"];
    contents.value = data["data"]
  }catch (err){
    error.value = err || '發生未知錯誤';
  }
  loading.value = false;
};

const changePage = async (page_num) => {
  page.value = page_num;
  await refresh();
};

onMounted(async () =>{
  await store.fetchJudgeInfo();
  await refresh();
});

</script>
