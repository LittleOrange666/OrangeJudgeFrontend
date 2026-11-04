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
        <p class="text-muted">
            上傳 .csv 或 .xlsx 檔案批次建立帳號。若第一列為標題，需包含 <code>username</code> 與 <code>password</code>
            欄，可選 <code>email</code>、<code>display_name</code> 欄；沒有標題列時欄位順序為
            username, password, email, display_name。
        </p>
        <form v-my-submit="handleParse">
            <div class="row mb-3">
                <div class="col-auto">
                    <input type="file" class="form-control" accept=".csv, .xlsx" ref="fileInput" required>
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary">解析檔案</button>
                </div>
            </div>
        </form>
        <div v-if="parsed">
            <div class="alert alert-warning" v-if="parsed.existed.length > 0">
                以下帳號的使用者名稱或 email 已存在，將被略過：
                {{ parsed.existed.map(o => o[0]).join(", ") }}
            </div>
            <div v-if="parsed.users.length > 0">
                <h5>將建立 {{ parsed.users.length }} 個帳號</h5>
                <table class="table table-hover table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">username</th>
                        <th scope="col">password</th>
                        <th scope="col">email</th>
                        <th scope="col">display_name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(user, i) in parsed.users" :key="i">
                        <th scope="row">{{ i + 1 }}</th>
                        <td>{{ user[0] }}</td>
                        <td>{{ user[1] }}</td>
                        <td>{{ user[2] || "(自動產生)" }}</td>
                        <td>{{ user[3] }}</td>
                    </tr>
                    </tbody>
                </table>
                <button class="btn btn-success" v-my-click="handleCreate">確認建立</button>
            </div>
            <div v-else class="alert alert-info">沒有可以建立的帳號</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {api} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {ParsedUsers} from "@/utils/datatypes";

const fileInput = ref<HTMLInputElement | null>(null);
const parsed = ref<ParsedUsers | null>(null);

async function handleParse() {
    const file = fileInput.value?.files?.[0];
    if (!file) {
        await show_modal("失敗", "請選擇檔案");
        return;
    }
    try {
        parsed.value = await api.post("/admin/users/parse", {file: file});
    } catch (err) {
        parsed.value = null;
        await show_modal("失敗", (err as Error).message);
    }
}

async function handleCreate() {
    if (!parsed.value || parsed.value.users.length === 0) return;
    try {
        const data = await api.post("/admin/users", {users: JSON.stringify(parsed.value.users)});
        parsed.value = null;
        if (fileInput.value) fileInput.value.value = "";
        await show_modal("成功", "已建立 " + data.created + " 個帳號");
    } catch (err) {
        await show_modal("失敗", (err as Error).message);
    }
}
</script>
