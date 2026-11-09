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
    <form v-my-submit="handleSubmit">
        <div class="mb-3">
            <p>
                這是一題 Output Only 題目，共有 {{ testcaseCount }} 筆測資。
                <a :href="inputsLink" download>下載所有輸入檔 (input_1.txt ~ input_{{ testcaseCount }}.txt)</a>
            </p>
            <p class="text-muted">
                請上傳 output_&lt;k&gt;.txt 檔案（可多選），或是包含這些檔案的 zip 壓縮檔。
                未上傳的測資會沿用上一次提交的輸出。
            </p>
            <label for="outputFiles" class="form-label">輸出檔</label>
            <input class="form-control" type="file" id="outputFiles" multiple accept=".txt,.zip"
                   v-on:change="loadFiles"/>
        </div>
        <ul v-if="files.length">
            <li v-for="file in files" :key="file.name">{{ file.name }} ({{ file.size }} bytes)</li>
        </ul>
        <div class="mb-3">
            <button class="btn btn-primary mb-3" :disabled="!files.length">提交</button>
        </div>
        <div v-if="error" class="alert alert-danger col-5 offset-2">{{ error }}</div>
    </form>
</template>
<script setup lang="ts">
import {computed, defineProps, ref} from 'vue';
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";

interface Props {
    pid: string,
    cid?: string,
    testcaseCount: number
}

const props = defineProps<Props>();

const router = useRouter();

const files = ref<File[]>([]);
const error = ref(null);

const inputsLink = computed(() => {
    let link = "/api/problem/" + props.pid + "/inputs";
    if (props.cid) link += "?cid=" + encodeURIComponent(props.cid);
    return link;
});

function loadFiles(event: Event) {
    const target = event.target as HTMLInputElement;
    files.value = target.files ? Array.from(target.files) : [];
}

const handleSubmit = async () => {
    try {
        const data = await api.post("/submission", {
            pid: props.pid,
            cid: props.cid,
            outputs: files.value
        });
        const idx = data["submission_id"];
        await router.push("/submission/" + idx);
    } catch (err) {
        error.value = err.message || '發生未知錯誤';
    }
};
</script>
