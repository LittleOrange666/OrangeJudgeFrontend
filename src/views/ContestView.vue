<template>
  <div v-if="loading" class="text-center">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入頁面：{{ error }}</p>
  </div>
  <div v-else>
    <div class="row">
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
        <a class="nav-link" id="status_tab" data-bs-toggle="tab" data-bs-target="#status" type="button" role="tab"
           aria-controls="status" aria-selected="false">解題動態</a>
      </li>
      <li class="nav-item" role="presentation" v-if="isLoggedIn">
        <a class="nav-link" id="my_status_tab" data-bs-toggle="tab" data-bs-target="#my_status" type="button"
           role="tab"
           aria-controls="my_status" aria-selected="false">我的解題動態</a>
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
        <a class="nav-link" id="participants_tab" data-bs-toggle="tab" data-bs-target="#participants" type="button"
           role="tab"
           aria-controls="participants" aria-selected="false">參賽者</a>
      </li>
    </ul>
    <div class="tab-content">
      <div id="index_page" class="tab-pane fade show active">
        <IndexTab :data="data" v-if="loaded('#index_page')" />
      </div>
      <div id="status" class="tab-pane fade">
        <StatusTab :data="data" v-if="loaded('#status')" />
      </div>
      <div id="my_status" class="tab-pane fade" v-if="isLoggedIn">
        <MyStatusTab :data="data" v-if="loaded('#my_status')" />
      </div>
      <div id="standing" class="tab-pane fade">
        <StandingTab :data="data" v-if="loaded('#standing')" />
      </div>
      <div id="edit" class="tab-pane fade" v-if="can_edit">
        <EditTab :data="data" v-if="loaded('#edit')" />
      </div>
      <div id="participants" class="tab-pane fade">
        <ParticipantTab :data="data" v-if="loaded('#participants')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {api, useLoader} from "@/utils/tools.ts";
import {useRoute} from "vue-router";
import {computed, onMounted} from "vue";
import {isLoggedIn} from "@/utils/accounts";
import IndexTab from "@/components/contest/IndexTab.vue";
import StatusTab from "@/components/contest/StatusTab.vue";
import MyStatusTab from "@/components/contest/MyStatusTab.vue";
import StandingTab from "@/components/contest/StandingTab.vue";
import EditTab from "@/components/contest/EditTab.vue";
import ParticipantTab from "@/components/contest/ParticipantTab.vue";
import useTab from "@/utils/tab";
import {show_modal} from "@/utils/modal";
import {updateTitle} from "@/router";

const {data, error, loading, load} = useLoader();
const {init, loaded} = useTab();

const route = useRoute();
const cid = route.params.cid;

const can_register = computed(() => data.value && data.value["can_register"]);
const is_registered = computed(() => data.value && data.value["is_registered"]);
const can_edit = computed(() => data.value && data.value["can_edit"]);

const handleRegister = async () => {
  try{
    await api.post("/contest/"+cid+"/register");
    await show_modal("成功", "成功註冊");
    await load("/contest/"+cid);
  }catch(err){
    await show_modal("註冊失敗", err.message);
  }
};

const handleUnregister = async () => {
  try{
    await api.post("/contest/"+cid+"/unregister");
    await show_modal("成功", "成功取消註冊");
    await load("/contest/"+cid);
  }catch(err){
    await show_modal("取消註冊失敗", err.message);
  }
};

onMounted(async () => {
  await load("/contest/"+cid);
  await init();
  updateTitle("競賽 - " + data.value["name"]);
})
</script>