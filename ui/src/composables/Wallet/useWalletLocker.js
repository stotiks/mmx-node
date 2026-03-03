import { useQuasar } from "quasar";
import { useQueryClient } from "@tanstack/vue-query";
import { useWalletIsLocked, fetchWalletIsLocked, useWalletLock, useWalletUnlock } from "@/queries/api";
import { useWalletAccount } from "@/queries/wapi";

/** Thrown when the user cancels the passphrase prompt. */
export class PassphraseCancelledError extends Error {
    constructor() {
        super("Passphrase prompt cancelled");
        this.name = "PassphraseCancelledError";
    }
}

export const useWalletLocker = (props) => {
    const queryClient = useQueryClient();

    const { data: account } = useWalletAccount(props);
    const withPassphrase = computed(() => (account.value?.with_passphrase ? account.value.with_passphrase : false));

    const { data: isLockedData } = useWalletIsLocked(props, withPassphrase);

    const isLocked = computed(() => (withPassphrase.value ? (isLockedData.value ?? true) : false));

    const update = async () => {
        await fetchWalletIsLocked(queryClient, props);
    };

    const handleToggleLock = async () => {
        //await update();
        if (isLocked.value) {
            handleUnlock();
        } else {
            await lock(props);
        }
    };

    const walletUnlock = useWalletUnlock(props);
    const unlock = async (passphrase) => {
        await walletUnlock.mutateAsync(passphrase);
    };

    const walletLock = useWalletLock(props);
    const lock = async () => {
        await walletLock.mutateAsync();
    };

    const $q = useQuasar();
    const showPrompt = () =>
        new Promise((resolve, reject) => {
            $q.dialog({
                component: defineAsyncComponent(() => import("@/components/Dialogs/PromptPassphraseDialog")),
            })
                .onOk(async ({ passphrase }) => {
                    resolve(passphrase);
                })
                .onCancel(() => {
                    reject(new PassphraseCancelledError());
                });
        });

    const promptPassphrase = async () => {
        if (isLocked.value) {
            return await showPrompt();
        }
    };

    const handleUnlock = async () => {
        if (isLocked.value) {
            try {
                const passphrase = await promptPassphrase();
                await unlock(passphrase);
            } catch (e) {
                if (e instanceof PassphraseCancelledError) return;
                throw e;
            }
        }
    };

    /**
     * Prompt for passphrase if locked, merge it into payload.options,
     * then call mutation.mutateAsync.
     *
     * @param {Object} mutation       - TanStack useMutation instance
     * @param {Object} payload        - Plain payload object (caller unwraps refs)
     * @param {Object} [mutateOptions] - Optional TanStack mutateAsync options (onSuccess, etc.)
     * @returns {Promise}
     */
    const protectedMutate = async (mutation, payload, mutateOptions) => {
        let passphrase;
        try {
            passphrase = await promptPassphrase();
        } catch (e) {
            if (e instanceof PassphraseCancelledError) return;
            throw e;
        }
        const merged = {
            ...payload,
            options: { ...payload.options, passphrase },
        };
        return mutation.mutateAsync(merged, mutateOptions);
    };

    return {
        isLocked,
        handleToggleLock,
        promptPassphrase, // kept for edge cases (e.g. AccountHeader)
        protectedMutate,
    };
};
