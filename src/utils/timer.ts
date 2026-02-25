import {computed, ComputedRef, ref, Ref, ShallowRef} from "vue";
import {useIntervalFn} from "@vueuse/core";


function add0(y: number) {
    const x = "" + y;
    if (x.length <= 1) return "0".repeat(2 - x.length) + x;
    else return x;
}

export interface Timer {
    target: Ref<number>,
    seconds: ComputedRef<number>,
    text: ComputedRef<string>,
    isExpired: ComputedRef<boolean>,
    pause: () => void,
    resume: () => void,
    isActive: Readonly<ShallowRef<boolean>>,
    updateTarget: (target: number) => void
}


export default function useTimer(target: number): Timer {
    const the_target = ref(target);
    const seconds = ref(1);
    const seconds_readonly = computed(() => seconds.value);
    const { pause, resume, isActive } = useIntervalFn(() => {
        seconds.value = Math.max(0,the_target.value - (+new Date())/1000);
        if (seconds.value <= 0) {
            pause();
        }
    }, 1000)
    const isExpired = computed(() => seconds.value <= 0);

    const timer_text = computed(() => {
        const day = Math.floor(seconds.value / 86400);
        const hour = Math.floor((seconds.value % 86400) / 3600);
        const minute = Math.floor((seconds.value % 3600) / 60);
        const second = Math.floor(seconds.value % 60);
        if (day >= 1) {
            return "" + day + ":" + add0(hour) + ":" + add0(minute) + ":" + add0(second);
        } else {
            return "" + hour + ":" + add0(minute) + ":" + add0(second);
        }
    });
    function updateTarget(target: number) {
        the_target.value = target;
    }
    return {
        target: the_target,
        seconds: seconds_readonly,
        text: timer_text,
        isExpired,
        pause,
        resume,
        isActive,
        updateTarget
    };
}