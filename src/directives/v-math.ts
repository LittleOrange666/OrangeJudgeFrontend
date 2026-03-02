import {Directive, nextTick} from 'vue';

const vMath: Directive = {
    // 當元素掛載或更新時觸發
    async updated(el: HTMLElement) {
        await nextTick();
        if (window.MathJax && window.MathJax.typesetPromise) {
            // 僅針對該元素 (el) 及其子元素進行渲染，效能比全域重新渲染好
            window.MathJax.typesetPromise([el]).catch((err) =>
                console.error('MathJax rendering failed:', err)
            );
        }
    },
    // 初始掛載時也執行一次
    async mounted(el: HTMLElement) {
        await nextTick();
        if (window.MathJax && window.MathJax.typesetPromise) {
            await window.MathJax.typesetPromise([el]);
        }
    }
};

export default vMath;