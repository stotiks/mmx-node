import vault from "@bex/entrypoints/background/vault";

const createHistoryHook = () => {
    // remove "handler" and "result.data"
    const ctxCleanup = (context) => {
        const { handler, result, ...contextWithoutHandlerAndResult } = context;
        const { data, ...resultWithoutData } = result;
        return {
            ...contextWithoutHandlerAndResult,
            result: resultWithoutData,
        };
    };

    return async (context) => {
        const isAcceptRequired = context.handler.body.metadata?.isAcceptRequired ?? true;

        if (isAcceptRequired) {
            const ctx = ctxCleanup(context);

            // no await, fire-and-forget
            vault.addHistoryAsync(ctx).catch((err) => {
                console.warn("[HistoryHook] Failed to save history:", err);
            });
        }
    };
};

export default createHistoryHook;
