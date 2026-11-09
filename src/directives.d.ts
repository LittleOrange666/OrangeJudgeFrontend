/*
 * OrangeJudge, a competitive programming platform
 *
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
/* eslint-disable */
// Type declarations for directives registered globally in main.ts via app.directive(),
// so IDEs and vue-tsc can resolve v-highlight, v-can-copy, v-math, v-my-click, v-my-submit.
import type highlightDirective from './directives/v-highlight';
import type canCopyDirective from './directives/v-cancopy';
import type mathDirective from './directives/v-math';
import type myClickDirective from './directives/v-my-click';
import type mySubmitDirective from './directives/v-my-submit';

declare module 'vue' {
    interface GlobalDirectives {
        vHighlight: typeof highlightDirective;
        vCanCopy: typeof canCopyDirective;
        vMath: typeof mathDirective;
        vMyClick: typeof myClickDirective;
        vMySubmit: typeof mySubmitDirective;
    }

    interface ComponentCustomProperties {
        vHighlight: typeof highlightDirective;
        vCanCopy: typeof canCopyDirective;
        vMath: typeof mathDirective;
        vMyClick: typeof myClickDirective;
        vMySubmit: typeof mySubmitDirective;
    }
}

export {};
