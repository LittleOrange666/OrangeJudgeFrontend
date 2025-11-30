<template>
  <div v-if="result">
    <div class="test-case">Simple Testing</div>
    <div class="test-case">Lang: {{ result.lang }}</div>
    <div class="test-case">
      <div>Source:</div>
      <pre>{{ result.source_code }}</pre>
    </div>
    <div class="test-case">
      <div>Input:</div>
      <pre>{{ result.input }}</pre>
    </div>

    <!-- Show Compilation Error if it exists -->
    <div class="test-case" v-if="result.result == 'CE'">
      <div>Compilation Error</div>
      <pre>{{ result.ce_msg }}</pre>
    </div>

    <!-- Show other results if not a compilation error -->
    <div v-else>
      <div class="test-case">
        <div>Output:</div>
        <pre>{{ result.output }}</pre>
      </div>
      <div class="test-case">
        <div>stderr:</div>
        <pre>{{ result.error }}</pre>
      </div>
      <div class="test-case">
        <div>Result:</div>
        <pre>{{ result.result }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  result: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.test-case {
  font-size: 1.1rem;
}
pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.25rem;
}
</style>
