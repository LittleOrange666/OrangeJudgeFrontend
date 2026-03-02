import {computed, ComputedRef, ref, Ref, ShallowRef} from "vue";
import {useIntervalFn} from "@vueuse/core";

/**
 * Adds leading zeros to a number and converts it to a string.
 * Ensures the resulting string has at least two characters.
 * @param {number} y - The number to format.
 * @returns {string} The formatted string with leading zeros.
 */
function add0(y: number) {
    const x = "" + y;
    if (x.length <= 1) return "0".repeat(2 - x.length) + x;
    else return x;
}

/**
 * Represents the structure of a timer.
 */
export interface Timer {
    /** The target time in seconds as a reactive reference. */
    target: Ref<number>,
    /** The remaining seconds as a computed reference. */
    seconds: ComputedRef<number>,
    /** The formatted timer text as a computed reference. */
    text: ComputedRef<string>,
    /** Indicates whether the timer has expired as a computed reference. */
    isExpired: ComputedRef<boolean>,
    /** Pauses the timer. */
    pause: () => void,
    /** Resumes the timer. */
    resume: () => void,
    /** Indicates whether the timer is active as a readonly shallow reference. */
    isActive: Readonly<ShallowRef<boolean>>,
    /** Updates the target time of the timer. */
    updateTarget: (target: number) => void
}

/**
 * Creates and manages a countdown timer.
 * @param {number} target - The target time in seconds since the epoch.
 * @returns {Timer} The timer object with reactive properties and methods.
 */
export default function useTimer(target: number): Timer {
    const the_target = ref(target);
    const seconds = ref(1);
    const seconds_readonly = computed(() => seconds.value);
    const {pause, resume, isActive} = useIntervalFn(() => {
        seconds.value = Math.max(0, the_target.value - (+new Date()) / 1000);
        if (seconds.value <= 0) {
            pause();
        }
    }, 1000);
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

    /**
     * Updates the target time of the timer.
     * @param {number} target - The new target time in seconds since the epoch.
     */
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