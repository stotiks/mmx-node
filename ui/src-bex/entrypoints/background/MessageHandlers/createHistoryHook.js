import vault from "@bex/entrypoints/background/Vault";

export const createHistoryHook = () => {
    // remove "handler" and "result.data"
    const ctxCleanup = (context) =>
        Object.fromEntries(Object.entries(context).filter(([key]) => key !== "handler" && key !== "result.data"));

    return async (context) => {
        const isAcceptRequired = context.handler.metadata?.isAcceptRequired ?? true;

        if (isAcceptRequired) {
            // TODO: check if vault is unlocked and url has permissions
            const ctx = ctxCleanup(context);
            vault.addHistoryAsync(ctx);
        }
    };
};
