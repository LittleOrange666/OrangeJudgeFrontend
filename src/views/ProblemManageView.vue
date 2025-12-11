<template>
    <div v-if="loading" class="text-center">
        <p>Loading...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
        <p>無法載入頁面：{{ error }}</p>
    </div>
    <div v-else-if="data.background_action" class="alert alert-danger">
        <p>正在處裡背景操作 {{ (data as ProblemManageLoading).background_action.action_name }}...</p>
        <div class="alert alert-info">{{ (data as ProblemManageLoading).background_action.log }}</div>
    </div>
    <div v-else>
        <ul class="nav nav-tabs">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="general_info_tab" data-bs-toggle="tab" data-bs-target="#general_info"
                   type="button" role="tab" aria-controls="general_info" aria-selected="true">基本訊息</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="languages_tab" data-bs-toggle="tab" data-bs-target="#languages" type="button"
                   role="tab"
                   aria-controls="languages" aria-selected="false">語言</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="statement_tab" data-bs-toggle="tab" data-bs-target="#statement" type="button"
                   role="tab"
                   aria-controls="statement" aria-selected="false">題敘</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="statement_preview_tab" data-bs-toggle="tab" data-bs-target="#statement_preview"
                   type="button" role="tab"
                   aria-controls="statement_preview" aria-selected="false">題敘預覽</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="files_tab" data-bs-toggle="tab" data-bs-target="#files" type="button" role="tab"
                   aria-controls="files" aria-selected="false">檔案</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="judge_tab" data-bs-toggle="tab" data-bs-target="#judge" type="button" role="tab"
                   aria-controls="judge" aria-selected="false">裁判</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="tests_tab" data-bs-toggle="tab" data-bs-target="#tests" type="button" role="tab"
                   aria-controls="tests" aria-selected="false">測資</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="versions_tab" data-bs-toggle="tab" data-bs-target="#versions" type="button"
                   role="tab"
                   aria-controls="versions" aria-selected="false">發布更新</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="import_tab" data-bs-toggle="tab" data-bs-target="#import" type="button" role="tab"
                   aria-controls="import" aria-selected="false">匯出與匯入</a>
            </li>
        </ul>
        <div class="tab-content">
            <div id="general_info" class="tab-pane fade show active">
                <GeneralInfoTab :data="data as ProblemManageDetail" :do_load="do_load" v-if="loaded('#general_info')" />
            </div>
            <div id="languages" class="tab-pane fade">
                <LanguagesTab :data="data as ProblemManageDetail" v-if="loaded('#languages')" />
            </div>
            <div id="statement" class="tab-pane fade">
                <StatementTab :data="data as ProblemManageDetail" :do_load="do_load" v-if="loaded('#statement')" />
            </div>
            <div id="statement_preview" class="tab-pane fade">
                <StatementPreviewTab v-if="loaded('#statement_preview')" />
            </div>
            <div id="files" class="tab-pane fade">
                <FilesTab :data="data as ProblemManageDetail" :do_load="do_load" v-if="loaded('#files')" />
            </div>
            <div id="judge" class="tab-pane fade">
                <JudgeTab :data="data as ProblemManageDetail" v-if="loaded('#judge')" />
            </div>
            <div id="tests" class="tab-pane fade">
                <TestsTab :data="data as ProblemManageDetail" v-if="loaded('#tests')" />
            </div>
            <div id="versions" class="tab-pane fade">
                <VersionsTab :data="data as ProblemManageDetail" v-if="loaded('#versions')" />
            </div>
            <div id="import" class="tab-pane fade">
                <ImportTab :data="data as ProblemManageDetail" v-if="loaded('#import')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useTab from "@/utils/tab";
import {onMounted} from "vue";
import {getParam, useLoader} from "@/utils/tools";
import {ProblemManageDetail, ProblemManageInfo, ProblemManageLoading} from "@/utils/problemdatas"
import GeneralInfoTab from "@/components/problem/GeneralInfoTab.vue";
import LanguagesTab from "@/components/problem/LanguagesTab.vue";
import StatementTab from "@/components/problem/StatementTab.vue";
import FilesTab from "@/components/problem/FilesTab.vue";
import JudgeTab from "@/components/problem/JudgeTab.vue";
import TestsTab from "@/components/problem/TestsTab.vue";
import VersionsTab from "@/components/problem/VersionsTab.vue";
import ImportTab from "@/components/problem/ImportTab.vue";
import StatementPreviewTab from "@/components/problem/StatementPreviewTab.vue";

const {init, loaded, updateTab} = useTab();

const {data, error, loading, load} = useLoader<ProblemManageInfo>();
const pid = getParam("pid");

async function do_load() {
    await load("/problem/" + pid + "/manage");
    await updateTab();
}
onMounted(async () => {
    await do_load();
    await init();
});
</script>