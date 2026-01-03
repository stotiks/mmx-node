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
        <q-card class="q-dialog-plugin" style="background: var(--q-dark-page)">
            <q-layout view="lHh Lpr lFf">
                <q-page-container>
                    <template v-if="pageComponent">
                        <component
                            :is="pageComponent.component"
                            v-bind="pageComponent.props"
                            v-on="pageComponent.events || {}"
                        />
                    </template>
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

const onDialogShow = async () => {};

import { useVaultStore } from "@bex/entrypoints/popup/stores/vault";
const vaultStore = useVaultStore();
const { isUnlocked, isInitialized } = storeToRefs(vaultStore);

import UnlockPage from "@bex/entrypoints/popup/pages/UnlockPage";
import RequestPermissionsPage from "./pages/RequestPermissionsPage";
import AcceptPage from "./pages/AcceptPage";

import { useTryCatchWrapperAsync } from "@bex/entrypoints/popup/utils/useTryCatchWrapperAsync";
import InitPage from "@bex/entrypoints/popup/pages/InitPage.vue";
const tryCatchWrapperASync = useTryCatchWrapperAsync();

const UnlockPageComponent = {
    component: UnlockPage,
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
        ok: (result) => {
            if (result.accepted === true) {
                onDialogOK({ accepted: true });
            }
        },
        cancel: () => {
            onDialogCancel();
        },
    },
};

const InitPageComponent = {
    component: InitPage,
};

const pageComponent = shallowRef(UnlockPageComponent);

watchEffect(async () => {
    if (!isInitialized.value) {
        pageComponent.value = InitPageComponent;
    } else if (!isUnlocked.value) {
        pageComponent.value = UnlockPageComponent;
    } else if (
        !permissionsGranted.value &&
        (await vaultStore.checkUrlPermissionsAsync(props.url).catch(() => false)) !== true
    ) {
        pageComponent.value = RequestPermissionsPageComponent;
    } else if (props.isAcceptRequired === true) {
        pageComponent.value = AcceptPageComponent;
    } else {
        pageComponent.value = null;
        // close dialog if unlocked, permissions granted and accept not required
        onDialogOK();
    }
});
</script>
