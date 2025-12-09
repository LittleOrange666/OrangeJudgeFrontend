<template>
    <div v-if="loading" class="text-center">
        <p>Loading...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
        <p>無法載入頁面：{{ error }}</p>
    </div>
    <div v-else>
        <div class="row">
            <div class="col-auto">
                <p class="h2" v-text="status_text"></p>
            </div>
            <div class="col-auto" v-if="show_timer">
                <p class="h2 text-secondary">{{ timer_text }}</p>
            </div>
            <div class="col-auto" v-if="can_register">
                <button class="btn btn-danger" v-if="is_registered" v-on:click="handleUnregister">取消註冊</button>
                <button class="btn btn-primary" v-else v-on:click="handleRegister">註冊</button>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="index_page_tab" data-bs-toggle="tab" data-bs-target="#index_page"
                   type="button" role="tab" aria-controls="index_page" aria-selected="true">首頁</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="status_tab" data-bs-toggle="tab" data-bs-target="#status" type="button"
                   role="tab"
                   aria-controls="status" aria-selected="false">解題動態</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="standing_tab" data-bs-toggle="tab" data-bs-target="#standing" type="button"
                   role="tab"
                   aria-controls="standing" aria-selected="false">記分板</a>
            </li>
            <li class="nav-item" role="presentation" v-if="can_edit">
                <a class="nav-link" id="edit_tab" data-bs-toggle="tab" data-bs-target="#edit" type="button" role="tab"
                   aria-controls="edit" aria-selected="false">管理</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="participants_tab" data-bs-toggle="tab" data-bs-target="#participants"
                   type="button"
                   role="tab"
                   aria-controls="participants" aria-selected="false">參賽者</a>
            </li>
        </ul>
        <div class="tab-content">
            <div id="index_page" class="tab-pane fade show active">
                <IndexTab :do_load="do_load" :data="data" v-if="loaded('#index_page')"/>
            </div>
            <div id="status" class="tab-pane fade">
                <StatusTab :data="data" v-if="loaded('#status')"/>
            </div>
            <div id="standing" class="tab-pane fade">
                <StandingTab :data="data" v-if="loaded('#standing')"/>
            </div>
            <div id="edit" class="tab-pane fade" v-if="can_edit">
                <EditTab :data="data" :do_load="do_load" v-if="loaded('#edit')"/>
            </div>
            <div id="participants" class="tab-pane fade">
                <ParticipantTab :data="data" v-if="loaded('#participants')"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {api, getParam, useLoader} from "@/utils/tools";
import {computed, onMounted, ref, watchEffect} from "vue";
import IndexTab from "@/components/contest/IndexTab.vue";
import StatusTab from "@/components/contest/StatusTab.vue";
import StandingTab from "@/components/contest/StandingTab.vue";
import EditTab from "@/components/contest/EditTab.vue";
import ParticipantTab from "@/components/contest/ParticipantTab.vue";
import useTab from "@/utils/tab";
import {show_modal} from "@/utils/modal";
import {addNavBtn, clearNav, updateTitle} from "@/router";
import {contest_status_text} from "@/utils/constants";
import {ContestDetail} from "@/utils/datatypes";
import {useTimer} from "vue-timer-hook";

const {data, error, loading, load} = useLoader<ContestDetail>();
const {init, loaded} = useTab();

const cid = getParam("cid");

const can_register = computed(() => data.value && data.value["can_register"]);
const is_registered = computed(() => data.value && data.value["is_registered"]);
const can_edit = computed(() => data.value && data.value["can_edit"]);
const status_text = computed(() => data.value && data.value["status"] &&
    contest_status_text[data.value["status"]] || "???");

const show_timer = ref(false);
const timer = useTimer(+new Date() + 1000000000);

function add0(y: number) {
    const x = "" + y;
    if (x.length <= 1) return "0".repeat(2 - x.length) + x;
    else return x;
}

const timer_text = computed(() => {
    const day = timer.days.value;
    const hour = timer.hours.value;
    const minute = timer.minutes.value;
    const second = timer.seconds.value;
    if (day >= 1) {
        return "" + day + ":" + add0(hour) + ":" + add0(minute) + ":" + add0(second);
    } else {
        return "" + hour + ":" + add0(minute) + ":" + add0(second);
    }
});

async function do_load() {
    await load("/contest/" + cid);
    clearNav();
    updateTitle("競賽 - " + data.value["name"]);
    addNavBtn("刷新", do_load);
    if (data.value.target) {
        timer.restart(data.value.target * 1000, true);
        show_timer.value = true;
    } else {
        timer.restart(+new Date() + 1000000000, false);
        show_timer.value = false;
    }
}

async function handleRegister() {
    try {
        await api.post("/contest/" + cid + "/register");
        await show_modal("成功", "成功註冊");
        await do_load();
    } catch (err) {
        await show_modal("註冊失敗", err.message);
    }
}

async function handleUnregister() {
    try {
        await api.post("/contest/" + cid + "/unregister");
        await show_modal("成功", "成功取消註冊");
        await do_load();
    } catch (err) {
        await show_modal("取消註冊失敗", err.message);
    }
}

onMounted(async () => {
    watchEffect(async () => {
        if (timer.isExpired.value) {
            await do_load();
        }
    });
    await do_load();
    await init();
    updateTitle("競賽 - " + cid);
});
</script>