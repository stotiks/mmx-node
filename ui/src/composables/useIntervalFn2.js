import { useIntervalFn } from "@vueuse/core";

/**
 * Enhanced interval function that provides dynamic interval control with immediate execution.
 *
 * Features:
 * - Pauses when interval <= 0
 * - Immediately invokes callback when transitioning from paused to active
 * - Immediately invokes callback when interval decreases (faster polling)
 * - Executes callback immediately on initialization if interval > 0
 *
 * @param {Function} cb - Callback function to execute at intervals
 * @param {import('vue').Ref<number> | number} interval - Interval in milliseconds (reactive or static)
 * @returns {Object} VueUse interval function controls (pause, resume, isActive)
 */
export const useIntervalFn2 = (cb, interval) => {
    // Validate callback parameter
    if (typeof cb !== "function") {
        throw new TypeError("useIntervalFn2: callback must be a function");
    }

    const intervalFn = useIntervalFn(cb, interval);

    // Watch for interval changes to handle pause/resume and immediate execution
    watch(interval, (newInterval, oldInterval) => {
        const shouldPause = newInterval <= 0;
        const wasPaused = oldInterval <= 0;
        const isNowActive = newInterval > 0;

        if (shouldPause) {
            intervalFn.pause();
            return;
        }

        // Resume if currently paused
        if (!intervalFn.isActive.value) {
            intervalFn.resume();
        }

        // Determine if callback should execute immediately
        const shouldExecuteImmediately =
            (wasPaused && isNowActive) || // Transitioning from paused to active
            (oldInterval > 0 && newInterval < oldInterval); // Interval decreased (faster polling)

        if (shouldExecuteImmediately) {
            cb();
        }
    });

    // Execute callback immediately on initialization if interval is active
    if (toValue(interval) > 0) {
        cb();
    }

    return intervalFn;
};
