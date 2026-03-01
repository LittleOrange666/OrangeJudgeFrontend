<template>
    <div>
        <h3>檔案</h3>
        <div class="container-fluid">
            <h4>公開檔案</h4>
            <form v-my-submit="uploadPublicFile">
                <div class="mb-3">
                    <input type="file" class="form-control" accept="application/pdf,image/*" name="files" multiple
                           required id="public_file_upload">
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary">上傳檔案</button>
                </div>
            </form>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">檔名</th>
                    <th scope="col">刪除</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(file,i) in data.public_files" :key="i">
                    <th scope="row">{{ i + 1 }}</th>
                    <td>
                        <a :href="`/api/problem/${ pid }/manage/preview?type=public_file&name=${ file }`"
                           target="_blank">{{ file }}</a>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger"
                                v-my-click="async ()=>await removePublicFile(file)">刪除
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="container-fluid">
            <h4>程式檔案</h4>
            <div class="card card-body">
                <form v-my-submit="uploadPrivateFile">
                    <div class="mb-3">
                        <input type="file" class="form-control" name="files" multiple required id="private_file_upload">
                    </div>
                    <div class="mb-3">
                        <button class="btn btn-primary">上傳檔案</button>
                    </div>
                </form>
            </div>
            <br>
            <div class="card card-body">
                <form v-my-submit="createPrivateFile">
                    <div class="row g-3">
                        <div class="col-auto">
                            <label for="create_file_input" class="visually-hidden">檔名</label>
                            <input type="text" class="form-control" id="create_file_input" placeholder="檔名"
                                   name="filename" required>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary mb-3">
                                建立檔案
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">檔名</th>
                    <th scope="col">類型</th>
                    <th scope="col">編輯</th>
                    <th scope="col">刪除</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="(file,i) in data.data.files" :key="i">
                    <tr>
                        <th scope="row">{{ i + 1 }}</th>
                        <td>
                            <a :href="`/api/problem/${ pid }/manage/preview?type=file&name=${ file.name }`"
                               target="_blank">{{ file.name }}</a>
                        </td>
                        <td class="file_type">{{ file.type }}</td>
                        <td>
                            <button type="button" class="btn btn-primary" data-bs-toggle="collapse"
                                    :data-bs-target="`#collapse_file_edit_${ i }`" aria-expanded="false"
                                    :aria-controls="`collapse_file_edit_${ i }`"
                                    v-my-click="async()=>await loadFile(i)">編輯
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger"
                                    v-my-click="async()=>await removePrivateFile(file.name)">刪除
                            </button>
                        </td>
                    </tr>
                    <tr class="collapse collapse_file_edit" :id="`collapse_file_edit_${ i }`">
                        <td colspan="5">
                            <div class="card card-body">
                                <select class="form-select" aria-label="Default select example" :value="file.type">
                                    <option :value="lang.name" :key="lang.name" v-text="lang.name"
                                            v-for="lang in lang_info"></option>
                                </select>
                                <textarea class="form-control" rows="3"></textarea>
                                <button class="btn btn-primary" v-my-click="async()=>await saveFile(i)">儲存</button>
                            </div>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineModel} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";
import {storeToRefs} from "pinia";
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {api, getParam} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {default_lang} from "@/utils/constants";
import axios from "axios";

const data = defineModel<ProblemManageDetail>({required: true});
const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);
const pid = getParam("pid");

async function removePublicFile(fn: string) {
    try {
        await api.delete("/problem/" + pid + "/manage/file/public", {
            filename: fn
        });
        await show_modal("成功", "成功刪除");
        data.value.public_files.splice(data.value.public_files.indexOf(fn), 1);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function uploadPublicFile() {
    const files = document.getElementById("public_file_upload") as HTMLInputElement;
    try {
        await api.post("/problem/" + pid + "/manage/file/public", {
            files: files.files[0],
        });
        await show_modal("成功", "上傳成功");
        data.value.public_files.push(files.files[0].name);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function uploadPrivateFile() {
    const files = document.getElementById("private_file_upload") as HTMLInputElement;
    try {
        await api.post("/problem/" + pid + "/manage/file/private", {
            files: files.files[0],
        });
        await show_modal("成功", "上傳成功");
        data.value.data.files.push({
            name: files.files[0].name,
            type: default_lang
        });
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function createPrivateFile() {
    const filename = document.getElementById("create_file_input") as HTMLInputElement;
    try {
        await api.post("/problem/" + pid + "/manage/file/private", {
            filename: filename.value
        });
        await show_modal("成功", "建立成功");
        data.value.data.files.push({
            name: filename.value,
            type: default_lang
        });
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function removePrivateFile(fn: string) {
    try {
        await api.delete("/problem/" + pid + "/manage/file/private", {
            filename: fn
        });
        await show_modal("成功", "成功刪除");
        let i = 0;
        while (i < data.value.data.files.length && data.value.data.files[i].name != fn) {
            i += 1;
        }
        data.value.data.files.splice(i, 1);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function loadFile(i: number) {
    const file_info = data.value.data.files;
    if (file_info[i].loaded) return;
    file_info[i].loaded = true;
    const el = document.querySelector(`#collapse_file_edit_${i} textarea`) as HTMLTextAreaElement;
    try {
        const res = await axios.get("/api/problem/" + pid + "/manage/preview", {
            params: {
                name: file_info[i].name,
                type: "file"
            }
        });
        el.value = res.data;
    } catch (err) {
        await show_modal("讀取檔案失敗", err.message);
        file_info[i].loaded = false;
    }
}

async function saveFile(i: number) {
    const fn = data.value.data.files[i].name;
    const el = document.querySelector(`#collapse_file_edit_${i} textarea`) as HTMLTextAreaElement;
    console.log(el);
    try {
        await api.put("/problem/" + pid + "/manage/file/private",{
            filename: fn,
            content: el.value,
            type: data.value.data.files[i].type
        });
        await show_modal("成功", "成功儲存");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}
</script>