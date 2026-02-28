/**
 * useSecureRef — a thin wrapper around Vue's `ref()` that automatically
 * zeroes out sensitive string / array values when the owning component is
 * unmounted, preventing cryptographic material (seed words, passphrases, …)
 * from lingering in Vue's reactivity system or being visible in Vue Devtools.
 *
 * @param {*} initialValue - The initial value for the ref.
 * @returns {import('vue').Ref} A reactive ref that is cleared on unmount.
 */
export const useSecureRef = (initialValue) => {
    const secureRef = ref(initialValue);

    const clear = () => {
        const val = secureRef.value;
        if (Array.isArray(val)) {
            // Overwrite each element before resetting the array
            for (let i = 0; i < val.length; i++) {
                val[i] = "";
            }
            secureRef.value = [];
        } else if (typeof val === "string") {
            secureRef.value = "";
        } else {
            secureRef.value = null;
        }
    };

    onUnmounted(clear);

    return secureRef;
};
