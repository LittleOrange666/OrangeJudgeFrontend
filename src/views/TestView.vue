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
import {basicSetup} from "@codemirror/basic-setup";
import {Codemirror} from "vue-codemirror";


const extensions = [
    basicSetup,
];
const input = ref('');
</script>
