<template>
    <q-dialog
        ref="dialogRef"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
        @show="onDialogShow"
        @hide="onDialogHide"
    >
        <q-card class="q-dialog-plugin">
            <q-layout view="lHh Lpr lFf">
                <q-page-container>
                    <component :is="pageComponent.component" v-bind="pageComponent.props" v-on="pageComponent.events" />
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

const hasPermissions = ref(false);
const refreshHasPermissionsAsync = async () => {
    hasPermissions.value = await checkVaultPermissionsAsync();
};

const onDialogShow = async () => {};

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked } = storeToRefs(vaultStore);

watch(
    isUnlocked,
    async () => {
        if (isUnlocked.value === true) {
            await refreshHasPermissionsAsync();
        }
    },
    { immediate: true }
);

import UnlockPage from "./pages/UnlockPage.vue";
import RequestPermissionsPage from "./pages/RequestPermissionsPage.vue";
import AcceptPage from "./pages/AcceptPage.vue";

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
const tryCatchWrapperASync = useTryCatchWrapperAsync();

const UnlockPageComponent = {
    component: UnlockPage,
    props,
    events: {},
};

const RequestPermissionsPageComponent = {
    component: RequestPermissionsPage,
    props,
    events: {
        ok: async (result) => {
            if (result.granted === true) {
                await tryCatchWrapperASync(async () => await vaultStore.allowUrlAsync(props.url));
                await refreshHasPermissionsAsync();

                if (props.isAcceptRequired !== true) {
                    onDialogOK();
                }
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

const pageComponent = computed(() => {
    if (isUnlocked.value !== true) {
        return UnlockPageComponent;
    }

    if (hasPermissions.value !== true) {
        return RequestPermissionsPageComponent;
    }

    return AcceptPageComponent;
});
</script>
