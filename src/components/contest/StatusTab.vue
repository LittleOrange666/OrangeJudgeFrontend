<template>
    <div>
        <div class="row">
            <div class="col-auto">
                <select class="form-select" aria-label="題目編號" v-model="pid">
                    <option value="" selected>所有</option>
                    <option value="{{ k.pid }}" v-for="k in data.problems" :key="k.pid">{{ k.pid }}</option>
                </select>
            </div>
            <div class="col-auto">
                <input type="text" class="form-control" placeholder="使用者id" v-model="user">
            </div>
            <div class="col-auto">
                <select class="form-select" v-model="lang">
                    <option value="">(語言)</option>
                    <option :value="lang.name" :key="lang.name" v-text="lang.name" v-for="lang in lang_info"></option>
                </select>
            </div>
            <div class="col-auto">
                <select class="form-select" v-model="result">
                    <option value="">(結果)</option>
                    <option :value="result[0]" :key="result[0]" v-text="result[1]"
                            v-for="result in can_filter_results"></option>
                </select>
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" v-on:click="refresh" :disabled="loading">刷新/篩選</button>
            </div>
            <div class="col-auto" v-if="isLoggedIn">
                <button class="btn btn-primary" v-on:click="to_mine" :disabled="loading">Mine</button>
            </div>
            <div class="col-auto" v-if="hasAdminPermission">
                <button class="btn btn-primary" v-on:click="rejudge" :disabled="loading">Rejudge</button>
            </div>
        </div>
        <table class="table table-hover table-striped" v-if="ok">
            <thead>
            <tr>
                <th scope="col">解題編號</th>
                <th scope="col">時間</th>
                <th scope="col">提交者</th>
                <th scope="col">題目</th>
                <th scope="col">語言</th>
                <th scope="col">結果</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="content in contents" :key="content.id">
                <th scope="row">
                    <router-link :to="`/submission/${content.id}`" v-if="content.can_see">{{ content.id }}</router-link>
                    <span v-else>{{ content.id }}</span>
                </th>
                <td>{{ timestamp_to_str(content.time) }}</td>
                <td>
                    <router-link :to="`/user/${content.user_id}`">{{ content.user_name }}</router-link>
                </td>
                <td>
                    <router-link :to="`/problem/${content.problem_id}`">{{ content.problem_id }}. {{
                            content.problem_name
                        }}
                    </router-link>
                </td>
                <td>{{ content.lang }}</td>
                <td>{{ content.result }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import {computed, defineProps, onMounted, ref} from 'vue';
import {ContestDetail, SubmissionSummary} from "@/utils/datatypes";
import {can_filter_results} from "@/utils/constants";
import {hasAdminPermission, isLoggedIn} from "@/utils/accounts";
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {storeToRefs} from "pinia";
import {usePage} from "@/utils/page";
import {api, getParam, timestamp_to_str} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {useAuthStore} from "@/stores/auth";

interface Props {
    data: ContestDetail
}

defineProps<Props>();

const cid = getParam("cid");

const base_path = "/contest/" + cid;

const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);
const pid = ref("");
const user = ref("");
const lang = ref("");
const result = ref("");
const page_manager = usePage<SubmissionSummary>(base_path + "/status", {
    pid: pid,
    user: user,
    lang: lang,
    result: result
});
const loading = computed(()=>page_manager.loading.value);
const contents = computed(()=>page_manager.contents.value);
const ok = computed(()=>page_manager.ok.value);
const refresh = page_manager.refresh;

const rejudge = async () => {
    try {
        await api.post("/rejudge_all", {
            pid: pid.value,
            user: user.value,
            lang: lang.value,
            result: result.value,
            cid: cid
        });
    } catch (err) {
        await show_modal("錯誤", err);
        return;
    }
    await show_modal("成功", "成功重新評測");
    await refresh();
};

const to_mine = async () => {
    user.value = useAuthStore().username;
    await refresh();
};

onMounted(async () => {
    await refresh();
});
</script>