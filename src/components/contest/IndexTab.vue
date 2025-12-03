<template>
  <div>
    <table class="table table-hover table-striped" v-if="can_see_problems">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">名稱</th>
        <th scope="col" v-if="can_edit"></th>
      </tr>
      </thead>
      <tbody>
      <tr class="problem" v-for="problem in data['problems']" :key="problem.pid">
        <th scope="row"><router-link :to="`/contest/${cid}/problem/${problem.pid}`">{{ problem.pid }}</router-link></th>
        <td><router-link :to="`/contest/${cid}/problem/${problem.pid}`">{{ problem.name }}</router-link></td>
        <td v-if="can_edit">
          <button class="btn btn-danger">刪除題目</button>
        </td>
      </tr>
      </tbody>
    </table>
    <p class="h3" v-else>您目前無法觀看題目</p>
  </div>
</template>
<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {useRoute} from "vue-router";

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
const route = useRoute();
const can_see_problems = computed(() => props.data['can_see_problems']);
const can_edit = computed(() => props.data['can_edit']);
const cid = route.params.cid;
</script>