<template>
    <div>
        <h3>測資</h3>
        <div class="container-fluid">
            <h4>分組</h4>
            <div class="row g-3">
                <div class="col-auto">
                    <label for="group_name_input" class="visually-hidden">名稱</label>
                    <input type="text" class="form-control" v-model="new_group_name" placeholder="名稱">
                </div>
                <div class="col-auto">
                    <button class="btn btn-primary mb-3" v-my-click="createGroup" :disabled="new_group_name == ''">
                        新增分組
                    </button>
                </div>
            </div>
            <form v-my-submit="saveGroup">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th scope="col">名稱</th>
                        <th scope="col">相依性</th>
                        <th scope="col">給分規則</th>
                        <th scope="col">配分</th>
                        <th scope="col">刪除</th>
                    </tr>
                    </thead>
                    <tbody id="group_list">
                    <tr v-for="(group, k) in data.data.groups" :key="k">
                        <th scope="row">{{ k }}</th>
                        <td>
                            <div class="row dependency">
                                <div class="col-auto" v-for="(parent, i) in group.dependency" :key="i">
                                    <div class="alert alert-primary alert-sm-border btn-group" role="alert">
                                        <span>{{ parent }}</span>
                                        <button type="button" class="btn-close close-sm" aria-label="Close" v-my-click="async ()=>removeDependency(k as string,parent)"></button>
                                    </div>
                                </div>
                                <div class="col-auto btn-group" v-if="Object.keys(data.data.groups).some(k0=>k0!=k && !group.dependency.includes(k0 as string))">
                                    <select class="form-select" aria-label="select dependency" v-model="dependencies[k]">
                                        <option value="undefined">選擇一個分組</option>
                                        <template v-for="k0 in Object.keys(data.data.groups)" :key="k0">
                                            <option v-if="k0!=k && !group.dependency.includes(k0 as string)" :value="k0">{{ k0 }}</option>
                                        </template>
                                    </select>
                                    <button type="button" class="btn btn-primary btn-sm" v-my-click="async ()=>addDependency(k as string)" :disabled="dependencies[k]=='undefined'||dependencies[k]==undefined">+</button>
                                </div>
                            </div>
                        </td>
                        <td>
                            <select class="form-select form-control"
                                    :value="group.rule">
                                <option value="min">最小值</option>
                                <option value="avg">平均值</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" min="0" max="100" :value="group.score"
                                   class="form-control">
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" v-my-click="async ()=>await removeGroup(k as string)"
                                    :disabled="'default' == k">刪除
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button type="submit" class="btn btn-primary">儲存</button>
            </form>
        </div>
        <br>
        <div class="card card-body">
            <form v-my-submit="uploadZip">
                <h4>快速新增</h4>
                <div class="mb-3">
                    <input type="file" class="form-control" accept=".zip" name="zip_file" required>
                </div>
                <div class="mb-3">
                    <div class="row">
                        <div class="col">
                            <input placeholder="輸入檔名後綴" v-model="input_ext" required>
                        </div>
                        <div class="col">
                            <input placeholder="輸出檔名後綴" v-model="output_ext" required>
                        </div>
                        <div class="col"></div>
                        <div class="col"></div>
                    </div>
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary" type="submit">
                    <span class="visually-hidden spinner-border spinner-border-sm" role="status"
                          aria-hidden="true"></span>
                        上傳zip檔
                    </button>
                </div>
            </form>
        </div>
        <div class="card card-body">
            <form v-my-submit="uploadTestcase">
                <h4>手動新增</h4>
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <label for="testcase_input_name" class="form-label">輸入檔名</label>
                            <input class="form-control" v-model="testcase_input_name" id="testcase_input_name" required>
                        </div>
                        <div class="col">
                            <label for="testcase_output_name" class="form-label">輸出檔名</label>
                            <input class="form-control" v-model="testcase_output_name" id="testcase_output_name" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <label for="testcase_input_content" class="form-label">輸入內容</label>
                            <textarea rows="3" class="form-control" v-model="testcase_input_content"
                                      id="testcase_input_content"></textarea>
                        </div>
                        <div class="col">
                            <label for="testcase_output_content" class="form-label">輸出內容</label>
                            <textarea rows="3" class="form-control" v-model="testcase_output_content"
                                      id="testcase_output_content"></textarea>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <button class="btn btn-primary submitter" data-msg-409="檔案名稱已被使用">
                        新增測資
                    </button>
                </div>
            </form>
        </div>
        <div class="container-fluid">
            <h4>一般測資</h4>
            <button class="btn btn-danger submitter" v-my-click="removeAllTestcase">全部刪除</button>
            <table class="table table-hover">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">輸入檔</th>
                    <th scope="col">輸出檔</th>
                    <th scope="col">Group</th>
                    <th scope="col">範測</th>
                    <th scope="col">pretest</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody v-draggable="[testcases]">
                <tr class="testcase testcase-normal" v-for="(testcase,i) in testcases" :key="i">
                    <th scope="row">{{ testcase.old_idx }}</th>
                    <td>
                        <a :href="`/problemsetting_preview?pid=${ pid }&type=testcases&name=${ testcase.in_file }`"
                           target="_blank">{{ testcase.in_file }}</a></td>
                    <td>
                        <a :href="`/problemsetting_preview?pid=${ pid }&type=testcases&name=${ testcase.out_file }`"
                           target="_blank">{{ testcase.out_file }}</a></td>
                    <td>
                        <select class="form-select form-control" name="group_{{ i }}"
                                v-model="testcase.group">
                            <option :value="k" v-for="k in Object.keys(data.data.groups)" :key="k">{{ k }}</option>
                        </select>
                    </td>
                    <td>
                        <input class="form-check-input is_sample" type="checkbox" name="sample_{{ i }}"
                               value="yes"
                               v-model="testcase.sample">
                    </td>
                    <td>
                        <input class="form-check-input is_pretest" type="checkbox" name="pretest_{{ i }}"
                               value="yes"
                               v-model="testcase.pretest">
                    </td>
                    <td>
                        <button class="btn btn-danger testcase-deleter" v-my-click="async ()=>await removeTestcase(testcase.old_idx, i)">刪除</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="mb-3">
                <button class="btn btn-primary data-saver" id="save_testcase" v-my-click="saveTestcase">儲存</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {vDraggable} from 'vue-draggable-plus'
