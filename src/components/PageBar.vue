<template>
  <div v-if="loading" class="text-center">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入資料：{{ error }}</p>
  </div>
  <nav v-else>
    <ul class="pagination">
      <li class="page-item">
        <button class="page-link" aria-label="Previous" :disabled="page_manager.page.value==='1'"
                v-on:click="page_manager.to_page(+page_manager.page.value-1)">
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <li class="page-item" :key="pages" v-for="pages in page_manager.show_pages.value">
        <a class="page-link" v-on:click="page_manager.to_page(pages)" v-text="pages"></a>
      </li>
      <li class="page-item">
        <button class="page-link" aria-label="Next" :disabled="page_manager.page.value===page_manager.page_count.value"
                v-on:click="page_manager.to_page(+page_manager.page.value+1)">
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
<script setup>
import {computed, defineProps} from 'vue';
const props = defineProps({
  page_manager: {
    type: Object,
    required: true
  }
});
const loading = computed(()=>props.page_manager.loading.value);
const error = computed(()=>props.page_manager.error.value);
</script>