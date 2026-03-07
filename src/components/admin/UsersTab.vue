<!--
  - OrangeJudge, a competitive programming platform
  -
  - Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published
  - by the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -->

<template>
    <div>
        <div class="row">
            <div class="col-auto">
                <input type="text" class="form-control" placeholder="username" v-model="username">
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" v-my-click="refresh" :disabled="loading">刷新/篩選</button>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped" v-if="ok">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user,i) in contents" :key="i">
            <th scope="row">{{ user.id }}</th>
            <td><a href="/user/{{ user.username }}" target="_blank">{{ user.username }}</a></td>
            <td>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#user_manage"
                        data-username="{{ user.username }}" data-permissions="{{ user.permissions }}"
                        data-displayname="{{ user.display_name }}">用戶管理
                </button>
            </td>
        </tr>
        </tbody>
    </table>
    <PageBar :page_manager="page_manager"/>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {usePage} from "@/utils/page";
import PageBar from "@/components/PageBar.vue";
import {UserInfo} from "@/utils/datatypes";

const username = ref("");
const page_manager = usePage<UserInfo>("/admin/users", {
    username: username
});
const contents = page_manager.contents;
const ok = page_manager.ok;
const loading = page_manager.loading;
const refresh = page_manager.refresh;

onMounted(async () => {
    await refresh();
});
</script>