import {ProblemManageDetail} from "@/utils/problemdatas";
import {computed, Ref, ref} from "vue";
import {api, getParam} from "@/utils/tools";
import {double_check, show_modal} from "@/utils/modal";

interface Props {
    do_load: () => Promise<void>
}

const props = defineProps<Props>();

const data = defineModel<ProblemManageDetail>({required: true});
const pid = getParam("pid");

const testcases = computed(()=>data.value.data.testcases);

const new_group_name = ref("");

const dependencies: Ref<{[k: string]: string}> = ref({});

function addDependency(k: string){
    data.value.data.groups[k].dependency.push(dependencies.value[k]);
}

function removeDependency(k: string, k0: string){
    data.value.data.groups[k].dependency.splice(data.value.data.groups[k].dependency.indexOf(k0), 1);
}

async function createGroup() {
    try {
        await api.post("/problem/" + pid + "/manage/group", {
            name: new_group_name.value
        });
        await show_modal("成功", "建立成功");
        data.value.data.groups[new_group_name.value] = {
            dependency: [],
            rule: "min",
            score: 100
        };
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function removeGroup(name: string) {
    try {
        await api.delete("/problem/" + pid + "/manage/group", {
            name: name
        });
        await show_modal("成功", "刪除成功");
        delete data.value.data.groups[name];
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function saveGroup() {
    try {
        const obj = {};
        const order = Object.keys(data.value.data.groups);
        for(const k in data.value.data.groups){
            obj["rule_"+k] = data.value.data.groups[k].rule;
            obj["score_"+k] = data.value.data.groups[k].score;
            for(const k0 of data.value.data.groups[k].dependency){
                obj["dependency_"+order.indexOf(k)+"_"+order.indexOf(k0)] = "yes";
            }
        }
        await api.put("/problem/" + pid + "/manage/group", obj);
        await show_modal("成功", "儲存成功");
        await props.do_load();
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

const input_ext = ref(".in");
const output_ext = ref(".out");

async function uploadZip(){
    const files = document.getElementById("private_file_upload") as HTMLInputElement;
    try{
        await api.post("/problem/"+pid+"/manage/testcases",{
            zip_file: files.files[0],
            input_ext: input_ext.value,
            output_ext: output_ext.value
        });
        await show_modal("成功", "上傳成功");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

const testcase_input_name = ref("");
const testcase_output_name = ref("");
const testcase_input_content = ref("");
const testcase_output_content = ref("");

async function uploadTestcase(){
    try{
        await api.post("/problem/"+pid+"/manage/testcase",{
            input_name: testcase_input_name.value,
            output_name: testcase_output_name.value,
            input_content: testcase_input_content.value,
            output_content: testcase_output_content.value
        });
        await show_modal("成功", "上傳成功");
        testcases.value.push({
            in_file: testcase_input_name.value,
            out_file: testcase_output_name.value,
            group: "default",
            uncompleted: false,
            sample: false,
            pretest: false,
            gen: false,
            old_idx: testcases.value.length
        });
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function removeTestcase(idx: number, curidx: number){
    try {
        await api.delete("/problem/" + pid + "/manage/testcase", {
            idx: idx
        });
        await show_modal("成功", "刪除成功");
        testcases.value.splice(+curidx,1);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function removeAllTestcase(){
    if (!await double_check("刪除全部測資")) return;
    try {
        await api.delete("/problem/" + pid + "/manage/testcases");
        await show_modal("成功", "刪除成功");
        testcases.value.splice(0);
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function saveTestcase(){
    try {
        const res = testcases.value.map(function (o) {
            return [o.old_idx, o.sample,o.pretest,o.group];
        });
        await api.put("/problem/" + pid + "/manage/testcases", {
            modify: JSON.stringify(res)
        });
        await show_modal("成功", "儲存成功");
        await props.do_load();
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}
</script>