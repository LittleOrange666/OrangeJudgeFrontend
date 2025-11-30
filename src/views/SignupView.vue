<template>
  <form @submit.prevent="handleSignup">
    <div class="mb-3 col-7 offset-2">
      <label for="email" class="form-label">電子信箱</label>
      <div class="input-group mb-3">
        <input type="email" class="form-control" id="email" v-model="email" placeholder="email" required>
        <button class="btn btn-outline-secondary" type="button" v-on:click="getCode" v-if="need_verify">取得驗證碼</button>
      </div>
    </div>
    <div class="mb-3 col-7 offset-2" v-if="need_verify">
      <label for="verify" class="form-label">驗證碼</label>
      <input type="text" class="form-control" id="verify" v-model="verify" placeholder="驗證碼" required>
    </div>
    <div class="mb-3 col-7 offset-2">
      <label for="user_id" class="form-label">User Id</label>
      <input type="text" class="form-control" id="user_id" v-model="username" placeholder="user id" required
             pattern="^[A-Za-z0-9_]{2,80}$">
    </div>
    <div class="mb-3 col-7 offset-2">
      <label for="password" class="form-label">密碼</label>
      <input type="password" class="form-control" id="password" v-model="password" placeholder="密碼" required
             pattern="^.{6,}$">
    </div>
    <div class="mb-3 col-7 offset-2">
      <label for="password_again" class="form-label">重複密碼</label>
      <input type="password" class="form-control" id="password_again" v-model="password_again" placeholder="重複密碼"
             required>
    </div>
    <div class="mb-3 col-7 offset-2">
      <button class="btn btn-primary submitter" id="do_signup_btn" data-msg-type-400="return">註冊</button>
    </div>
    <div v-if="error" class="alert alert-danger col-5 offset-2">{{ error }}</div>
  </form>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useServerInfoStore} from "@/stores/serverInfo";
import {useRoute, useRouter} from "vue-router";
import {api} from "@/utils/tools";
import {show_modal} from "@/utils/modal";

const username = ref('');
const password = ref('');
const verify = ref('');
const email = ref('');
const password_again = ref('');
const isLoading = ref(false);
const error = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const need_verify = computed(()=> useServerInfoStore().server_info["need_verify"]);

const goNext = async () => {
  if (authStore.isLoggedIn) {
    const redirectPath = route.query.redirect;
    if (redirectPath) {
      await router.push(redirectPath);
    } else {
      await router.push({name: 'home'});
    }
  }
}

const getCode = async () => {
  try {
    await api.post("/accounts/get_code", {
      email: email.value
    });
    show_modal("成功", "驗證碼已發送至'" + email.value + "'，十分鐘內有效");
  } catch (error) {
    show_modal("錯誤", "獲取失敗");
  }
};

const handleSignup = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    await api.post("/accounts/signup", {
      user_id: username.value,
      password: password.value,
      password_again: password_again.value,
      email: email.value,
      verify: verify.value
    })
    await authStore.checkLoginStatus(true);
    await goNext();
  } catch (err) {
    error.value = err.response?.data?.message || '帳號或密碼錯誤，請重新嘗試。';
    console.error('Signup Error:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await useServerInfoStore().fetchServerInfo();
  await goNext();
});
</script>
