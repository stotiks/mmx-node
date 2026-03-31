import { useQuasar } from "quasar";
import { useClearVaultMutation } from "@bex/entrypoints/popup/queries/vaultMutations";
import { useTryCatchWrapperAsync } from "./useTryCatchWrapperAsync";

export function useRemoveVaultData() {
    const $q = useQuasar();
    const clearMutation = useClearVaultMutation();
    const tryCatchWrapperAsync = useTryCatchWrapperAsync();

    const handleRemoveVaultDataAsync = async () => {
        await tryCatchWrapperAsync(async () => {
            $q.dialog({
                title: "Confirm",
                message: "Are you sure you want to remove the vault data? This action cannot be undone.",
                cancel: true,
                persistent: true,
                ok: {
                    color: "negative",
                },
            }).onOk(async () => {
                await clearMutation.mutateAsync();
            });
        });
    };

    return {
        handleRemoveVaultDataAsync,
    };
}
