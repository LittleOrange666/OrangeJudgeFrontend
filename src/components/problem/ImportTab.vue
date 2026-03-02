<template>
    <div>
        <h3>匯入與匯出</h3>
        <div class="card card-body">
            <h3>匯入Polygon題目</h3>
            <form v-my-submit="importPolygon">
                <div class="mb-3">
                    <input type="file" class="form-control" accept=".zip" name="zip_file" id="file_input_polygon"
                           required>
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary submitter">
                        上傳zip檔
                    </button>
                </div>
            </form>
        </div>
        <div class="card card-body">
            <form v-my-submit="exportStandard">
                <div class="mb-3">
                    <button class="btn btn-primary submitter">
                        匯出題目
                    </button>
                </div>
            </form>
            <h3>匯入題目</h3>
            <form v-my-submit="importStandard">
                <div class="mb-3">
                    <input type="file" class="form-control" accept=".zip" name="zip_file" id="file_input_standard"
                           required>
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary submitter">
                        上傳zip檔
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";
import {api, getParam} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {useRouter} from "vue-router";
import axios from "axios";

interface Props {
    data: ProblemManageDetail;
}

defineProps<Props>();
const pid = getParam("pid");
const router = useRouter();

async function importPolygon() {
    const files = document.getElementById("file_input_polygon") as HTMLInputElement;
    try {
        await api.post("/problem/" + pid + "/manage/import/polygon", {
            zip_file: files.files[0]
        });
        await show_modal("成功", "上傳成功");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function importStandard() {
    const files = document.getElementById("file_input_standard") as HTMLInputElement;
    try {
        await api.post("/problem/" + pid + "/manage/import/standard", {
            zip_file: files.files[0]
        });
        await show_modal("成功", "上傳成功");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function exportStandard() {
    const response = await axios.get("/api/problem/" + pid + "/manage/export/standard", {
        responseType: 'blob'
    });
    const href = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', "problem.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}
</script>