import { Directive, DirectiveBinding } from 'vue';

const myClick: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        // 確保傳入的是個函數
        if (typeof binding.value !== 'function') {
            console.warn('[v-my-click] 必須綁定一個函數');
            return;
        }

        // 1. 建立 Spinner 元素
        const spinner = document.createElement('span');
        spinner.className = 'visually-hidden spinner-border spinner-border-sm me-2'; // 加上 me-2 增加間距
        spinner.setAttribute('role', 'status');
        spinner.setAttribute('aria-hidden', 'true');

        // 2. 注入到元素最前方 (prepend)
        el.prepend(spinner);

        // 3. 定義點擊處理邏輯
        const handleClick = async (event: Event) => {
            const fn = binding.value;

            // 防止重複點擊：如果已經在 loading 狀態則跳過
            if (el.getAttribute('disabled') === 'true') return;

            try {
                // 顯示 Spinner 並禁用按鈕
                spinner.classList.remove('visually-hidden');
                el.setAttribute('disabled', 'true');
                el.style.pointerEvents = 'none'; // 額外保險

                // 執行傳入的 async 函數
                await fn(event);
            } finally {
                // 無論成功或失敗，最後都隱藏 Spinner 並還原狀態
                spinner.classList.add('visually-hidden');
                el.removeAttribute('disabled');
                el.style.pointerEvents = '';
            }
        };

        // 儲存引用以便移除
        (el as any)._vueMyClick = handleClick;
        el.addEventListener('click', handleClick);
    },

    unmounted(el: HTMLElement) {
        // 移除監聽器
        if ((el as any)._vueMyClick) {
            el.removeEventListener('click', (el as any)._vueMyClick);
        }
    }
};

export default myClick;