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
    <h1>題目管理</h1>
    <table class="table table-hover table-striped" v-if="ok">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">名稱</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="content in contents" :key="content.pid">
            <th scope="row">
                <router-link :to="`/admin/problem/${content.pid}`">{{ content.pid }}</router-link>
            </th>
            <td>
                <router-link :to="`/admin/problem/${content.pid}`">{{ content.name }}</router-link>
            </td>
        </tr>
        </tbody>
    </table>
    <PageBar :page_manager="page_manager"/>
    <form v-my-submit="create_problem">
        <div class="mb-3">
            <label for="title_input" class="form-label">題目ID(留空會自動生成)</label>
            <input type="text" class="form-control" id="pid_input" v-model="pid">
        </div>
        <div class="mb-3">
            <label for="title_input" class="form-label">題目名稱</label>
            <input type="text" class="form-control" id="title_input" required v-model="title">
        </div>
        <button class="btn btn-primary">
            儲存
        </button>
    </form>
</template>
<script setup lang="ts">
import {usePage} from "@/utils/page";
import PageBar from "@/components/PageBar.vue";
import {onMounted, ref} from "vue";
import {ProblemSummary} from "@/utils/datatypes";
import {show_modal} from "@/utils/modal";
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";

interface CreateProblemResponse{
    pid: string
}

const manageable = ref("true");
const page_manager = usePage<ProblemSummary>("/problem", {
    manageable: manageable
});
const ok = page_manager.ok;
const contents = page_manager.contents;
const title = ref("");
const pid = ref("");
async function create_problem(){
    try {
        const res: CreateProblemResponse = await api.post("/problem",{
            "pid": pid.value,
            "name": title.value
        })
        const res_pid = res.pid;
        const router = useRouter();
        await router.push("/admin/problem/"+res_pid);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}
onMounted(async () => {
    await page_manager.refresh();
});
</script>