<template>
    <div v-if="data">
        <h1 class="text-center">{{ data.name }}</h1>
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
        <CodeSubmit :pid="data.internal_pid" :cid="cid" v-if="isLoggedIn"/>
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
import {ContestProblemDetail} from "@/utils/datatypes";

const {data, error, load} = useLoader<ContestProblemDetail>();

const pid: string = getParam("pid");
const cid: string = getParam("cid");

onMounted(async () => {
    await load("/contest/" + cid + "/problem/" + pid);
    const ele = document.getElementById("main_content");
    let base = location.origin + location.pathname;
    base = base.substring(0, base.lastIndexOf("/") + 1);
    const internal_pid = data.value.internal_pid;
    ele.querySelectorAll("img").forEach(img => {
        let imgUrl = img.src;
        if (imgUrl.startsWith(base)) {
            imgUrl = imgUrl.substring(base.length);
        }
        if (!imgUrl.includes("/")) {
            img.src = "/api/problem/" + internal_pid + "/file/" + imgUrl + "?cid=" + cid;
        }
    });
    updateTitle("競賽 - " + cid + " - 題目 - " + data.value.name);
});
</script>