<!--
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
    <div v-if="result">
        <div class="test-case">Simple Testing</div>
        <div class="test-case">Lang: {{ result.lang }}</div>
        <div class="test-case">
            <div>Source:</div>
            <pre><code v-highlight v-can-copy>{{ result.source_code }}</code></pre>
        </div>
        <div class="test-case">
            <div>Input:</div>
            <pre><code v-highlight v-can-copy>{{ result.input }}</code></pre>
        </div>

        <!-- Show Compilation Error if it exists -->
        <div class="test-case" v-if="result.result === 'CE'">
            <div>Compilation Error</div>
            <pre><code v-highlight v-can-copy>{{ result.ce_msg }}</code></pre>
        </div>

        <!-- Show other results if not a compilation error -->
        <div v-else>
            <div class="test-case">
                <div>Output:</div>
                <pre><code v-highlight v-can-copy>{{ result.output }}</code></pre>
            </div>
            <div class="test-case">
                <div>stderr:</div>
                <pre><code v-highlight v-can-copy>{{ result.error }}</code></pre>
            </div>
            <div class="test-case">
                <div>Result:</div>
                <pre><code v-highlight v-can-copy>{{ result.result }}</code></pre>
            </div>
        </div>
        <div v-if="!result.completed">
            <div v-if="result.pos > 0 ">Waiting in queue... ({{ result.pos }})</div>
            <div v-else>Judging...</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from 'vue';
import {SubmissionDetail} from "@/utils/datatypes";

interface Props {
    result: SubmissionDetail
}

defineProps<Props>();
</script>
