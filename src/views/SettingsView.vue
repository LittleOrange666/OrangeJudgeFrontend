<template>
    <div v-if="loading" class="text-center">
        <p>Loading...</p>
    </div>
    <div v-else-if="error" class="alert alert-danger">
        <p>無法載入頁面：{{ error }}</p>
    </div>
    <div v-else>
        <div>
            <ul class="nav nav-tabs">
                <li class="nav-item" role="presentation">
                    <a class="nav-link active" id="general_info_tab" data-bs-toggle="tab" data-bs-target="#general_info"
                       type="button" role="tab" aria-controls="general_info" aria-selected="true">基本訊息</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="password_tab" data-bs-toggle="tab" data-bs-target="#password" type="button"
                       role="tab" aria-controls="password" aria-selected="false">變更密碼</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" id="api_tab" data-bs-toggle="tab" data-bs-target="#api"
                       type="button" role="tab" aria-controls="api" aria-selected="true">API</a>
                </li>
            </ul>
        </div>
        <div class="tab-content">
            <div id="general_info" class="tab-pane fade show active">
                <ProfileTab :data="data" v-if="loaded('#general_info')" />
            </div>
            <div id="password" class="tab-pane fade">
                <PasswordTab v-if="loaded('#password')" />
            </div>
            <div id="api" class="tab-pane fade">
                <ApiTab v-if="loaded('#api')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useTab from "@/utils/tab";
import {onMounted} from "vue";
import ProfileTab from "@/components/settings/ProfileTab.vue";
import PasswordTab from "@/components/settings/PasswordTab.vue";
import {useLoader} from "@/utils/tools";
import {UserSettings} from "@/utils/datatypes";
import ApiTab from "@/components/settings/ApiTab.vue";

const {init, loaded} = useTab();

const {load, data, loading, error} = useLoader<UserSettings>();
async function do_load(){
    await load("/accounts/settings");
}

onMounted(async () => {
    await do_load();
    await init();
});
</script>