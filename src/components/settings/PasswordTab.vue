<template>
    <div>
        <h3>變更密碼</h3>
        <form v-my-submit="changePassword">
            <input type="hidden" name="action" value="change_password">
            <div class="mb-3">
                <label for="old_password" class="form-label">舊密碼</label>
                <input type="password" class="form-control" id="old_password" v-model="old_password"
                       placeholder="舊密碼"
                       required>
            </div>
            <div class="mb-3">
                <label for="new_password" class="form-label">新密碼</label>
                <input type="password" class="form-control" id="new_password" v-model="new_password"
                       placeholder="新密碼"
                       required
                       pattern="^.{6,}$">
            </div>
            <div class="mb-3">
                <label for="new_password_again" class="form-label">重複新密碼</label>
                <input type="password" class="form-control" id="new_password_again" placeholder="重複新密碼"
                       v-model="new_password_again" required>
            </div>
            <button class="btn btn-primary">變更密碼</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {show_modal} from "@/utils/modal";
import {api} from "@/utils/tools";
import {useRouter} from "vue-router";

const router = useRouter();

const old_password = ref("");
const new_password = ref("");
const new_password_again = ref("");

async function changePassword() {
    if (new_password_again.value != new_password.value) {
        await show_modal("錯誤", "重複新密碼錯誤");
        return;
    }
    if (new_password.value.length < 6) {
        await show_modal("錯誤", "新密碼太短");
        return;
    }
    try {
        await api.put(`/accounts/settings/password`, {
            old_password: old_password.value,
            new_password: new_password.value,
        });
        await show_modal("成功", "成功變更密碼")
        await router.go(0);
    } catch (error) {
        await show_modal("失敗", error.message);
    }
}
</script>