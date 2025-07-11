import vault from "../stores/vault";

export const createHistoryHook = () => {
    return async (context) => {
        const { handler } = context;
        const isAcceptRequired = handler.metadata?.isAcceptRequired ?? true;
        if (isAcceptRequired) {
            await vault.addHistoryAsync(context);
        }
    };
};
