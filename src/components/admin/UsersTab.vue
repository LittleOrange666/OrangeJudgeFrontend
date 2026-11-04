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
        <div class="row mb-2">
            <div class="col-auto">
                <input type="text" class="form-control" placeholder="username" v-model="username">
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" v-my-click="refresh" :disabled="loading">刷新/篩選</button>
            </div>
        </div>
        <div class="card mb-3" v-if="editing">
            <div class="card-body">
                <h5 class="card-title">用戶管理：{{ editing.username }}</h5>
                <form v-my-submit="handleSave">
                    <div class="mb-2">
                        <label class="form-label" for="edit_display_name">顯示名稱</label>
                        <input type="text" class="form-control" id="edit_display_name" v-model="edit_display_name"
                               maxlength="120" required>
                    </div>
                    <div class="mb-2">
                        <label class="form-label" for="edit_password">重設密碼（留空則不修改）</label>
                        <input type="password" class="form-control" id="edit_password" v-model="edit_password"
                               minlength="6" autocomplete="new-password">
                    </div>
                    <div class="mb-2">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="edit_perm_admin" v-model="edit_admin">
                            <label class="form-check-label" for="edit_perm_admin">管理者 (admin)</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="checkbox" id="edit_perm_make_problems"
                                   v-model="edit_make_problems">
                            <label class="form-check-label" for="edit_perm_make_problems">出題者 (make_problems)</label>
                        </div>
                    </div>
                    <button class="btn btn-primary me-2">儲存</button>
                    <button type="button" class="btn btn-secondary" @click="editing = null">取消</button>
                </form>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped" v-if="ok">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">顯示名稱</th>
            <th scope="col">Email</th>
            <th scope="col">權限</th>
            <th scope="col">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in contents" :key="user.id">
            <th scope="row">{{ user.id }}</th>
            <td>{{ user.username }}</td>
            <td>{{ user.display_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.permissions.join(", ") }}</td>
            <td>
                <button type="button" class="btn btn-primary btn-sm" @click="startEdit(user)">用戶管理</button>
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
import {api} from "@/utils/tools";
import {show_modal} from "@/utils/modal";

const username = ref("");
const page_manager = usePage<UserInfo>("/admin/users", {
    username: username
});
const contents = page_manager.contents;
const ok = page_manager.ok;
const loading = page_manager.loading;
const refresh = page_manager.refresh;

const editing = ref<UserInfo | null>(null);
const edit_display_name = ref("");
const edit_password = ref("");
const edit_admin = ref(false);
const edit_make_problems = ref(false);

function startEdit(user: UserInfo) {
    editing.value = user;
    edit_display_name.value = user.display_name;
    edit_password.value = "";
    edit_admin.value = user.permissions.includes("admin");
    edit_make_problems.value = user.permissions.includes("make_problems");
}

async function handleSave() {
    if (!editing.value) return;
    const perms: string[] = [];
    if (edit_admin.value) perms.push("admin");
    if (edit_make_problems.value) perms.push("make_problems");
    try {
        await api.put("/admin/users", {
            username: editing.value.username,
            display_name: edit_display_name.value,
            password: edit_password.value,
            permissions: perms.join(";")
        });
        editing.value = null;
        await show_modal("成功", "已更新使用者資料");
        await refresh();
    } catch (err) {
        await show_modal("失敗", (err as Error).message);
    }
}

onMounted(async () => {
    await refresh();
});
</script>
