/*
 * Copyright (C) 2024-2026 LittleOrange666 (orangeminecraft123@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 */

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