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
    <div v-if="loading" class="text-center">
        <p>Loading...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
        <p>無法載入資料：{{ error }}</p>
    </div>
    <!-- Only render child components if data is not null -->
    <div v-else-if="data">
        <TestResult v-if="data.pid === 'test'" :result="data"/>
        <ProblemResult v-else :result="data"/>
    </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {fetchEventSource} from "@microsoft/fetch-event-source"
import {getParam, useLoader} from "@/utils/tools";
import TestResult from "@/components/submission/TestResult.vue";
import ProblemResult from "@/components/submission/ProblemResult.vue";
import {SubmissionDetail} from "@/utils/datatypes";
import {addNavBtn, addNavLink} from "@/router";

const sub_id = getParam("sub_id");
const {data, error, load, loading} = useLoader<SubmissionDetail>();

const do_load = async () => {
    await load("/submission", {
        submission_id: sub_id
    });
};

async function resolve_waiter(){
    const url = "/api/submission/wait?submission_id="+sub_id;
    await fetchEventSource(url,{
        onmessage(event) {
            console.log(event.data);
            if (event.data === "completed"){
                console.log("評測完成");
            }else if (event.data === "progress"){
                console.log("評測部分完成");
                do_load();
            }
        },
        onclose() {
            console.log("連線關閉");
        },
        onerror(err) {
            console.error("發生錯誤", err);
        }
    });
}

onMounted(async () => {
    await do_load();
    if (data.value && data.value.cid) {
        addNavLink("競賽頁面(" + data.value.contest + ")", "/contest/" + data.value.cid);
    }
    addNavBtn("刷新", do_load);
    await resolve_waiter();
});
</script>
