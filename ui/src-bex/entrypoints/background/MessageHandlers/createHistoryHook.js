import vault from "../stores/vault";

export const createHistoryHook = () => {
    return async (context) => {
        if (!vault.isUnlocked) {
            return;
        }
        await vault.addHistoryAsync(context);
    };
};
