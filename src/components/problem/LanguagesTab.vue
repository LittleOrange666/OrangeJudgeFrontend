<template>
    <div>
        <h3>語言</h3>
        <form v-my-submit="save_lang">
            <div class="input-group" v-for="(lang,i) in lang_info" :key="i">
                <span class="input-group-text">{{ lang.name }}</span>
                <div class="input-group-text">
                    <input class="form-check-input mt-0" type="checkbox" v-model="lang_check[lang.name]"
                           :id="`lang_check_${ lang.name }`">
                    <label class="form-check-label" :for="`lang_check_${ lang.name }`">
                        啟用
                    </label>
                </div>
                <input type="number" min="1" max="100" step="0.1" class="form-control" v-model="lang_mul[lang.name]">
                <span class="input-group-text">倍</span>
            </div>
            <button class="btn btn-primary" data-no-refresh="true">儲存</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import {computed, defineProps, onMounted, ref} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";
import {useJudgeInfoStore} from "@/stores/judgeInfo";
import {OnOff, onOff} from "@/utils/datatypes";
import {show_modal} from "@/utils/modal";
import {api, getParam} from "@/utils/tools";

interface Props{
    data: ProblemManageDetail;
}

const props = defineProps<Props>();

const pid = getParam("pid");

const lang_info = computed(() => {
    const judgeInfoStore = useJudgeInfoStore();
    return judgeInfoStore.lang_info;
})

const lang_check = ref<{[lang: string]: boolean}>({});
const lang_mul = ref<{[lang: string]: number}>({});

async function save_lang(){
    const out: {[key: string]: number | OnOff} = {};
    for(const lang of lang_info.value){
        out["lang_check_"+lang.name] = onOff(lang_check.value[lang.name]);
        out["lang_mul_"+lang.name] = lang_mul.value[lang.name];
    }
    try{
        await api.put("/problem/"+pid+"/manage/language", out);
        await show_modal("成功", "成功儲存設置");
    }catch(err){
        await show_modal("失敗", err.message);
    }
}

onMounted(() => {
    const lang_check_tmp = props.data.data.languages;
    const lang_mul_tmp = props.data.data.language_multipliers;
    for(const lang of lang_info.value) {
        if (!(lang.name in lang_check_tmp)) {
            lang_check_tmp[lang.name] = true;
        }
        if (!(lang.name in lang_mul_tmp)) {
            lang_mul_tmp[lang.name] = 1;
        }
    }
    lang_check.value = lang_check_tmp;
    lang_mul.value = lang_mul_tmp;
});
</script>