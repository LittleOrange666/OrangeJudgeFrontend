<template>
  <form @submit.prevent="handleSubmit">
    <select class="form-select" aria-label="Default select example" v-model="lang">
      <option :value="lang.name" :key="lang.name" v-text="lang.name" v-for="lang in lang_info"></option>
    </select>
    <div class="mb-3">
      <label for="code-textarea" class="form-label">Code</label>
      <textarea class="form-control" v-model="code" id="code-textarea" rows="3"></textarea>
    </div>
    <div class="mb-3">
      <label for="input-textarea" class="form-label">Input</label>
      <textarea class="form-control" v-model="input" id="input-textarea" rows="3"></textarea>
    </div>
    <div class="mb-3">
      <button class="btn btn-primary mb-3">提交</button>
    </div>
    <div v-if="error" class="alert alert-danger col-5 offset-2">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useJudgeInfoStore} from '@/stores/judgeInfo';
import {storeToRefs} from 'pinia';
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";
import {default_lang} from "@/utils/constants";
import {useLocalStorage} from "@vueuse/core";

const lang = useLocalStorage("lang", default_lang);
const code = ref('');
const input = ref('');
const error = ref(null);
const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);
const router = useRouter();

const handleSubmit = async () => {
  try{
    const data = await api.post("/submission",{
      lang: lang.value,
      code: code.value,
      input: input.value,
      pid: "test"
    });
    const idx = data["submission_id"];
    const link = "/submission/" + idx;
    await router.push(link);
  }catch (err){
    error.value = err.message || '發生未知錯誤';
  }
};

onMounted(() => {
  store.fetchJudgeInfo();
});
</script>
