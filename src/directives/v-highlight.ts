import hljs from 'highlight.js';

const highlightDirective = {
    // 當元素插入到 DOM 中時呼叫
    mounted(el: HTMLElement, binding: any) {
        // 檢查是否有傳入語言參數，如果沒有則讓 highlight.js 自動偵測
        const language = binding.arg;

        // 取得程式碼內容
        const code = el.textContent;

        if (language) {
            // 依指定語言高亮
            const result = hljs.highlight(code, {language: language});
            el.innerHTML = result.value;
        } else {
            // 自動偵測並高亮
            hljs.highlightElement(el);
        }
    },

    // 如果綁定的元素內容（例如 v-html）發生變化時，重新高亮
    updated(el) {
        hljs.highlightElement(el);
    }
};

export default highlightDirective;