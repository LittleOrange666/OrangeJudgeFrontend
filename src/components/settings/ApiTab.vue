<template>
    <div>
        <h3>API KEY</h3>
        <button class="btn btn-primary" v-my-click="genKey">重新生成</button>
        <div class="row">
            <div class="col-12">
                API key:
            </div>
            <div class="col-12">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" v-model="key"
                           placeholder="API key" disabled>
                    <button class="btn btn-outline-secondary" type="button" v-my-click="copyKey">複製</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {api} from "@/utils/tools";
import {show_modal} from "@/utils/modal";
import {ref} from "vue";
import {useClipboard} from "@vueuse/core";


const key = ref("UNKNOWN");
async function genKey() {
    try{
        const data = await api.post(`/accounts/gen_key`);
        key.value = data.api_key;
        await show_modal("成功", "成功生成API KEY")
    }catch(error){
        await show_modal("失敗", error.message);
    }
}
async function copyKey() {
    const {copy} = useClipboard();
    await copy(key.value);
}
</script>