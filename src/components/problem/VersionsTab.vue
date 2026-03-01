<template>
    <div>
        <h3>發布更新</h3>
        <div class="row g-3">
            <div class="col-auto">
                <label for="version_name_input" class="visually-hidden">描述</label>
                <input type="text" class="form-control" id="version_name_input" placeholder="描述" v-model="name">
            </div>
            <div class="col-auto">
                <button class="btn btn-primary mb-3" id="create_version" v-my-click="createVersion">
                    發布更新
                </button>
            </div>
        </div>
        <table class="table table-hover">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">描述</th>
                <th scope="col">時間</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(version, i) in data.versions" :key="i">
                <th scope="row">{{ version.id }}</th>
                <td>{{ version.message }}</td>
                <td class="date-string">{{ useDateFormat(version.date*1000, 'YYYY/MM/DD HH:mm:ss') }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";
import {useDateFormat} from "@vueuse/shared";
import {api, getParam} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {useRouter} from "vue-router";

interface Props{
    data: ProblemManageDetail;
}

defineProps<Props>();

const name = ref("");

const router = useRouter();
const pid = getParam("pid");

async function createVersion(){
    try {
        await api.post("/problem/" + pid + "/manage/version", {
            description: name.value
        });
        await show_modal("成功", "建立成功");
        router.go(0);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}
</script>