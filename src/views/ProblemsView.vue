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