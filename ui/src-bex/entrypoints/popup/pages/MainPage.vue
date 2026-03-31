<template>
    <q-page padding>
        <div class="q-gutter-y-md">
            <WalletSelect2 />
            <BalanceTable
                v-if="currentWallet"
                :address="currentWallet"
                use-short-addr
                :use-contract-link="false"
                show-empty
            />
        </div>
    </q-page>
</template>

<script setup>
import WalletSelect2 from "@bex/entrypoints/popup/components/WalletSelect2";
import { useIsUnlockedQuery, useCurrentWalletQuery } from "@bex/entrypoints/popup/queries/vaultQueries";

const { data: isUnlocked } = useIsUnlockedQuery();
const { data: currentWallet } = useCurrentWalletQuery(isUnlocked.value);
</script>
