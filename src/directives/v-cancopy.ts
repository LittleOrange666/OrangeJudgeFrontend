import {useClipboard} from '@vueuse/core'

const {copy} = useClipboard();

const canCopyDirective = {
    // 當元素插入到 DOM 中時呼叫
    mounted(el: HTMLElement) {
        const copy_btn = document.createElement('button');
        copy_btn.className = "copy_btn";
        copy_btn.textContent = "copy";
        el.appendChild(copy_btn);
        el.style.position = "relative";
        copy_btn.addEventListener('click', async () => {
            await copy(el.textContent);
        })
    },

    updated() {

    }
};

export default canCopyDirective;