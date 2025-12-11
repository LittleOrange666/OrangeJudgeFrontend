<template>
    <div>
        <h3>檔案</h3>
        <div class="container-fluid">
            <h4>公開檔案</h4>
            <form @submit.prevent="uploadPublicFile">
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
                    <th scope="row">{{ i+1 }}</th>
                    <td>
                        <a :href="`/api/problem/${ pid }/manage/preview?type=public_file&name=${ file }`"
                           target="_blank">{{ file }}</a>
                    </td>
                    <td>
                        <button type="button" class="btn btn-danger" v-on:click="removePublicFile(file)">刪除</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="container-fluid">
            <h4>程式檔案</h4>
            <div class="card card-body">
                <form @submit.prevent="uploadPrivateFile">
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
                <form @submit.prevent="createPrivateFile">
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
                        <th scope="row">{{ i+1 }}</th>
                        <td>
                            <a :href="`/api/problem/${ pid }/manage/preview?type=file&name=${ file.name }`"
                               target="_blank">{{ file.name }}</a>
                        </td>
                        <td class="file_type">{{ file.type }}</td>
                        <td>
                            <button type="button" class="btn btn-primary" data-bs-toggle="collapse"
                                    :data-bs-target="`#collapse_file_edit_${ i }`" aria-expanded="false"
                                    :aria-controls="`collapse_file_edit_${ i }`">編輯
                            </button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" v-on:click="removePrivateFile(file.name)">刪除</button>
                        </td>
                    </tr>
                    <tr class="collapse collapse_file_edit" :id="`collapse_file_edit_${ i }`">
                        <td colspan="5">
                            <div class="card card-body">
                                <select class="form-select" aria-label="Default select example">
                                    <option :value="lang.name" :key="lang.name" v-text="lang.name" v-for="lang in lang_info"></option>
                                </select>
                                <textarea class="form-control" rows="3"></textarea>
                                <button class="btn btn-primary">儲存</button>
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
import {defineProps} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";
import {storeToRefs} from "pinia";
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {api, getParam} from "@/utils/tools";
import {show_modal} from "@/utils/modal";

interface Props{
    data: ProblemManageDetail;
    do_load: () => Promise<void>;
}

const props = defineProps<Props>();
const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);
const pid = getParam("pid");

async function removePublicFile(fn: string){
    try{
        await api.delete("/problem/"+pid+"/manage/file/public",{
            filename: fn
        });
        await show_modal("成功", "成功刪除");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function uploadPublicFile(){
    const files = document.getElementById("public_file_upload") as HTMLInputElement;
    try{
        await api.post("/problem/"+pid+"/manage/file/public",{
            files: files.files[0],
        });
        await show_modal("成功", "上傳成功");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function uploadPrivateFile(){
    const files = document.getElementById("private_file_upload") as HTMLInputElement;
    try{
        await api.post("/problem/"+pid+"/manage/file/private",{
            files: files.files[0],
        });
        await show_modal("成功", "上傳成功");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function createPrivateFile(){
    const filename = document.getElementById("create_file_input") as HTMLInputElement;
    try{
        await api.post("/problem/"+pid+"/manage/file/private",{
            filename: filename.value
        });
        await show_modal("成功", "建立成功");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function removePrivateFile(fn: string){
    try{
        await api.delete("/problem/"+pid+"/manage/file/private",{
            filename: fn
        });
        await show_modal("成功", "成功刪除");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}
</script>