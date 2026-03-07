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
    <div>
        <h3>基本訊息</h3>
        <form v-my-submit="handleSave">
            <input type="hidden" name="action" value="general_info">
            <div class="mb-3">
                <label class="form-label">ID</label>
                <input type="text" class="form-control" v-model="username" disabled>
            </div>
            <div class="mb-3">
                <label class="form-label">email</label>
                <input type="text" class="form-control" v-model="email" disabled>
            </div>
            <div class="mb-3">
                <label for="display_name_input" class="form-label">顯示名稱</label>
                <input type="text" class="form-control" v-model="display_name"
                       id="display_name_input" required pattern="^.{1,120}$">
            </div>
            <button class="btn btn-primary">儲存</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import {computed, defineProps, onMounted, ref} from "vue";
import {UserSettings} from "@/utils/datatypes";
import {show_modal} from "@/utils/modal";
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";

interface Props {
    data: UserSettings
}

const props = defineProps<Props>();
const router = useRouter();

const username = computed(() => props.data.username);
const email = computed(() => props.data.email);
const display_name = ref("");

async function handleSave() {
    try {
        await api.put(`/accounts/settings/profile`, {
            display_name: display_name.value,
        });
        await show_modal("成功", "成功儲存");
        await router.go(0);
    } catch (error) {
        await show_modal("失敗", error.message);
    }
}

onMounted(async () => {
    display_name.value = props.data.display_name;
})
</script>