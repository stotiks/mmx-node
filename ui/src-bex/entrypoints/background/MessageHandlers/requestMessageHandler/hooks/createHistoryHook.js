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

    const historyHook = async (context) => {
        const isAcceptRequired = context.handler.body.metadata?.isAcceptRequired ?? true;

        if (isAcceptRequired) {
            const ctx = ctxCleanup(context);
            await vault.addHistoryAsync(ctx);
        }
    };

    return historyHook;
};

export default createHistoryHook;
