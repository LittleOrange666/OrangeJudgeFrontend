<template>
  <div v-if="loading" class="text-center">
    <p>Loading...</p>
  </div>
  <div v-else-if="error" class="alert alert-danger">
    <p>無法載入頁面：{{ error }}</p>
  </div>
  <nav v-else>
    <ul class="pagination">
      <li class="page-item">
        <button class="page-link" aria-label="Previous" :disabled="!has_prev"
                v-on:click="to_prev_page">
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <li class="page-item" :key="pages" v-for="pages in page_manager.show_pages.value">
        <a class="page-link" v-on:click="page_manager.to_page(pages)" v-text="pages"></a>
      </li>
      <li class="page-item">
        <button class="page-link" aria-label="Next" :disabled="!has_next"
                v-on:click="to_next_page">
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import {computed, defineProps} from 'vue';
import {PageManager} from "@/utils/page";

interface Props{
  page_manager: PageManager<any>
}

const props = defineProps<Props>();
const loading = computed(()=>props.page_manager.loading.value);
const error = computed(()=>props.page_manager.error.value);
const has_prev = computed(()=>""+props.page_manager.page.value !== "1");
const has_next = computed(()=>""+props.page_manager.page.value !== ""+props.page_manager.page_cnt.value);
async function to_next_page(){
  props.page_manager.to_page(+props.page_manager.page.value+1);
}
async function to_prev_page(){
  props.page_manager.to_page(+props.page_manager.page.value-1);
}
</script>