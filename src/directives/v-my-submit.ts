import { Directive, DirectiveBinding } from 'vue';

const mySubmit: Directive = {
    mounted(el: HTMLFormElement, binding: DirectiveBinding) {
        if (typeof binding.value !== 'function') {
            console.warn('[v-my-submit] 必須綁定一個函數');
            return;
        }

        // 1. 尋找對應的提交按鈕 (預設為 type="submit"，若無則找第一個 button)
        const submitBtn = el.querySelector('button[type="submit"]') || el.querySelector('button');

        if (!submitBtn) {
            console.warn('[v-my-submit] 找不到提交按鈕');
            return;
        }

        // 2. 建立並注入 Spinner (預設隱藏)
        const spinner = document.createElement('span');
        spinner.className = 'spinner-border spinner-border-sm me-2 d-none';
        spinner.setAttribute('role', 'status');
        (submitBtn as HTMLElement).prepend(spinner);

        // 3. 定義提交處理器
        const handleSubmit = async (event: Event) => {
            // 阻止表單預設的頁面跳轉行為
            event.preventDefault();

            const fn = binding.value;
            try {
                // 顯示 Loading 狀態
                spinner.classList.remove('d-none');
                submitBtn.setAttribute('disabled', 'true');

                await fn(event);
            } finally {
                // 恢復狀態
                spinner.classList.add('d-none');
                submitBtn.removeAttribute('disabled');
            }
        };

        // 4. 綁定到 form 的 submit 事件
        el.addEventListener('submit', handleSubmit);

        // 儲存引用以便卸載
        (el as any)._vueFormHandler = handleSubmit;
    },

    unmounted(el: HTMLFormElement) {
        if ((el as any)._vueFormHandler) {
            el.removeEventListener('submit', (el as any)._vueFormHandler);
        }
    }
};

export default mySubmit;