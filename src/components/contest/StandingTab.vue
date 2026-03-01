<template>
    <div>
        <div class="row">
            <div class="col-auto">
                <button class="btn btn-primary" v-my-click="refresh" :disabled="standingLoading">刷新</button>
            </div>
            <div class="form-check col-auto">
                <input class="form-check-input" type="checkbox" value="" v-model="autoRefresh"
                       id="standing_auto_refresh"
                       :disabled="standingLoading">
                <label class="form-check-label" for="standing_auto_refresh">
                    自動刷新
                </label>
            </div>
            <div class="form-check col-auto">
                <input class="form-check-input" type="checkbox" value="" v-model="officialOnly"
                       id="standing_official_only"
                       :disabled="standingLoading">
                <label class="form-check-label" for="standing_official_only">
                    僅正式排名
                </label>
            </div>
        </div>
        <div v-if="standingLoading" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="standingError" class="alert alert-danger">
            <p>無法載入頁面：{{ standingError }}</p>
        </div>
        <table class="table table-hover table-striped" v-else>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col" v-for="(text,i) in headLine" :key="i">{{ text }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(line,i) in content" :key="i">
                <th scope="row">{{ line.first }}</th>
                <td v-for="(text,j) in line.last" :key="j">{{ text }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup lang="ts">
import {computed, defineProps, onMounted, ref, watch} from 'vue';
import {ContestDetail, ContestStanding} from "@/utils/datatypes";
import {getParam, useLoader} from "@/utils/tools";
import {resolveICPC, resolveIOI, StandingDisplay} from "@/utils/standing";

interface Props {
    data: ContestDetail;
}

defineProps<Props>();

const cid = getParam("cid");

const officialOnly = ref(false);
const autoRefresh = ref(false);

const standing = useLoader<ContestStanding>();

const refreshLoading = ref(false);
const standingLoading = computed(() => standing.loading.value || refreshLoading.value);
const standingError = computed(() => standing.error.value);

const contents = ref<StandingDisplay>({headLine: [], content: []});

const headLine = computed(() => contents.value.headLine);
const content = computed(() => contents.value.content);

async function refreshStanding() {
    const data = standing.data.value;
    if (data.rule === "ioi") contents.value = resolveIOI(data, officialOnly.value);
    else contents.value = resolveICPC(data, officialOnly.value);
}

async function refresh() {
    refreshLoading.value = true;
    await standing.load("/contest/" + cid + "/standing");
    await refreshStanding();
    refreshLoading.value = false;
}

async function justRefresh() {
    refreshLoading.value = true;
    await refreshStanding();
    refreshLoading.value = false;
}

onMounted(async () => {
    await refresh();
    watch(officialOnly, justRefresh);
})
</script>