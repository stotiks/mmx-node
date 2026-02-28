<template>
    <div class="q-gutter-y-xs">
        <div>
            <div class="row q-gutter-x-none">
                <m-chip>{{ data.__type }}</m-chip>
                <m-chip v-if="binary">
                    {{ binary.name }}
                </m-chip>
                <m-chip>{{ data.address }}</m-chip>
            </div>

            <q-card flat>
                <ObjectTable :data="data" />
            </q-card>
        </div>
        <div>
            <BalanceTable :address="data.address" />
        </div>
        <div v-if="data.__type != 'mmx.contract.Executable'" class="row justify-end q-gutter-xs">
            <q-btn
                :label="$t('account_contract_summary.deposit')"
                :icon="mdiBankTransferIn"
                outline
                color="positive"
                @click="handleDeposit(index, data.address)"
            />

            <q-btn
                :label="$t('account_contract_summary.withdraw')"
                :icon="mdiBankTransferOut"
                outline
                color="negative"
                @click="handleWithdraw(index, data.address)"
            />
        </div>
    </div>
</template>

<script setup>
import { mdiBankTransferIn, mdiBankTransferOut } from "@mdi/js";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
});

const { chainBinariesSwapped } = useChainBinaries();
const binary = computed(() => chainBinariesSwapped.value[props.data?.binary]);

const router = useRouter();
const handleDeposit = (index, address) => {
    router.push("/wallet/account/" + index + "/send/" + address);
};
const handleWithdraw = (index, address) => {
    router.push("/wallet/account/" + index + "/send_from/" + address);
};
</script>
