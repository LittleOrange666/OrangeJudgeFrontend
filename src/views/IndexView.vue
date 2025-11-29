<template>
  <h1>歡迎!</h1>
  <div v-show="!useAuthStore().isLoggedIn">
    <p>您似乎尚未登入</p>
    <p>請先<router-link to="/login">登入</router-link>或<router-link to="/signup">註冊</router-link></p>
    <br>
    <p>接著</p>
  </div>
  <p>您可以到<a href="/problems">公開題目</a>寫寫題目</p>
  <p>或到<a href="/contests">競賽列表</a>參與競賽</p>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
</script>
