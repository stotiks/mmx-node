export const useTryCatchWrapperAsync = () => {
    const $q = useQuasar();
    const tryCatchWrapperAsync = async (fn) => {
        try {
            return await fn();
        } catch (error) {
            $q.notify({ type: "negative", message: error.message });
            throw error;
        }
    };

    return tryCatchWrapperAsync;
};
