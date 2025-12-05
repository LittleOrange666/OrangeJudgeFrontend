<template>
    <div>
        <div v-if="can_edit">
            <form @submit.prevent="handleAdd">
                <div class="row">
                    <div class="col-auto">
                        <input type="text" class="form-control" v-model="username" placeholder="參賽者id" required>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary">添加參賽者</button>
                    </div>
                </div>
            </form>
            <form @submit.prevent="handleAdds">
                <div class="row">
                    <div class="col-auto">
                        <input type="file" class="form-control" accept=".csv, .xlsx" name="file" id="uploadFile">
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary">批次添加參賽者</button>
                    </div>
                </div>
            </form>
        </div>
        <div v-if="participantsLoading" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="participantsError" class="alert alert-danger">
            <p>無法載入頁面：{{ participantsError }}</p>
        </div>
        <table class="table table-hover table-striped" v-else>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col" v-if="can_edit"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user,index) in participantsData.participants" :key="index">
                <th scope="row">{{ index }}</th>
                <td><a href="/user/{{ user }}" target="_blank">{{ user }}</a></td>
                <td v-if="can_edit">
                    <button class="btn btn-danger" v-on:click="handleDelete(user)">移除參賽者</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import {computed, defineProps, onMounted, ref} from 'vue';
import {ContestDetail} from "@/utils/datatypes";
import {api, getParam, useLoader} from "@/utils/tools";
import {show_modal} from "@/utils/modal";

interface Props {
    data: ContestDetail
}

interface Participants {
    participants: string[];
}

const props = defineProps<Props>();
const can_edit = computed(() => props.data.can_edit);
const cid = getParam("cid");

const username = ref("");

const participants = useLoader<Participants>();

const participantsLoading = computed(() => participants.loading.value);
const participantsError = computed(() => participants.error.value);
const participantsData = computed(() => participants.data.value);

async function handleAdd() {
    try {
        await api.post("/contest/" + cid + "/manage/participant", {
            username: username.value
        });
        await show_modal("成功", "成功添加參賽者");
        await participants.load("/contest/" + cid + "/participants");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function handleAdds() {
    const uploadFile = document.getElementById("uploadFile") as HTMLInputElement;
    try {
        await api.post("/contest/" + cid + "/manage/participant", {
            file: uploadFile.files[0],
        });
        await show_modal("成功", "成功添加參賽者");
        await participants.load("/contest/" + cid + "/participants");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function handleDelete(name: string) {
    try {
        await api.delete("/contest/" + cid + "/manage/participant", {
            username: name
        });
        await show_modal("成功", "成功移除參賽者");
        await participants.load("/contest/" + cid + "/participants");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

onMounted(async () => {
    await participants.load("/contest/" + cid + "/participants");
})
</script>