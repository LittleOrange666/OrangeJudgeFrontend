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