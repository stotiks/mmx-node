import vault from "../stores/vault";

export const createHistoryHook = () => {
    return async (context) => {
        if (!vault.isUnlocked) {
            return;
        }

        vault.addHistory({
            method,
            params,
            context,
        });
    };
};
