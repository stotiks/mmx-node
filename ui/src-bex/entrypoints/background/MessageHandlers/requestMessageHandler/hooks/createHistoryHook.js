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
            // TODO: check if vault is unlocked and url has permissions
            const ctx = ctxCleanup(context);
            await vault.addHistoryAsync(ctx);
        }
    };
};

export default createHistoryHook;
