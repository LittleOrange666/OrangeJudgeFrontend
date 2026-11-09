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

<!-- CodeMirror editor whose syntax highlighting follows a judge language (or a filename). -->
<template>
    <codemirror v-model="code"
                :style="{ height: height, width: '100%', border: '1px solid #ddd' }"
                :autofocus="autofocus"
                :indent-with-tab="true"
                :tab-size="4"
                :extensions="extensions"
    />
</template>

<script setup lang="ts">
import {defineModel, defineProps, shallowRef, watch, withDefaults} from "vue";
import {Codemirror} from "vue-codemirror";
import {basicSetup} from "codemirror";
import type {Extension} from "@codemirror/state";
import {storeToRefs} from "pinia";
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {detectMode, fileExt, langExt, loadMode} from "@/utils/codeLang";

interface Props {
    /** judge language name, e.g. "C++17" */
    lang?: string | null,
    /** name of the edited file; its extension is used when the language does not decide the mode */
    filename?: string | null,
    height?: string,
    autofocus?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
    lang: null,
    filename: null,
    height: "400px",
    autofocus: false,
});
const code = defineModel<string>({default: ""});

const {lang_info} = storeToRefs(useJudgeInfoStore());
// vue-codemirror reconfigures the editor whenever this array is replaced
const extensions = shallowRef<Extension[]>([basicSetup]);
let request = 0;

watch(() => [props.lang, props.filename, lang_info.value] as const, async () => {
    const ext = props.filename ? fileExt(props.filename) : (props.lang ? langExt(props.lang, lang_info.value) : null);
    const mode = detectMode(props.lang, ext);
    const current = ++request;
    let lang_ext: Extension = [];
    try {
        lang_ext = await loadMode(mode);
    } catch (err) {
        console.error("Failed to load editor language", mode, err);
    }
    if (current === request) extensions.value = [basicSetup, lang_ext];
}, {immediate: true});
</script>
