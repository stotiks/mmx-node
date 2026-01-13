<template>
    <div>
        <m-chip>{{ $t("account_header.wallet") }} #{{ index }}</m-chip>

        <m-chip v-if="rows.address" copy>
            {{ rows.address }}
        </m-chip>

        <m-chip v-if="rows.name">{{ rows.name }}</m-chip>

        <q-btn
            v-if="rows.with_passphrase"
            :icon="isLocked ? mdiLock : mdiLockOpenVariant"
            :text-color="isLocked ? 'negative' : 'positive'"
            size="sm"
            round
            class="q-my-auto"
            @click="handleToggleLock"
        >
            <q-tooltip>
                {{ isLocked ? $t("common.unlock") : $t("common.lock") }}
            </q-tooltip>
        </q-btn>
    </div>
</template>

<script setup>
import { mdiLock, mdiLockOpenVariant } from "@mdi/js";

const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
});

import { useWalletAccount } from "@/queries/wapi";
const { rows, loading } = useWalletAccount(props);

const { isLocked, handleToggleLock } = useWalletLocker(props);
</script>
