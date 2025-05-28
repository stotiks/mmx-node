<template>
    <div class="q-gutter-y-sm q-mt-sm">
        <q-card flat>
            <q-card-section class="q-gutter-x-xs">
                <q-form @submit="handleUpdate">
                    <div class="row q-gutter-x-sm">
                        <q-input
                            v-model="formData.name"
                            :label="t('create_wallet.account_name')"
                            readonly
                            class="col"
                        />
                        <q-input
                            v-model.number="formData.num_addresses"
                            :label="t('create_wallet.number_of_addresses')"
                            class="col-3"
                        />
                    </div>
                    <div class="q-mt-md row justify-end">
                        <q-btn
                            :label="t('account_options.update')"
                            type="submit"
                            color="positive"
                            outline
                            class="col-2"
                        />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>

        <q-card flat>
            <q-card-section class="q-gutter-x-xs">
                <q-btn :label="$t('account_actions.reset_cache')" color="secondary" outline @click="handleResetCache" />

                <q-btn :label="$t('account_actions.show_seed')" color="secondary" outline @click="handleShowSeed" />
                <q-btn
                    v-if="index >= 100"
                    :label="t('account_options.remove')"
                    color="negative"
                    outline
                    @click="handleRemove"
                />
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { mdiClipboard } from "@mdi/js";
const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
});

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();

import { useWalletAccount, useWalletSeed } from "@/queries/wapi";
const { rows: account, loading } = useWalletAccount(props);

const formData = reactive({
    name: "",
    num_addresses: 1,
});
watchEffect(() => {
    formData.name = account.value.name;
    formData.num_addresses = account.value.num_addresses;
});

import { useRemoveAccount, useResetCache, useSetAddressCount } from "@/queries/api";
const removeAccount = useRemoveAccount();
const resetCache = useResetCache();

const setAddressCount = useSetAddressCount();
const handleUpdate = () => {
    setAddressCount.mutate({ index: props.index, count: formData.num_addresses });
};

const handleResetCache = () => {
    resetCache.mutate(props.index);
};

const walletSeed = useWalletSeed();
const handleShowSeed = async () => {
    await walletSeed.mutateAsync(props, {
        onSuccess: (result) => {
            $q.dialog({
                component: defineAsyncComponent(() => import("@/components/Dialogs/ShowSeedDialog")),
                componentProps: {
                    seed: result["string"],
                    withPassphrase: account.value.with_passphrase,
                    fingerPrint: account.value.finger_print,
                },
            });
        },
    });
};

const handleRemove = () => {
    $q.dialog({
        title: t("account_options.remove_wallet_title"),
        message: t("account_options.remove_wallet_message"),
        cancel: true,
        persistent: true,
        ok: {
            label: t("account_options.remove"),
            color: "negative",
        },
    }).onOk(() => {
        const keyFile = account.value.key_file;
        const params = { index: account.value.account, account: account.value.index };
        removeAccount.mutate(params, {
            onSuccess: () => showRemoveWarning(keyFile),
        });
    });
};

const showRemoveWarning = (keyFile) => {
    $q.dialog({
        type: "warning",
        title: t("account_options.wallet_removed_title"),
        message: t("account_options.wallet_removed_message", { keyFile }),
        persistent: true,
        cancel: false,
    }).onOk(() => {
        router.push("/wallet/");
    });
};
</script>
