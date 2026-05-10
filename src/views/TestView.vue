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
    <div class="mb-3">
        <label for="input-textarea" class="form-label">Input</label>
        <codemirror
            id="input-textarea"
            v-model="input"
            :style="{ height: '400px', width: '100%', border: '1px solid #ddd' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="4"
            :extensions="extensions"
        />
    </div>
    <CodeSubmit pid="test" :input="input"/>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import CodeSubmit from "@/components/CodeSubmit.vue";
import {basicSetup} from "codemirror";
import {Codemirror} from "vue-codemirror";


const extensions = [
    basicSetup,
];
const input = ref('');
</script>
