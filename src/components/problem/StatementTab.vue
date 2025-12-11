<template>
    <div>
        <h3>題敘</h3>
        <div class="container-fluid">
            <div class="mb-3">
                <label class="form-label">題目敘述</label>
                <VMarkdownEditor v-model="main" locale="zh" />
            </div>
            <div class="mb-3">
                <label class="form-label">輸入說明</label>
                <VMarkdownEditor v-model="input" locale="zh" />
            </div>
            <div class="mb-3">
                <label class="form-label">輸出說明</label>
                <VMarkdownEditor v-model="output" locale="zh" />
            </div>
            <div class="mb-3">
                <label class="form-label">互動說明</label>
                <VMarkdownEditor v-model="interaction" locale="zh" />
            </div>
            <div class="mb-3">
                <label class="form-label">配分</label>
                <VMarkdownEditor v-model="scoring" locale="zh" />
            </div>
            <div class="mb-3">
                <label class="form-label">Note</label>
                <VMarkdownEditor v-model="note" locale="zh" />
            </div>
            <div class="mb-3">
                <label class="form-label">Custom full Markdown</label>
                <VMarkdownEditor v-model="full" locale="zh" />
            </div>
            <div class="card card-body">
                <div class="row" v-for="(sample,i) in samples" :key="i">
                    <div class="col">
                        <label :for="`sample_input_${ i }`" class="form-label">Input {{ i + 1 }}</label>
                        <textarea class="form-control" :id="`sample_input_${ i }`"
                                  rows="3" v-model="sample.in_txt"></textarea>
                    </div>
                    <div class="col">
                        <label :for="`sample_output_${ i }`" class="form-label">Output {{ i + 1 }}</label>
                        <textarea class="form-control" :id="`sample_output_${ i }`"
                                  rows="3" v-model="sample.out_txt"></textarea>
                    </div>
                    <div class="col">
                        <button class="btn btn-danger" v-on:click="removeSample(i)">刪除範例</button>
                    </div>
                </div>
                <button class="btn btn-success" v-on:click="addSample">新增範例</button>
            </div>
            <button class="btn btn-primary" v-on:click="handleSave">儲存</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import {ManualSample, ProblemManageDetail} from "@/utils/problemdatas";
import {api, getParam} from "@/utils/tools";
// noinspection TypeScriptCheckImport
import {VMarkdownEditor} from 'vue3-markdown';
import {show_modal} from "@/utils/modal";

interface Props {
    data: ProblemManageDetail;
    do_load: () => Promise<void>;
}

const props = defineProps<Props>();

const pid = getParam("pid");

const main = ref("");
const input = ref("");
const output = ref("");
const interaction = ref("");
const scoring = ref("");
const note = ref("");
const full = ref("");
const samples = ref<ManualSample[]>([]);

async function handleSave() {
    try{
        await api.put("/problem/"+pid+"/manage/statement", {
            statement_main: main.value,
            statement_input: input.value,
            statement_output: output.value,
            statement_interaction: interaction.value,
            statement_scoring: scoring.value,
            statement_note: note.value,
            statement_full: full.value,
            statement_type: "md",
            samples: JSON.stringify(samples.value),
        });
        await show_modal("成功","成功儲存");
        await props.do_load();
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function addSample(){
    samples.value.push({"in_txt":"", "out_txt":""});
}

async function removeSample(i){
    samples.value.splice(i,1);
}

onMounted(() => {
    const statement = props.data.data.statement;
    main.value = statement.main;
    input.value = statement.input;
    output.value = statement.output;
    interaction.value = statement.interaction;
    scoring.value = statement.scoring;
    note.value = statement.note;
    full.value = statement.full;
    samples.value = props.data.data.manual_samples;
});
</script>