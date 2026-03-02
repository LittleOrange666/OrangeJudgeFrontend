<template>
    <div type="text" class="input-group mb-3 limit-input" :id="id">
        <input type="number" class="form-control" :id="`${id}_1`" v-model="val1" min="1" step="1">
        <span class="input-group-text">per</span>
        <input type="number" class="form-control" :id="`${id}_2`" v-model="val2" min="1" step="1">
        <select class="form-select" :id="`${id}_3`" v-model="val3">
            <option value="hour">hour</option>
            <option value="minute">minute</option>
            <option value="second">second</option>
        </select>
    </div>
</template>

<script setup lang="ts">
import {defineProps, onMounted, ref} from "vue";
import {timeUnit} from "@/utils/datatypes";

interface Props {
    value: string;
    id: string;
}

const props = defineProps<Props>();

const val1 = ref(1);
const val2 = ref(1);
const val3 = ref<timeUnit>("second");

onMounted(() => {
    const val = props.value;
    const vals = val.split(" ");
    val1.value = vals[0];
    val2.value = vals.length > 3 ? vals[2] : "1";
    val3.value = vals.length > 3 ? vals[3] : vals[2];
});
</script>