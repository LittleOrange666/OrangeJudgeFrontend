<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">OrangeJudge</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent" style="justify-content: space-between;">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 d-flex" id="navbarFirstBlock">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link active">首頁</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/problems" class="nav-link active">公開題目</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/contests" class="nav-link active">競賽列表</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/test" class="nav-link active">測試</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/status" class="nav-link active">解題動態</router-link>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                           data-bs-toggle="dropdown"
                           aria-expanded="false">
                            關於
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li>
                                <router-link to="/about" class="dropdown-item">評測系統</router-link>
                            </li>
                            <li><a class="dropdown-item" href="https://LittleOrange666.github.io/orangejudge/">教程</a>
                            </li>
                            <li><a class="dropdown-item" href="/api/api-docs">API</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="navbar-nav navbar-text">
                    <li class="nav-item" v-if="!isLoggedIn">
                        <router-link to="/login" class="nav-link active">登入</router-link>
                    </li>
                    <li class="nav-item dropdown" v-if="isLoggedIn">
                        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
                           aria-expanded="false">{{ authStore.display_name }}</a>
                        <ul class="dropdown-menu">
                            <li>
                                <router-link class="dropdown-item" :to="`/user/${authStore.username}`">個人頁面
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" :to="`/status?user=${authStore.username}`">解題列表
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/settings">帳號設定</router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" to="/preferences">偏好設定</router-link>
                            </li>
                            <li v-if="hasProblemPermission">
                                <hr class="dropdown-divider">
                            </li>
                            <li v-if="hasProblemPermission">
                                <router-link class="dropdown-item" to="/problemsetting/my">我的題目</router-link>
                            </li>
                            <li v-if="hasAdminPermission">
                                <router-link class="dropdown-item" to="/problemsetting">所有題目</router-link>
                            </li>
                            <li v-if="hasRootPermission">
                                <hr class="dropdown-divider">
                            </li>
                            <li v-if="hasRootPermission">
                                <router-link class="dropdown-item" to="/admin">管理介面</router-link>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <a @click.prevent="authStore.logout()" href="#" class="nav-link active">登出</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import {useAuthStore} from '@/stores/auth';
import {isLoggedIn, hasRootPermission, hasAdminPermission, hasProblemPermission} from "@/utils/accounts";

const authStore = useAuthStore();
</script>
