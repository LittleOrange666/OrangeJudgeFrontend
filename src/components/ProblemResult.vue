<template>
  <div v-if="result">
    <div class="test-case">Problem:
      <router-link :to="`/problem/${result.pid}`">{{ problem_name }}</router-link>
    </div>
    <div class="test-case">Lang: {{ result.lang }}</div>
    <div class="test-case">
      <div>Source:</div>
      <pre><code v-highlight>{{ result.source_code }}</code></pre>
    </div>
    <table class="table table-hover">
      <thead>
      <tr class="table-light">
        <th scope="col">index</th>
        <th scope="col">result</th>
        <th scope="col">Time(ms)</th>
        <th scope="col">Memory(KB)</th>
        <th scope="col">Score</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(testcase, i) in result.result.detail" :key="i" :class="result_css_class(testcase.result)">
        <th scope="row">{{ i }}</th>
        <td>{{ testcase.result }}</td>
        <td>{{ testcase.time }}</td>
        <td>{{ testcase.mem }}</td>
        <td>{{ testcase.score }}</td>
      </tr>
      </tbody>
    </table>
    <div v-if="result.completed">
      <div class="test-case" v-if="result.result.CE">
        <div>Compilation Error</div>
        <pre>{{ result.ce_msg }}</pre>
      </div>
      <div v-else>
        <div class="test-case">Total Score: {{ result.result["total_score"] }}</div>
        <table class="table table-hover" v-if="result.result.group_result">
          <thead>
          <tr class="table-light">
            <th scope="col">Group</th>
            <th scope="col">result</th>
            <th scope="col">Time(ms)</th>
            <th scope="col">Memory(KB)</th>
            <th scope="col">Score</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(gp_result, name) in result.result.group_result" :key="name" :class="result_css_class(gp_result.result)">
            <th scope="row">{{ name }}</th>
            <td>{{ gp_result.result }}</td>
            <td>{{ gp_result.time }}</td>
            <td>{{ gp_result.mem }}</td>
            <td>{{ gp_result.gained_score }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, onMounted, ref} from 'vue';
import {api} from "@/utils/tools";
import {result_css_class} from "@/utils/constants";

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
});
const problem_name = ref("???");

onMounted(async () => {
  const pid = props.result.pid;
  try {
    const data = await api.get("/problem/" + pid);
    problem_name.value = data.title;
  } catch (err) {
    console.log("無法載入題目名稱")
  }
});

</script>
