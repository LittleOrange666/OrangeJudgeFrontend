<template>
    <div>
    </div>
</template>
<script setup lang="ts">
import {defineProps} from 'vue';
import {ContestDetail} from "@/utils/datatypes";

interface Props {
    data: ContestDetail
}

defineProps<Props>();
</script>