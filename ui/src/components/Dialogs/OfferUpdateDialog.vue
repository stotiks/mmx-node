<template>
    <q-dialog ref="dialogRef" persistent @show="onDialogShow" @hide="onDialogHide">
        <q-card class="q-dialog-plugin" style="width: 800px; max-width: 100vw">
            <WForm ref="formRef" :data="formData" :default-data="defaultFormData" @submit="handleSubmit">
                <q-toolbar class="bg-primary text-white">
                    <q-toolbar-title class="text-subtitle1">
                        <b> Update {{ offer.address }}</b>
                    </q-toolbar-title>
                </q-toolbar>
                <q-card-section>
                    <div class="q-gutter-y-sm">
                        <div class="row justify-end q-col-gutter-sm">
                            <q-input
                                :model-value="parseFloat((1 / offer.display_price).toPrecision(6))"
                                label="Current Price"
                                input-class="amount-input"
                                :suffix="offer.bid_symbol + ' / ' + offer.ask_symbol"
                                :rules="[rules.required, rules.amount]"
                                readonly
                                class="col-md-4 col-sm-5 col-xs-6"
                            />
                        </div>

                        <div class="row justify-end q-col-gutter-sm">
                            <q-input
                                v-model.number="formData.amount"
                                label="New Price"
                                input-class="amount-input"
                                :suffix="offer.bid_symbol + ' / ' + offer.ask_symbol"
                                :rules="[rules.required, rules.amount]"
                                class="col-md-4 col-sm-5 col-xs-6"
                            />
                        </div>

                        <div class="row justify-end q-col-gutter-sm">
                            <TxFeeSelect v-model="formData.feeRatio" class="col-md-3 col-sm-4 col-xs-6" />
                            <TxFeeInput
                                v-model="fee"
                                :loading="feeIsLoading"
                                :error="feeLatestError"
                                :locked="isLocked"
                                class="col-md-4 col-sm-5 col-xs-6"
                            />
                        </div>
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="row">
                        <div class="col">
                            <WBtnReset />
                        </div>
                        <div class="col-11">
                            <div class="row justify-end q-gutter-x-sm">
                                <WToggleConfirmed />
                                <WBtnSubmit label="Update" />
                                <q-btn :label="$t('common.cancel')" flat @click="onDialogCancel" />
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </WForm>
        </q-card>
    </q-dialog>
</template>

<script setup>
import rules from "@/helpers/rules";
import { get_inv_price_with_decimals } from "@/mmx/wallet/common/offer_data_t";

const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
    offer: {
        type: Object,
        required: true,
    },
});

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const handleSubmit = async () => {
    await handleSend();
    onDialogOK();
};
const onDialogShow = () => {
    if (formRef.value) {
        formRef.value.onDialogShow();
    }
};

const defaultFormData = {
    amount: null,
    feeRatio: null,
};

const formRef = ref(null);
const formData = reactive({ ...defaultFormData });

const payload = computed(() => {
    const newPrice = get_inv_price_with_decimals(formData.amount, props.offer.bid_decimals, props.offer.ask_decimals);
    return {
        index: props.index,
        address: props.offer.address,
        method: "set_price",
        args: [intToHex(newPrice ?? 0)],
        options: {
            //memo: "Update offer price",
            user: props.offer.owner,
            fee_ratio: formData.feeRatio,
        },
    };
});

const { protectedMutate, isLocked } = useWalletLocker(reactive({ index: toRef(() => props.index) }));
const { isValid, isValidConfirmed, isValidUnlocked, isValidConfirmedUnlocked } = useWalletFormStatusL(
    formRef,
    isLocked
);

import { useWalletExecute, useWalletExecuteFeeEstimate } from "@/queries/wapi";
const {
    data: fee,
    isLoading: feeIsLoading,
    latestError: feeLatestError,
} = useWalletExecuteFeeEstimate(payload, isValidConfirmedUnlocked);

const walletExecute = useWalletExecute();
const handleSend = () => protectedMutate(walletExecute, payload.value);
</script>
