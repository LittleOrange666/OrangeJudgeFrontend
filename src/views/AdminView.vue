<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="users_tab" data-bs-toggle="tab" data-bs-target="#users" type="button"
                   role="tab"
                   aria-controls="users" aria-selected="true">使用者管理</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="config_tab" data-bs-toggle="tab" data-bs-target="#config"
                   type="button" role="tab" aria-controls="config" aria-selected="false">設置</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="make_users_tab" data-bs-toggle="tab" data-bs-target="#make_users" type="button"
                   role="tab"
                   aria-controls="make_users" aria-selected="false">建立使用者</a>
            </li>
        </ul>
        <div class="tab-content">
            <div id="users" class="tab-pane fade show active">
                <UsersTab v-if="loaded('#users')" />
            </div>
            <div id="config" class="tab-pane fade">
                <ConfigTab v-if="loaded('#config')" />
            </div>
            <div id="make_users" class="tab-pane fade">
                <MakeUsersTab v-if="loaded('#make_users')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useTab from "@/utils/tab";
import {onMounted} from "vue";
import UsersTab from "@/components/admin/UsersTab.vue";
import ConfigTab from "@/components/admin/ConfigTab.vue";
import MakeUsersTab from "@/components/admin/MakeUsersTab.vue";

const {init, loaded} = useTab();

onMounted(async () => {
    await init();
});
</script>