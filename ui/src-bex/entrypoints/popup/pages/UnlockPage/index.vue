<template>
    <q-page padding>
        <div class="fixed-center full-width">
            <div class="row justify-center">
                <q-card flat class="col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-10">
                    <q-card-section>
                        <UnlockForm />
                    </q-card-section>
                    <q-card-section>
                        <q-btn
                            no-caps
                            label="Remove Vault Data"
                            color="negative"
                            size="sm"
                            flat
                            dense
                            @click="handleRemoveVaultDataAsync"
                        />
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import UnlockForm from "./UnlockForm";

import { useRemoveVaultData } from "@bex/entrypoints/popup/utils/useRemoveVaultData";
const { handleRemoveVaultDataAsync } = useRemoveVaultData();
</script>
