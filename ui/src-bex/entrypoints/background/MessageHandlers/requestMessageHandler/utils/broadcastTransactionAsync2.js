import { broadcastTransactionAsync, validateTransactionAsync } from "@bex/entrypoints/background/queries";

export const broadcastTransactionAsync2 = async (tx) => {
    if (import.meta.env.DEV) {
        const result = await validateTransactionAsync(tx);

        if (result.error) {
            const message = result.error?.message || result.error;
            throw new Error(message);
        }
    } else {
        await broadcastTransactionAsync(tx);
    }

    const result = {
        id: tx.id,

        ...(import.meta.env.DEV && {
            dev: {
                tx,
            },
        }),
    };
    return result;
};
