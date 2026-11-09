<!--
  - OrangeJudge, a competitive programming platform
  -
  - Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published
  - by the Free Software Foundation, either version 3 of the License, or
  - (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU Affero General Public License for more details.
  -->

<template>
    <div>
        <h3>裁判</h3>
        <div class="container-fluid">
            <h4>評分</h4>
            <p>
                <span>目前：{{ data.data.checker_source.name }}</span>
                <span v-if="data.data.checker_source.type == 'default'">(內建)</span>
            </p>
            <form v-my-submit="choose_checker">
                <div class="radio-selector">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="checker_type" id="checker_type1"
                               v-model="checker_type" value="default">
                        <label class="form-check-label" for="checker_type1">
                            內建評分程式
                        </label>
                    </div>
                    <select class="form-select" name="default_checker" v-model="checker_name1">
                        <option :value="checker" v-for="(checker,i) in data.default_checkers" :key="i">{{
                                checker
                            }}
                        </option>
                    </select>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="checker_type" id="checker_type2"
                               v-model="checker_type" value="my">
                        <label class="form-check-label" for="checker_type2">
                            自訂評分程式
                        </label>
                    </div>
                    <select class="form-select" name="my_checker" v-model="checker_name2">
                        <option selected value="unknown">無</option>
                        <option :value="file.name" v-for="(file,i) in data.data.files" :key="i">{{ file.name }}</option>
                    </select>
                    <button class="btn btn-primary" :disabled="checker_name2=='unknown'&&checker_type=='my'">
                        更換評分程式
                    </button>
                </div>
            </form>
        </div>
        <br>
        <div class="container-fluid">
            <h4>題目類型</h4>
            <p>
                目前：{{ problem_type_names[current_problem_type()] }}
                <span v-if="data.data.is_interact">（互動程式：{{ data.data.interactor_source }}，
                    {{ data.data.interact_num || 1 }} 個程式）</span>
            </p>
            <form v-my-submit="choose_problem_type">
                <div class="form-check" v-for="(name, tp) in problem_type_names" :key="tp">
                    <input class="form-check-input" type="radio" name="problem_type" :id="'problem_type_' + tp"
                           v-model="problem_type" :value="tp">
                    <label class="form-check-label" :for="'problem_type_' + tp">{{ name }}</label>
                </div>
                <template v-if="problem_type == 'communication'">
                    <label class="form-label" for="my_interactor">互動程式 (manager)</label>
                    <select class="form-select" name="my_interactor" id="my_interactor" v-model="my_interactor">
                        <option selected value="unknown">無</option>
                        <option :value="file.name" v-for="(file,i) in data.data.files" :key="i">{{
                                file.name
                            }}
                        </option>
                    </select>
                    <label class="form-label" for="interact_num">同時執行的使用者程式數量 (N)</label>
                    <input class="form-control" type="number" min="1" max="64" id="interact_num"
                           v-model.number="interact_num">
                    <div class="form-text" v-if="interact_num > 1">
                        互動程式會以 <code>interactor &lt;input&gt; &lt;output&gt; from_0 to_0 ... from_{{
                            interact_num - 1 }} to_{{ interact_num - 1 }}</code> 執行，
                        需依序開啟每一對 FIFO（先 from_i 讀取，再 to_i 寫入）；
                        第 i 個使用者程式以 stdin/stdout 溝通，並收到參數 i；
                        時間限制為所有使用者程式 CPU 時間總和。
                    </div>
                </template>
                <div class="form-text" v-if="problem_type == 'output_only'">
                    選手下載 input_k.txt 並上傳 output_k.txt（k 為依測資組別排序後的 1-based 編號），
                    以評分程式檢查輸出。
                </div>
                <button class="btn btn-primary"
                        :disabled="problem_type == 'communication' && my_interactor == 'unknown'">
                    儲存題目類型
                </button>
            </form>
        </div>
        <br>
        <div class="container-fluid">
            <h4>固定主程式</h4>
            <form v-my-submit="choose_runner">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="enable_runner"
                           name="enable_runner" v-model="enable_runner">
                    <label class="form-check-label" for="enable_runner">啟用固定主程式</label>
                </div>
                <div class="row" v-for="(lang,i) in lang_info" :key="i">
                    <div class="col-auto">
                        <p>{{ lang.name }}: </p>
                    </div>
                    <div class="col-auto">
                        <p v-if="lang.name in data.data.runner_source">{{ data.data.runner_source[lang.name] }}</p>
                        <p v-else>無</p>
                    </div>
                    <div class="col-auto">
                        <select class="form-select" name="my_runner_{{ lang }}"
                                v-model="runner_source[lang.name]">
                            <option selected value="unknown">無</option>
                            <option :value="file.name" v-for="(file,i) in data.data.files" :key="i">{{
                                    file.name
                                }}
                            </option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary">儲存固定主程式設定</button>
            </form>
        </div>
        <br>
        <div class="container-fluid">
            <h4>範例程式</h4>
            <form v-my-submit="choose_sample">
                <div class="row" v-for="(lang,i) in lang_info" :key="i">
                    <div class="col-auto">
                        <p>{{ lang.name }}: </p>
                    </div>
                    <div class="col-auto">
                        <p v-if="lang.name in data.data.default_code">{{ data.data.default_code[lang.name] }}</p>
                        <p v-else>無</p>
                    </div>
                    <div class="col-auto">
                        <select class="form-select" name="my_runner_{{ lang }}"
                                v-model="default_code[lang.name]">
                            <option selected value="unknown">無</option>
                            <option :value="file.name" v-for="(file,i) in data.data.files" :key="i">{{
                                    file.name
                                }}
                            </option>
                        </select>
                    </div>
                </div>
                <button class="btn btn-primary">儲存範例程式設定</button>
            </form>
        </div>
        <br>
        <div class="container-fluid">
            <h4>輔助檔案</h4>
            <div class="row" v-for="(file,i) in data.data.library" :key="i">
                <div class="col-auto">
                    <p>{{ file }}</p>
                </div>
                <div class="col-auto">
                    <button class="btn btn-danger" v-my-click="async ()=>await deleteLibrary(file)">刪除</button>
                </div>
            </div>
            <form v-my-submit="addLibrary">
                <div class="row">
                    <div class="col-auto">
                        <select class="form-select" name="library" v-model="new_library">
                            <option selected value="unknown">無</option>
                            <option :value="file.name" v-for="(file,i) in data.data.files" :key="i">{{
                                    file.name
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary" :disabled="new_library=='unknown'">加入</button>
                    </div>
                </div>
            </form>
        </div>
        <br>
        <div class="container-fluid">
            <h4>程式碼檢查器</h4>
            <p>目前：{{ data.data.codechecker_source }}</p>
            <form v-my-submit="choose_codechecker">
                <select class="form-select" name="my_codechecker" v-model="my_codechecker">
                    <option selected value="unknown">無</option>
                    <option :value="file.name" v-for="(file,i) in data.data.files" :key="i">{{ file.name }}</option>
                </select>
                <div class="radio-selector">
                    <h4>程式碼檢查結果</h4>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="codechecker_mode" id="codechecker_mode1"
                               value="disabled" v-model="codechecker_type">
                        <label class="form-check-label" for="codechecker_mode1">
                            禁用
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="codechecker_mode" id="codechecker_mode2"
                               value="public" v-model="codechecker_type">
                        <label class="form-check-label" for="codechecker_mode2">
                            公開
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="codechecker_mode" id="codechecker_mode3"
                               value="private" v-model="codechecker_type">
                        <label class="form-check-label" for="codechecker_mode3">
                            保密
                        </label>
                    </div>
                </div>
                <button class="btn btn-primary" :disabled="my_codechecker=='unknown'&&codechecker_type!='disabled'"
                        v-my-click="choose_codechecker">儲存程式碼檢查器設定
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineModel, onMounted, ref} from "vue";
import {CodecheckerMode, ProblemManageDetail, ProgramType} from "@/utils/problemdatas";
import {show_modal} from "@/utils/modal";
import {api, getParam} from "@/utils/tools";
import {onOff} from "@/utils/datatypes";
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {storeToRefs} from "pinia";

const data = defineModel<ProblemManageDetail>({required: true});

const pid = getParam("pid");

const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);

const checker_type = ref<ProgramType>("default");
const checker_name1 = ref("unknown");
const checker_name2 = ref("unknown");

type ProblemType = "batch" | "communication" | "output_only";
// eslint-disable-next-line no-unused-vars
const problem_type_names: { [key in ProblemType]: string } = {
    batch: "一般 (Batch)",
    communication: "互動 (Communication)",
    output_only: "只提交輸出 (Output Only)",
};
const problem_type = ref<ProblemType>("batch");
const my_interactor = ref("unknown");
const interact_num = ref<number>(1);

function current_problem_type(): ProblemType {
    if (data.value.data.output_only) return "output_only";
    if (data.value.data.is_interact) return "communication";
    return "batch";
}

const enable_runner = ref<boolean>(false);
const runner_source = ref<{ [lang: string]: string }>({});

const default_code = ref<{ [lang: string]: string }>({});

const new_library = ref("unknown");

const my_codechecker = ref("unknown");
const codechecker_type = ref<CodecheckerMode>("disabled");

async function choose_checker() {
    try {
        await api.put("/problem/" + pid + "/manage/checker", {
            default_checker: checker_name1.value,
            my_checker: checker_name2.value,
            checker_type: checker_type.value,
        });
        data.value.data.checker_source.type = checker_type.value;
        if (checker_type.value == "default") {
            data.value.data.checker_source.name = checker_name1.value;
        } else {
            data.value.data.checker_source.name = checker_name2.value;
        }
        await show_modal("成功", "成功儲存checker");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function choose_problem_type() {
    try {
        const is_interact = problem_type.value == "communication";
        if (is_interact) {
            await api.put("/problem/" + pid + "/manage/interactor", {
                my_interactor: my_interactor.value,
                enable_interactor: onOff(true),
                interact_num: interact_num.value,
            });
            data.value.data.interactor_source = my_interactor.value;
            data.value.data.interact_num = interact_num.value;
        }
        await api.put("/problem/" + pid + "/manage/problem_type", {
            problem_type: problem_type.value,
        });
        data.value.data.is_interact = is_interact;
        data.value.data.output_only = problem_type.value == "output_only";
        await show_modal("成功", "成功儲存題目類型");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function choose_runner() {
    try {
        const dat = {
            enable_runner: onOff(enable_runner.value),
        }
        for (const k in runner_source.value) {
            dat["my_runner_" + k] = runner_source.value[k];
        }
        await api.put("/problem/" + pid + "/manage/runner", dat);
        data.value.data.runner_enabled = enable_runner.value;
        for (const k in runner_source.value) {
            data.value.data.runner_source[k] = runner_source.value[k];
        }
        await show_modal("成功", "成功儲存runner");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function choose_sample() {
    try {
        const dat = {};
        for (const k in default_code.value) {
            dat["my_sample_" + k] = default_code.value[k];
        }
        await api.put("/problem/" + pid + "/manage/sample", dat);
        for (const k in default_code.value) {
            data.value.data.default_code[k] = default_code.value[k];
        }
        await show_modal("成功", "成功儲存sample code");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function deleteLibrary(file: string) {
    try {
        await api.delete("/problem/" + pid + "/manage/library", {
            name: file
        });
        data.value.data.library.splice(data.value.data.library.indexOf(file), 1);
        await show_modal("成功", "成功移除library");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function addLibrary() {
    try {
        await api.post("/problem/" + pid + "/manage/library", {
            library: new_library.value
        });
        data.value.data.library.push(new_library.value);
        await show_modal("成功", "成功追加library");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

async function choose_codechecker() {
    try {
        await api.put("/problem/" + pid + "/manage/codechecker", {
            codechecker_mode: codechecker_type.value,
            my_codechecker: my_codechecker.value
        });
        data.value.data.codechecker_source = my_codechecker.value;
        await show_modal("成功", "成功儲存codechecker");
    } catch (err) {
        await show_modal("失敗", err.message);
    }
}

onMounted(async () => {
    checker_type.value = data.value.data.checker_source.type;
    if (checker_type.value == "default") {
        checker_name1.value = data.value.data.checker_source.name || "unknown";
    } else {
        checker_name2.value = data.value.data.checker_source.name || "unknown";
    }
    problem_type.value = current_problem_type();
    my_interactor.value = data.value.data.interactor_source || "unknown";
    interact_num.value = data.value.data.interact_num || 1;
    enable_runner.value = data.value.data.runner_enabled;
    const dat = data.value.data.runner_source;
    const dat0 = data.value.data.default_code;
    for (const k of lang_info.value) {
        runner_source.value[k.name] = dat[k.name] || "unknown";
        default_code.value[k.name] = dat0[k.name] || "unknown";
    }
})
</script>