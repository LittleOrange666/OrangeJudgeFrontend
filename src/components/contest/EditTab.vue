<template>
    <div>
        <div v-if="loading" class="text-center">
            <p>Loading...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
            <p>無法載入頁面：{{ error }}</p>
        </div>
        <form @submit.prevent="handleSave" v-else>
            <div class="mb-3">
                <label for="contest_title" class="form-label">比賽名稱</label>
                <input type="text" class="form-control" id="contest_title"
                       placeholder="比賽名稱"
                       v-model="name" required pattern=".{1,120}">
            </div>
            <h4>比賽時間</h4>
            <div class="mb-3">
                <label for="start_time" class="form-label">開始時間</label>
                <input type="datetime-local" class="form-control" id="start_time" v-model="start_time" step="60"
                       required>
            </div>
            <div class="mb-3">
                <label for="elapsed_time" class="form-label">持續時間(分鐘)</label>
                <input type="number" class="form-control" id="elapsed_time" v-model="elapsed_time"
                       placeholder="持續時間" required>
            </div>
            <div class="radio-selector">
                <h4>比賽可見</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="show_contest" id="show_contest1"
                           value="yes">
                    <label class="form-check-label" for="show_contest1">
                        是
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="show_contest" id="show_contest2"
                           value="no">
                    <label class="form-check-label" for="show_contest2">
                        否
                    </label>
                </div>
            </div>
            <div class="radio-selector">
                <h4>計分規則</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="rule_type" id="rule_type1" value="icpc">
                    <label class="form-check-label" for="rule_type1">
                        ACM ICPC
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="rule_type" id="rule_type2" value="ioi">
                    <label class="form-check-label" for="rule_type2">
                        IOI style
                    </label>
                </div>
            </div>
            <div class="mb-3">
                <label for="penalty" class="form-label">罰時(分鐘)</label>
                <input type="number" class="form-control" id="penalty" v-model="penalty" placeholder="罰時" required>
            </div>
            <div class="radio-selector">
                <h4>後測</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="pretest_type" id="pretest_type1"
                           value="no">
                    <label class="form-check-label" for="pretest_type1">
                        無後測
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="pretest_type" id="pretest_type2"
                           value="all">
                    <label class="form-check-label" for="pretest_type2">
                        對所有提交計分
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="pretest_type" id="pretest_type3"
                           value="last">
                    <label class="form-check-label" for="pretest_type3">
                        對最後提交計分
                    </label>
                </div>
            </div>
            <div class="radio-selector">
                <h4>自行報名</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="register_type" id="register_type1"
                           value="yes">
                    <label class="form-check-label" for="register_type1">
                        是
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="register_type" id="register_type2"
                           value="no">
                    <label class="form-check-label" for="register_type2">
                        否
                    </label>
                </div>
            </div>
            <div class="radio-selector">
                <h4>賽後練習</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="practice_type" id="practice_type1"
                           value="no">
                    <label class="form-check-label" for="practice_type1">
                        不開放
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="practice_type" id="practice_type2"
                           value="private">
                    <label class="form-check-label" for="practice_type2">
                        僅參賽者
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="practice_type" id="practice_type3"
                           value="public">
                    <label class="form-check-label" for="practice_type3">
                        公開
                    </label>
                </div>
            </div>
            <div class="radio-selector">
                <h4>記分板可見</h4>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="show_standing" id="show_standing1"
                           value="yes">
                    <label class="form-check-label" for="show_standing1">
                        是
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" v-model="show_standing" id="show_standing2"
                           value="no">
                    <label class="form-check-label" for="show_standing2">
                        否
                    </label>
                </div>
            </div>
            <div class="mb-3">
                <label for="freeze_time" class="form-label">封版時間(分鐘)</label>
                <input type="number" class="form-control" id="freeze_time" v-model="freeze_time"
                       placeholder="封版時間" required>
            </div>
            <div class="mb-3">
                <label for="unfreeze_time" class="form-label">解封時間(分鐘)</label>
                <input type="number" class="form-control" id="unfreeze_time" v-model="unfreeze_time"
                       placeholder="解封時間" required>
            </div>
            <div class="row">
                <button class="btn btn-primary">儲存設定</button>
            </div>
        </form>
    </div>
</template>
<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue';
import {ContestDetail, ContestSettings, PracticeType, PretestType, RuleType, yesNo, YesNo} from "@/utils/datatypes";
import {api, date_to_str, getParam, useLoader} from "@/utils/tools";
import {show_modal} from "@/utils/modal";

interface Props {
    data: ContestDetail,
    do_load: () => Promise<void>
}

const props = defineProps<Props>();

const cid = getParam("cid");

const dataLoader = useLoader<ContestSettings>();
const loading = dataLoader.loading;
const error = dataLoader.error;
const settingData = dataLoader.data;

const name = ref("???");
const start_time = ref(date_to_str(new Date()));
const elapsed_time = ref(0);
const show_contest = ref<YesNo>("yes");
const rule_type = ref<RuleType>("icpc");
const penalty = ref(0);
const pretest_type = ref<PretestType>("no");
const register_type = ref<YesNo>("no");
const practice_type = ref<PracticeType>("no");
const show_standing = ref<YesNo>("no");
const freeze_time = ref(0);
const unfreeze_time = ref(0);

const initValues = async () => {
    await dataLoader.load("/contest/" + cid + "/manage/settings");
    if (dataLoader.error.value) return;
    const data = settingData.value;
    name.value = data.contest_title;
    start_time.value = date_to_str(new Date(data.start_time * 1000));
    elapsed_time.value = data.elapsed_time;
    show_contest.value = yesNo(data.show_contest);
    rule_type.value = data.rule_type;
    penalty.value = data.penalty;
    pretest_type.value = data.pretest_type;
    register_type.value = yesNo(data.register_type);
    practice_type.value = data.practice_type;
    show_standing.value = yesNo(data.show_standing);
    freeze_time.value = data.freeze_time;
    unfreeze_time.value = data.unfreeze_time;
};

const handleSave = async () => {
    try {
        await api.put("/contest/" + cid + "/manage/settings", {
            contest_title: name.value,
            start_time: +new Date(start_time.value) / 1000,
            elapsed_time: elapsed_time.value,
            penalty: penalty.value,
            pretest_type: pretest_type.value,
            show_standing: show_standing.value,
            freeze_time: freeze_time.value,
            unfreeze_time: unfreeze_time.value,
            rule_type: rule_type.value,
            practice_type: practice_type.value,
            register_type: register_type.value,
            show_contest: show_contest.value,
        });
        await show_modal("成功", "成功儲存設定");
        await props.do_load();
    } catch (error) {
        await show_modal("儲存設定失敗", error.message);
    }
};
onMounted(async () => {
    await initValues();
});
</script>