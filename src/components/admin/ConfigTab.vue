<template>
    <div>
        <p>部分設定可能要重啟後才生效</p>
        <p>以下按鈕可以停止伺服器，若設置正確則會自動重啟</p>
        <button class="btn btn-danger" v-on:click="stopServer">停止伺服器</button>
        <div v-if="loading" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
            <p>無法載入頁面：{{ error }}</p>
        </div>
        <form v-else @submit.prevent="saveConfig">
            <div v-for="(category,i) in data.config" :key="i">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ category.title }}</h5>
                    <div v-for="(slot,j) in category.slots" :key="j">
                        <div class="mb-3" v-if="slot.type === 'str'">
                            <label :for="`config_${ category.name }_${ slot.name }`"
                                   class="form-label">{{ slot.title }}</label>
                            <input type="text" class="form-control config-input"
                                   :id="`config_${ category.name }_${ slot.name }`"
                                   :value="slot.value">
                        </div>
                        <div class="mb-3" v-if="slot.type === 'int'">
                            <label :for="`config_${ category.name }_${ slot.name }`"
                                   class="form-label">{{ slot.title }}</label>
                            <input type="text" class="form-control config-input"
                                   :id="`config_${ category.name }_${ slot.name }`"
                                   :value="slot.value" min="1" step="1">
                        </div>
                        <div class="form-check" v-if="slot.type === 'bool'">
                            <input class="form-check-input config-input" type="checkbox" value="true"
                                   :id="`config_${ category.name }_${ slot.name }`"
                                   :checked="slot.value as boolean">
                            <label :for="`config_${ category.name }_${ slot.name }`"
                                   class="form-check-label">{{ slot.title }}</label>
                        </div>
                        <div class="mb-3" v-if="slot.type === 'limit'">
                            <label :for="`config_${ category.name }_${ slot.name }`"
                                   class="form-label">{{ slot.title }}</label>
                            <LimitInput :id="`config_${ category.name }_${ slot.name }`" :value="slot.value as string" />
                        </div>
                        <div class="mb-3" v-if="slot.type === 'limits'">
                            <div v-for="(limit,i) in slot.value as string[]" :key="i">
                                <label :for="`config_${ category.name }_${ slot.name }_${ i }`"
                                       class="form-label">{{ slot.title }}{{ i+1 }}</label>
                                <LimitInput :id="`config_${ category.name }_${ slot.name }_${ i }`" :value="limit" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br>
        </div>
            <div class="mb-3">
                <button class="btn btn-primary">確認儲存</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import {double_check, show_modal} from "@/utils/modal";
import {ConfigClass} from "@/utils/datatypes";
import {api, useLoader} from "@/utils/tools";
import {onMounted} from "vue";
import LimitInput from "@/components/admin/LimitInput.vue";
import {useRouter} from "vue-router";

interface ConfigData{
    config: ConfigClass[]
}

const {data, loading, error, load} = useLoader<ConfigData>();
const router = useRouter();

async function stopServer(){
    const res = await double_check("停止伺服器");
    if(!res) return;
    try{
        await api.post("/admin/stop");
        await show_modal("成功","即將關閉伺服器");
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

async function saveConfig(){
    const res: [string, string | [string,string,string]][] = [];
    for(const ele of document.querySelectorAll(".limit-input")){
        const id = ele.getAttribute("id");
        const val1 = document.getElementById(id+"_1") as HTMLInputElement;
        const val2 = document.getElementById(id+"_2") as HTMLInputElement;
        const val3 = document.getElementById(id+"_3") as HTMLInputElement;
        res.push([id, [val1.value, val2.value, val3.value]]);
    }
    for(const e of document.querySelectorAll(".config-input")){
        const ele = e as HTMLInputElement;
        const id = ele.getAttribute("id");
        const val = ele.getAttribute("type") !== "checkbox" ? ele.value :
            (ele.checked ? "true" : "false");
        res.push([id,val]);
    }
    try{
        await api.put("/admin/config", {
            config: JSON.stringify(res),
        });
        await show_modal("成功","成功儲存設定")
        router.go(0);
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

onMounted(async () => {
    await load("/admin/config");
})
</script>