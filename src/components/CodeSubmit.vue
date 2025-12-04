<template>
    <form @submit.prevent="handleSubmit">
        <select class="form-select" aria-label="Default select example" v-model="lang">
            <option :value="lang.name" :key="lang.name" v-text="lang.name" v-for="lang in lang_info"></option>
        </select>
        <div class="mb-3">
            <label for="code-textarea" class="form-label">Code</label>
            <input class="form-control" type="file" id="uploadFile" v-on:change="loadFile" :accept="getExt()"/>
            <codemirror id="code-textarea"
                        v-model="code"
                        :style="{ height: '400px', width: '100%', border: '1px solid #ddd' }"
                        :autofocus="true"
                        :indent-with-tab="true"
                        :tab-size="4"
                        :extensions="extensions"
            />
        </div>
        <div class="mb-3">
            <button class="btn btn-primary mb-3">提交</button>
        </div>
        <div v-if="error" class="alert alert-danger col-5 offset-2">{{ error }}</div>
    </form>
</template>
<script setup lang="ts">
import {defineProps, ref} from 'vue';
import {useJudgeInfoStore} from '@/stores/judgeInfo';
import {default_lang} from "@/utils/constants";
import {storeToRefs} from "pinia";
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import {Codemirror} from "vue-codemirror";
import {cpp} from "@codemirror/lang-cpp";
import {basicSetup} from "@codemirror/basic-setup";


interface Props {
    pid: string,
    cid?: string,
    input?: string
}

const props = defineProps<Props>();

const extensions = [
    basicSetup,
    cpp(),
];

const router = useRouter();

const lang = useLocalStorage("lang", default_lang);
const code = ref('');
const error = ref(null);
const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);
const handleSubmit = async () => {
    try {
        const obj = {
            lang: lang.value,
            code: code.value,
            pid: props.pid,
            cid: props.cid
        };
        if (props.input) {
            obj["input"] = props.input;
        }
        const data = await api.post("/submission", obj);
        const idx = data["submission_id"];
        const link = "/submission/" + idx;
        await router.push(link);
    } catch (err) {
        error.value = err.message || '發生未知錯誤';
    }
};

function loadFile() {
    const file = this.files[0];
    const reader = new FileReader();
    const target = this;
    reader.onload = function () {
        code.value = this.result
        target.value = null;
    };
    reader.readAsText(file);
}

const getExt = () => {
    for (let langs of lang_info.value) {
        if (langs.name === lang.value) {
            return langs.ext;
        }
    }
    return null;
};
</script>