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
      <button class="btn btn-primary" type="submit">登入</button>
      <span> </span>
      <a href="/signup" class="btn btn-secondary">註冊</a>
      <span> </span>
      <a href="/forget_password" class="btn btn-warning">忘記密碼</a>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref(null);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// eslint-disable-next-line
const handleLogin = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await axios.post("/api/login", {
      username: username.value,
      password: password.value,
    });
    if (response.status === 200 || response.data.success) {
      await authStore.checkLoginStatus();
      const redirectPath = route.query.redirect;
      if (redirectPath) {
        await router.push(redirectPath);
      } else {
        await router.push({name: 'home'});
      }
    }
  } catch (err) {
    error.value = '帳號或密碼錯誤，請重新嘗試。';
    console.error('Login Error:', err);
  } finally {
    isLoading.value = false;
  }
};

export default {
  name: 'LoginView',
  components: {}
}
</script>
