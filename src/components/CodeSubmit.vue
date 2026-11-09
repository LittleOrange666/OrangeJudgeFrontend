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
    <form v-my-submit="handleSubmit">
        <select class="form-select" aria-label="Default select example" v-model="lang">
            <template v-for="lang in lang_info">
                <option :value="lang.name" :key="lang.name" v-text="lang.name" v-if="!allowed_lang || allowed_lang.includes(lang.name)"></option>
            </template>
        </select>
        <div class="mb-3">
            <label for="code-textarea" class="form-label">Code</label>
            <input class="form-control" type="file" id="uploadFile" v-on:change="loadFile"/>
            <CodeEditor id="code-textarea" v-model="code" :lang="lang" :autofocus="true"/>
        </div>
        <div class="mb-3">
            <button class="btn btn-primary mb-3">提交</button>
        </div>
        <div v-if="error" class="alert alert-danger col-5 offset-2">{{ error }}</div>
    </form>
</template>
<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';
import {useJudgeInfoStore} from '@/stores/judgeInfo';
import {default_lang} from "@/utils/constants";
import {storeToRefs} from "pinia";
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";
import {useLocalStorage} from "@vueuse/core";
import CodeEditor from "@/components/CodeEditor.vue";
import {fileExt, langExt, langForFilename} from "@/utils/codeLang";


interface Props {
    pid: string,
    cid?: string,
    input?: string,
    allowed_lang?: string[]
}

const props = defineProps<Props>();

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

function loadFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    // switch to a language matching the file's extension unless the selected one already does
    if (langExt(lang.value, lang_info.value) !== fileExt(file.name)) {
        const detected = langForFilename(file.name, lang_info.value, props.allowed_lang);
        if (detected) lang.value = detected;
    }
    const reader = new FileReader();
    reader.onload = () => {
        code.value = reader.result as string;
        target.value = "";
    };
    reader.readAsText(file);
}
onMounted(async ()=>{
    if (props.allowed_lang && !props.allowed_lang.includes(lang.value)){
        lang.value = props.allowed_lang[0];
    }
});
</script>