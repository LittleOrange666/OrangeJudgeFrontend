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
    <h1>公開題目</h1>
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
                <router-link :to="`/problem/${content.pid}`">{{ content.pid }}</router-link>
            </th>
            <td>
                <router-link :to="`/problem/${content.pid}`">{{ content.name }}</router-link>
            </td>
        </tr>
        </tbody>
    </table>
    <PageBar :page_manager="page_manager"/>
</template>
<script setup lang="ts">
import {usePage} from "@/utils/page";
import PageBar from "@/components/PageBar.vue";
import {onMounted} from "vue";
import {ProblemSummary} from "@/utils/datatypes";

const page_manager = usePage<ProblemSummary>("/problem");
const ok = page_manager.ok;
const contents = page_manager.contents;
onMounted(async () => {
    await page_manager.refresh();
});
</script>