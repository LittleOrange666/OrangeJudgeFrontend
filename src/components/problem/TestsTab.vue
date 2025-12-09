<template>
    <div>
        <h3>測資</h3>
    </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {ProblemManageDetail} from "@/utils/problemdatas";

interface Props{
    data: ProblemManageDetail;
}

defineProps<Props>();
</script>