<template>
    <h1>歡迎!</h1>
    <div v-show="!useAuthStore().isLoggedIn">
        <p>您似乎尚未登入</p>
        <p>
            <span>請先</span>
            <router-link to="/login">登入</router-link>
            <span>或</span>
            <router-link to="/signup">註冊</router-link>
        </p>
        <br>
        <p>接著</p>
    </div>
    <p>
        <span>您可以到</span>
        <router-link to="/problems">公開題目</router-link>
        <span>寫寫題目</span>
    </p>
    <p>
        <span>或到</span>
        <router-link to="/contests">競賽列表</router-link>
        <span>參與競賽</span>
    </p>
</template>

<script setup lang="ts">
import {useAuthStore} from '@/stores/auth';
import {useRoute, useRouter} from "vue-router";
import {onMounted} from "vue";
import {show_modal} from "@/utils/modal";
import {getQuery} from "@/utils/tools";

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    if (route.query.msg) {
        const msg = getQuery("msg");
        await router.replace({
            path: route.path,
            query: {}
        })
        await show_modal("訊息", msg, 3000);
    }
})
</script>
