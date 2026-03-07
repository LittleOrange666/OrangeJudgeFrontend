<!--
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
    <div v-if="data">
        <h1 class="text-center">{{ data.title }}</h1>
        <p class="text-center">Time Limit:{{ data.time_limit }}ms</p>
        <p class="text-center">Memory Limit:{{ data.memory_limit }}MB</p>
        <div v-html="data.statement_html" id="main_content" v-math></div>
        <div class="container test-case" v-for="(sample,i) in data.samples" :key="i">
            <div class="row">
                <div class="col"><h3>範例輸入 #{{ i + 1 }}</h3></div>
                <div class="col"><h3>範例輸出 #{{ i + 1 }}</h3></div>
            </div>
            <div class="row">
                <div class="col">
                    <pre class="can-copy">{{ sample.input }}</pre>
                </div>
                <div class="col">
                    <pre class="can-copy">{{ sample.output }}</pre>
                </div>
            </div>
        </div>
        <CodeSubmit :pid="data.pid" v-if="isLoggedIn" :allowed_lang="data.langs"/>
        <div v-else class="alert alert-info">
            <p>需要登入才能提交程式碼</p>
        </div>
    </div>
    <div v-else-if="error" class="alert alert-danger">
        <p>無法載入題目：{{ error }}</p>
    </div>
    <div v-else class="text-center">
        <p>Loading...</p>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {getParam, useLoader} from "@/utils/tools";
import CodeSubmit from "@/components/CodeSubmit.vue";
import {isLoggedIn} from "@/utils/accounts";
import {updateTitle} from "@/router";
import {ProblemDetail} from "@/utils/datatypes";

const {data, error, load} = useLoader<ProblemDetail>();

const pid = getParam("pid");

onMounted(async () => {
    await load("/problem/" + pid);
    const ele = document.getElementById("main_content");
    let base = location.origin + location.pathname;
    base = base.substring(0, base.lastIndexOf("/") + 1);
    ele.querySelectorAll("img").forEach(img => {
        let imgUrl = img.src;
        if (imgUrl.startsWith(base)) {
            imgUrl = imgUrl.substring(base.length);
        }
        if (!imgUrl.includes("/")) {
            img.src = "/api/problem/" + pid + "/file/" + imgUrl;
        }
    });
    updateTitle("題目 - " + data.value["title"]);
});
</script>