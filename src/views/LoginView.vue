<template>
  <form @submit.prevent="handleLogin">
    <div class="mb-3 col-5 offset-2">
      <label for="user_id" class="form-label">User Id</label>
      <input type="text" class="form-control" id="user_id" v-model="username" placeholder="user id" required>
    </div>
    <div class="mb-3 col-5 offset-2">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" v-model="password" placeholder="Password" required>
    </div>
    <div class="mb-3 col-5 offset-2">
      <button type="submit" class="btn btn-primary" :disabled="isLoading">登入</button>
      <span>&nbsp;</span>
      <router-link to="/signup" class="btn btn-secondary">註冊</router-link>
      <span>&nbsp;</span>
      <router-link to="/forget_password" class="btn btn-secondary">忘記密碼</router-link>
    </div>
    <div v-if="error" class="alert alert-danger col-5 offset-2">{{ error }}</div>
  </form>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useAuthStore} from '@/stores/auth';
import {useRoute, useRouter} from "vue-router";
import {show_modal} from "@/utils/modal";


const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

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

const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    await authStore.login(username.value, password.value);
    await show_modal("成功", "登入成功");
    await goNext();
  } catch (err) {
    error.value = err.response?.data?.message || '帳號或密碼錯誤，請重新嘗試。';
    console.error('Login Error:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await goNext();
});
</script>
