import vault from "../stores/vault";

export const createHistoryHook = () => {
    const ctxCleanup = (context) => {
        const { handler, result, ...contextWithoutHandlerAndResult } = context;
        const { data, ...resultWithoutData } = context.result;
        return {
            ...contextWithoutHandlerAndResult,
            result: resultWithoutData,
        };
    };

    return async (context) => {
        const isAcceptRequired = context.handler.metadata?.isAcceptRequired ?? true;

        if (isAcceptRequired) {
            const ctx = ctxCleanup(context);
            vault.addHistoryAsync(ctx);
        }
    };
};
