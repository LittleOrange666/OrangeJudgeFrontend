<template>
  <form v-if="hasProblemPermission" @submit.prevent="handleCreate">
    <div class="row">
      <div class="col-auto">
        <input type="text" class="form-control" v-model="contest_name" placeholder="競賽名稱"
               pattern="^.{1,120}$"
               required>
      </div>
      <div class="col-auto">
        <button class="btn btn-primary">建立新的競賽</button>
      </div>
    </div>
  </form>
  <table class="table table-hover table-striped" v-if="ok">
    <thead>
    <tr>
      <th scope="col">競賽名稱</th>
      <th scope="col">開始時間</th>
      <th scope="col">持續時間</th>
      <th scope="col">操作</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="content in contents" :key="content.cid">
      <th scope="row"><router-link :to="`/contest/${content.cid}`">{{ content.name }}</router-link></th>
      <td class="date-string">{{ timestamp_to_str(content['start_time']) }}</td>
      <td class="time-string">{{ minute_to_str(content['elapsed']) }}</td>
      <td>
        <div class="row">
          <div class="row">
            <div class="col-auto" v-if="content['can_register']">
              <button class="btn btn-danger" v-if="content['is_registered']">取消註冊</button>
              <button class="btn btn-primary" v-else>註冊</button>
            </div>
            <span>&nbsp;</span>
            <div class="col-auto" v-if="content['can_virtual']">
              <button class="btn btn-secondary">模擬註冊</button>
            </div>
          </div>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
  <PageBar :page_manager="page_manager" />
</template>
<script setup>
import {usePage} from "@/utils/page";
import PageBar from "@/components/PageBar.vue";
import {onMounted, ref} from "vue";
import {hasProblemPermission} from "@/utils/accounts";
import {api, minute_to_str, timestamp_to_str} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import router from "@/router";

const page_manager = usePage("/contest");
const ok = page_manager.ok;
const contents = page_manager.contents;
const contest_name = ref("");

const handleCreate = async () => {
  try{
    const data = await api.post("/contest",{
      contest_name: contest_name.value,
    });
    const idx = data["contest_id"];
    await router.push(`/contest/${idx}`);
  }catch(err){
    await show_modal("創建失敗", err.message);
  }
};

onMounted(async ()=>{
  await page_manager.refresh();
});
</script>