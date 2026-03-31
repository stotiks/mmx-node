import { useQuasar } from "quasar";
import { useClearVaultMutation } from "@bex/entrypoints/popup/queries/vaultMutations";

export function useRemoveVaultData() {
    const $q = useQuasar();
    const clearMutation = useClearVaultMutation();

    const handleRemoveVaultDataAsync = () => {
        return new Promise((resolve) => {
            $q.dialog({
                title: "Confirm",
                message: "Are you sure you want to remove the vault data? This action cannot be undone.",
                cancel: true,
                persistent: true,
                ok: {
                    color: "negative",
                },
            })
                .onOk(async () => {
                    try {
                        await clearMutation.mutateAsync();
                    } catch (error) {
                        $q.notify({ type: "negative", message: error.message });
                    } finally {
                        resolve();
                    }
                })
                .onCancel(() => {
                    resolve();
                });
        });
    };

    return {
        handleRemoveVaultDataAsync,
    };
}
