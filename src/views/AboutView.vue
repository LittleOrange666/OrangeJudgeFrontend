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
    <div class="about">
        <h1>編譯與執行參數</h1>
        <div v-if="!store.hasFetched && !store.error" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="store.error" class="alert alert-danger">
            <p>無法載入資料：{{ store.error }}</p>
        </div>
        <div v-else>
            <div class="card" v-for="lang in lang_info" :key="lang.name">
                <div class="card-body">
                    <h5 class="card-title">{{ lang.name }}</h5>
                    <div v-if="lang.compile">
                        <h6 class="card-subtitle mb-2 text-muted">編譯指令</h6>
                        <p class="card-text">{{ lang.compile }}</p>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">執行指令</h6>
                    <p class="card-text">{{ lang.run }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useJudgeInfoStore} from '@/stores/judgeInfo';
import {storeToRefs} from 'pinia';

const store = useJudgeInfoStore();
const {lang_info} = storeToRefs(store);

</script>
