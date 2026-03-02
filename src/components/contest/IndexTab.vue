<template>
    <div>
        <table class="table table-hover table-striped" v-if="can_see_problems">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">名稱</th>
                <th scope="col" v-if="can_edit"></th>
            </tr>
            </thead>
            <tbody v-if="can_edit" v-draggable="[problem_list]">
            <tr class="problem" v-for="problem in problem_list" :key="problem.pid+'~1'">
                <th scope="row">
                    <router-link :to="`/contest/${cid}/problem/${problem.pid}`">{{ problem.pid }}</router-link>
                </th>
                <td>
                    <router-link :to="`/contest/${cid}/problem/${problem.pid}`">{{ problem.name }}</router-link>
                </td>
                <td>
                    <button class="btn btn-danger" v-my-click="async()=>await handleDeleteProblem(problem)">刪除題目
                    </button>
                </td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr class="problem" v-for="problem in problem_list" :key="problem.pid+'~2'">
                <th scope="row">
                    <router-link :to="`/contest/${cid}/problem/${problem.pid}`">{{ problem.pid }}</router-link>
                </th>
                <td>
                    <router-link :to="`/contest/${cid}/problem/${problem.pid}`">{{ problem.name }}</router-link>
                </td>
            </tr>
            </tbody>
        </table>
        <p class="h3" v-else>您目前無法觀看題目</p>
        <div v-if="can_edit">
            <button class="btn btn-primary" v-my-click="handleSaveOrder">儲存順序</button>
            <form v-my-submit="handleAddProblem">
                <div class="row">
                    <div class="col-auto">
                        <input type="text" class="form-control" v-model="new_pid" placeholder="題目編號" required>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary">添加題目</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">
import {computed, defineProps, ref} from 'vue';
import {vDraggable} from 'vue-draggable-plus'
import {api, getParam} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {ContestDetail} from "@/utils/datatypes";

interface Props {
    data: ContestDetail,
    do_load: () => Promise<void>,
}

const props = defineProps<Props>()
const can_see_problems = computed(() => props.data['can_see_problems']);
const can_edit = computed(() => props.data['can_edit']);
const cid = getParam("cid");
const new_pid = ref("");
const base_path = "/contest/" + cid + "/manage";
const problem_list = computed(() => props.data['problems']);

async function handleSaveOrder() {
    console.log(props.data['problems']);
    const order = props.data['problems'].map(x => x["pid"]).join(',');
    try {
        await api.put(base_path + "/problem", {
            order: order,
        });
        await show_modal("成功", "成功儲存順序");
        await props.do_load();
    } catch (err) {
        await show_modal("錯誤", err.message);
    }
}

async function handleAddProblem() {
    try {
        await api.post(base_path + "/problem", {
            pid: new_pid.value,
        });
        await show_modal("成功", "成功添加題目");
        await props.do_load();
    } catch (err) {
        await show_modal("錯誤", err.message);
    }
}

async function handleDeleteProblem(problem: any) {
    try {
        await api.delete(base_path + "/problem", {
            idx: problem.pid,
        });
        await show_modal("成功", "成功刪除題目");
        await props.do_load();
    } catch (err) {
        await show_modal("錯誤", err.message);
    }
}
</script>