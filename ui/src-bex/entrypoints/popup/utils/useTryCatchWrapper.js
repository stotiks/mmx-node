export const useTryCatchWrapper = () => {
    const $q = useQuasar();
    const tryCatchWrapper = async (fn) => {
        try {
            return await fn();
        } catch (error) {
            $q.notify({ type: "negative", message: error.message });
        }
    };

    return tryCatchWrapper;
};
