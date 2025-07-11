import vault from "../stores/vault";

export const createHistoryHook = () => {
    return async (context) => {
        const { handler, result } = context;
        const isAcceptRequired = handler.metadata?.isAcceptRequired ?? true;
        if (isAcceptRequired) {
            const { data, ...restResult } = result;
            vault.addHistoryAsync({ ...context, result: restResult });
        }
    };
};
