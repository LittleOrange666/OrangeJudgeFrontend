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
