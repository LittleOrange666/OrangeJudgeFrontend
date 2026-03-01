<template>
    <div>
        <h3>基本訊息</h3>
        <div class="container-fluid">
            <form @submit.prevent>
                <div class="mb-3">
                    <label for="title_input" class="form-label">題目名稱</label>
                    <input type="text" class="form-control" id="title_input" v-model="title">
                </div>
                <div class="mb-3">
                    <label for="time_input" class="form-label">時間限制</label>
                    <div class="input-group mb-3">
                        <input type="number" min="250" max="10000" class="form-control" id="time_input"
                               v-model="time_limit">
                        <span class="input-group-text">ms</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="memory_input" class="form-label">記憶體限制</label>
                    <div class="input-group mb-3">
                        <input type="number" min="4" max="1024" class="form-control" id="memory_input"
                               v-model="memory_limit">
                        <span class="input-group-text">MB</span>
                    </div>
                </div>
                <div class="radio-selector">
                    <h4>公開測資</h4>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="show_testcase" id="show_testcase1"
                               value="yes">
                        <label class="form-check-label" for="show_testcase1">
                            是
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="show_testcase" id="show_testcase2"
                               value="no">
                        <label class="form-check-label" for="show_testcase2">
                            否
                        </label>
                    </div>
                </div>
                <div class="radio-selector">
                    <h4>公開結果細則</h4>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="show_checker" id="show_checker1"
                               value="yes">
                        <label class="form-check-label" for="show_checker1">
                            是
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" v-model="show_checker" id="show_checker2"
                               value="no">
                        <label class="form-check-label" for="show_checker2">
                            否
                        </label>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="ac_info_input" class="form-label">AC訊息</label>
                    <input type="text" class="form-control" id="ac_info_input" v-model="ac_info">
                </div>
                <button class="btn btn-primary" v-my-click="save_general_info">
                    儲存
                </button>
            </form>
        </div>
        <br>
        <h3>題目權限</h3>
        <div class="container-fluid">
            <div class="row">
                <p class="col">
                    <span>目前狀態：</span>
                    <span v-if="data.is_public">公開</span>
                    <span v-else>不公開</span>
                </p>
            </div>
            <button class="btn btn-primary" v-if="data.is_public" v-my-click="un_public_problem">保密題目</button>
            <button class="btn btn-primary" v-else v-my-click="public_problem">公開題目</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineModel, onMounted, ref} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";
import {OnOff, yesNo, YesNo} from "@/utils/datatypes";
import {show_modal} from "@/utils/modal";
import {api, getParam} from "@/utils/tools";

const data = defineModel<ProblemManageDetail>({ required: true });

const pid = getParam("pid");

const title = ref("");
const time_limit = ref("0");
const memory_limit = ref("0");
const show_testcase = ref<YesNo>("no");
const show_checker = ref<YesNo>("no");
const ac_info = ref("");

async function init(){
    title.value = data.value.name;
    time_limit.value = data.value.data.timelimit;
    memory_limit.value = data.value.data.memorylimit;
    show_testcase.value = yesNo(data.value.data.public_testcase);
    show_checker.value = yesNo(data.value.data.public_checker);
    ac_info.value = data.value.data.ac_info;
}
async function save_to_data(){
    data.value.name = title.value;
    data.value.data.timelimit = time_limit.value;
    data.value.data.memorylimit = memory_limit.value;
    data.value.data.public_testcase = show_testcase.value==='yes';
    data.value.data.public_checker = show_checker.value==='yes';
    data.value.data.ac_info = ac_info.value;
}

async function save_general_info(){
    try{
        await api.put("/problem/"+pid+"/manage/general",{
            title: title.value,
            timelimit: time_limit.value,
            memorylimit: memory_limit.value,
            ac_info: ac_info.value,
            show_testcase: show_testcase.value,
            show_checker: show_checker.value,
        });
        await show_modal("成功", "成功儲存設置");
        await save_to_data();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function save_public(val: OnOff, txt: string){
    try{
        await api.put("/problem/"+pid+"/manage/public",{
            public: val
        });
        data.value.is_public = val==="on";
        await show_modal("成功", "成功"+txt);
        await save_to_data();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function public_problem(){
    await save_public('on','公開題目');
}

async function un_public_problem(){
    await save_public('off','保密題目');
}

onMounted(async () => {
    await init();
})
</script>