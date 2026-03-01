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
import {computed, onMounted, ref, defineProps} from "vue";
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

async function handleSave(){
    try{
        await api.put(`/accounts/settings/profile`, {
            display_name: display_name.value,
        });
        await show_modal("成功", "成功儲存");
        await router.go(0);
    }catch(error){
        await show_modal("失敗", error.message);
    }
}
onMounted(async () => {
    display_name.value = props.data.display_name;
})
</script>