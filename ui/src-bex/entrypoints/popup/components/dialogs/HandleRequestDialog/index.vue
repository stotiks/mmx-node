<template>
    <q-dialog
        ref="dialogRef"
        persistent
        maximized
        transition-show="scale"
        transition-hide="scale"
        @show="onDialogShow"
        @hide="onDialogHide"
    >
        <q-card class="q-dialog-plugin">
            <q-layout view="lHh Lpr lFf">
                <q-page-container>
                    <component
                        :is="pageComponent.component"
                        v-if="pageComponent"
                        v-bind="pageComponent.props"
                        v-on="pageComponent.events"
                    />
                </q-page-container>
            </q-layout>
        </q-card>
    </q-dialog>
</template>

<script setup>
const props = defineProps({
    url: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    isAcceptRequired: {
        type: Boolean,
        required: false,
        default: true,
    },
});

import { useDialogPluginComponent } from "quasar";
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

import { vaultService } from "@bex/entrypoints/popup/vaultService";
const checkVaultPermissionsAsync = async () => await vaultService.checkPermissionsAsync(props.url).catch(() => false);

const onDialogShow = async () => {};

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked } = storeToRefs(vaultStore);

import UnlockPage from "@bex/entrypoints/popup/pages/UnlockPage";
import RequestPermissionsPage from "./pages/RequestPermissionsPage";
import AcceptPage from "./pages/AcceptPage";

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperASync = useTryCatchWrapperAsync();

const UnlockPageComponent = {
    component: UnlockPage,
    props,
    events: {},
};

const permissionsGranted = ref(false);
const RequestPermissionsPageComponent = {
    component: RequestPermissionsPage,
    props,
    events: {
        ok: async (result) => {
            if (result.granted === true) {
                await tryCatchWrapperASync(async () => await vaultStore.allowUrlAsync(props.url));
                permissionsGranted.value = true;
            }
        },
        cancel: () => {
            onDialogCancel();
        },
    },
};

const AcceptPageComponent = {
    component: AcceptPage,
    props,
    events: {
        ok: async (result) => {
            if (result.accepted === true) {
                onDialogOK({ accepted: true });
            }
        },
        cancel: () => {
            onDialogCancel();
        },
    },
};

const pageComponent = ref(UnlockPageComponent);

watchEffect(
    async () => {
        if (isUnlocked.value !== true) {
            pageComponent.value = UnlockPageComponent;
        } else if (permissionsGranted.value !== true && (await checkVaultPermissionsAsync()) !== true) {
            pageComponent.value = RequestPermissionsPageComponent;
        } else if (props.isAcceptRequired === true) {
            pageComponent.value = AcceptPageComponent;
        } else {
            pageComponent.value = null;
        }
    },
    { immediate: true }
);

watch(
    () => pageComponent.value,
    () => {
        if (pageComponent.value === null) {
            onDialogCancel();
        }
    },
    { immediate: true }
);
</script>
